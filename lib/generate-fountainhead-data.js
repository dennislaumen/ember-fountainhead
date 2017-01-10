'use strict';
const fs = require('fs');
const path = require('path');

const generateClasses = require('./data-types/generate-classes');
const generateModules = require('./data-types/generate-modules');
const generateSrcFile = require('./data-types/generate-src-file');

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
      fs.writeFileSync(filePath, data, { encoding: 'utf8' });
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
    namespaces: [],
    name: config.name,
    description: config.description,
    version: config.version,
    repository: config.repository,
    logo: config.logo
  };

  // Save raw data, Ember command exits before YUIDoc module finishes file writing
  saveObjectToJSON(
    path.join(output.path, 'yuidoc-data.json'),
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
      path.join(output.path, 'modules', `${moduleData.name}.json`),
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
      path.join(output.path, 'classes', `${classData.name}.json`),
      classData
    );

    // If a class doesn't have a file somehow don't attempt to read the src
    if (!classData.file) { return; }

    try {
      fileContents = fs.readFileSync(path.resolve(classData.file), { encoding: 'utf8' });
    } catch(ex) {
      console.warn(`Failed to read file: ${classData.file}`, ex);
    }

    saveObjectToJSON(
      path.join(output.path, 'files', `${classData.srcFileId}.json`),
      { file: classData.file, content: generateSrcFile(fileContents) }
    );

    // NOTE: ASYNC REQUIRES PROMISIFYING ALL OPERATIONS
    // Read file contents and apply syntax highlighting
    // fs.readFile(path.resolve(classData.file), { encoding: 'utf8' }, (err, fileContents) => {
    //   if (err) { return console.warn(`Unable to save file: ${classData.file}`); }
    //
    //   saveObjectToJSON(
    //     path.join(output.path, 'files', `${classData.srcFileId}.json`),
    //     { file: classData.file, content: generateSrcFile(fileContents) }
    //   );
    // });
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
    path.join(output.path, output.filename),
    yuidocJSON
  );
  saveObjectToJSON(
    path.join(output.path, 'meta.json'),
    docsMeta
  );
};