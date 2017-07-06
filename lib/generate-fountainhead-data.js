'use strict';
const { readFileSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');

const generateClasses = require('./data-types/generate-classes');
const generateModules = require('./data-types/generate-modules');
const generateSrcFile = require('./data-types/generate-src-file');
const generateGuide = require('./data-types/generate-guide');

const logger = require('./logger');
const readDirRecursive = require('./utils/read-dir-recursive');

function safeReadFile(filePath) {
  try {
    return readFileSync(resolve(filePath), { encoding: 'utf8' });
  } catch (err) {
    return console.warn(`Failed to read file: ${filePath}`, err);
  }
}

/**
 * This module handles coordinating parsing/reading/saving all of the individual
 * Fountainhead data files after the configs have been validated and the raw
 * YUIDoc data has been generated.
 *
 * Module should:
 * - create and populate `docsMeta` that will be saved as `meta.json`
 * - generate decorated modules files
 * - generate decorated class files
 * - generate decorated src file files
 *
 * NOTE: When switching doc generation from an executable to a function call
 * all file operations had to be changed to a synchronous operation b/c the ember
 * command finishes before the async file operations are complete and the contents
 * are not written to file. This can be switched back to an async method by
 * assembling and returning a promise.all for all async file calls
 *
 * @class generateFountainheadData
 * @constructor
 * @uses DataTypes.GenerateModules
 * @uses DataTypes.GenerateClasses
 * @uses DataTypes.GenerateSrcFile
 * @param {Object} config     Project configuration file
 * @param {Object} yuidocJSON Raw yuidoc generated documentation JSON
 * @return {undefined}
 */
module.exports = function generateFountainheadData(config, yuidocJSON) {
  const output = config.output;

  /**
   * Call to handle saving data to a file. Requires a file path and data to save.
   * If data is not a string, it will be stringified
   * @method saveObjectToJSON
   * @param {string}        filePath Path to save file at
   * @param {Object|string} data     Data to save in file
   * @return {boolean} True for successful operation, false for failures
   */
  function saveObjectToJSON(filePath, data) {
    try {
      data = JSON.stringify(data, null, 2);
      writeFileSync(filePath, data, { encoding: 'utf8' });
      return true;
    } catch(ex) {
      console.warn('Unable to save class JSON');
      return false;
    }

    // NOTE: ASYNC REQUIRES PROMISIFYING ALL OPERATIONS
    // fs.writeFile(filePath, data, err => {
    //   if (err) { console.warn(`Unable to save ${filePath}`); }
    // });
  }

  // Create meta object for docs that gets saved as `meta.json`
  /**
   * The `docsMeta` object is the guide for the documentation data. It contains
   * descriptions of the project as well as arrays of module and class routing
   * information
   * @property docsMeta
   * @type {Object}
   */
  let docsMeta = {
    parser: 'YUIDoc', // We may support JSDoc someday
    name: config.name,
    description: config.description,
    version: config.version,
    repository: config.repository,
    logo: config.logo,
    guides: []
  };
  // hashRouting sets Fountainhead to use query params for auto scroll targets.
  // We default to fragment ids and only override this if the consuming app is using
  // hash location routing.
  if (config.hashRouting) { docsMeta.hashRouting = true; }

  // Save raw data, Ember command exits before YUIDoc module finishes file writing
  saveObjectToJSON(
    join(output.path, 'yuidoc-data.json'),
    yuidocJSON
  );


  // ========================================================
  // Parse Modules
  // ========================================================
  const modulesData = generateModules(yuidocJSON.modules);
  // Update addon meta
  docsMeta.modules = modulesData.modulesMeta;
  // Save each module
  modulesData.modulesDatas.forEach(moduleData => {
    saveObjectToJSON(
      join(output.path, 'modules', `${moduleData.name}.json`),
      moduleData
    );
  });

  // ========================================================
  // Parse Classes and Class Items
  // ========================================================
  const classesData = generateClasses(yuidocJSON.classes, yuidocJSON.classitems);
  // Update addon meta
  docsMeta.classes = classesData.classesMeta;
  // Save each class && save class' source file
  classesData.classesDatas.forEach(classData => {
    let fileContents;

    saveObjectToJSON(
      join(output.path, 'classes', `${classData.name}.json`),
      classData
    );

    // If a class doesn't have a file somehow don't attempt to read the src
    if (!classData.file) { return; }

    try {
      fileContents = readFileSync(resolve(classData.file), { encoding: 'utf8' });
    } catch(ex) {
      console.warn(`Failed to read file: ${classData.file}`, ex);
    }

    saveObjectToJSON(
      join(output.path, 'files', `${classData.srcFileId}.json`),
      { file: classData.file, content: generateSrcFile(fileContents) }
    );

    // NOTE: ASYNC REQUIRES PROMISIFYING ALL OPERATIONS
    // Read file contents and apply syntax highlighting
    // fs.readFile(resolve(classData.file), { encoding: 'utf8' }, (err, fileContents) => {
    //   if (err) { return console.warn(`Unable to save file: ${classData.file}`); }
    //
    //   saveObjectToJSON(
    //     join(output.path, 'files', `${classData.srcFileId}.json`),
    //     { file: classData.file, content: generateSrcFile(fileContents) }
    //   );
    // });
  });

  // ========================================================
  // Parse Guides
  // ========================================================
  // 1. Check for guides in /guides and include in set first
  let guidesFiles = []; // Final guide set -> order added matches nav display order
  try {
    guidesFiles = guidesFiles.concat(readDirRecursive('guides'));
  } catch (err) { err; }

  // 2. For each configured guide in `fountainhead.js` check if guide is a `.md` file
  // and add to base if it isn't already there, else ASSume it's a dir and call
  // recursive read to add all guides in it to set
  config.guides.forEach(guideConfig => {
    if (guideConfig.match(/\.md$/)) {
      if (guidesFiles.indexOf(guideConfig) === -1) {
        guidesFiles.push(guideConfig);
      }
    } else {
      // Directory, concat all files
      guidesFiles = guidesFiles.concat(readDirRecursive(guideConfig));
    }
  });

  // 3. For each guide in set, handle reading/formatting/saving file/group
  guidesFiles.forEach(guideConfig => {
    // If `guideConfig` is an object literal it is data for a guide group. Add to
    // meta and EXIT
    if (typeof guideConfig === 'object') {
      docsMeta.guides.push(Object.assign(guideConfig, {
        linkText: guideConfig.linkText || guideConfig.id,
        guideGroup: true,
        type: 'guides',
        guides: []
      }));
      return;
    }

    // Handles reading frontmatter, parsing guide body, assigning defaults
    let guide = generateGuide({
      filePath: guideConfig,
      fileSrc: safeReadFile(guideConfig)
    });

    // For each formatted guide, handle private vs protected vs group vs guide
    if (guide.attributes.private) {
      // Private access guides should not be saved or included in meta
      return;
    } else if (guide.attributes.protected) {
      // Protected guides should be saved in /docs, but not included in meta
      saveObjectToJSON(
        join(output.path, 'guides', `${guide.id}.json`),
        guide
      );
      return;
    } else if (guide.attributes.group) {
      // If the formatted guide is group, it needs to be added to that group's
      // nested guides array. Find group and add
      let guideGroup = docsMeta.guides.filter(g => g.id === guide.attributes.group);

      if (guideGroup.length) {
        guideGroup[0].guides.push(guide);
      } else {
        // If a group doesn't exist yet create one on the fly
        docsMeta.guides.push({
          id: guide.attributes.group,
          linkText: guide.attributes.group,
          guideGroup: true,
          type: 'guides',
          guides: [guide]
        });
      }
    } else {
      docsMeta.guides.push(guide);
    }

    // All guides are saved to flat /output/guides/ directory for consistent API paths
    saveObjectToJSON(
      join(output.path, 'guides', `${guide.id}.json`),
      guide
    );
  });

  // ========================================================
  // Save Fountainhead Master and Meta Data Files
  // ========================================================

  /*
   * SHABANGLE!!! Documentation files have been generated and saved. Finish
   * generating fountainhead data by saving master data file and documentation
   * meta file
   */
  saveObjectToJSON(
    join(output.path, output.filename),
    yuidocJSON
  );
  saveObjectToJSON(
    join(output.path, 'meta.json'),
    docsMeta
  );

  // ========================================================
  // Error Logging
  // ========================================================

  /*
   * If quiet is falsey, pass the generated yuidoc warnings to our logger with
   * the list of white listed tags. This lets us support logging warnings
   * without warning about supported tags like `@passed`
   */
  if (!config.quiet) {
    logger({
      warnings: yuidocJSON.warnings,
      whiteListTags: config.whiteListTags
    });
  }
};
