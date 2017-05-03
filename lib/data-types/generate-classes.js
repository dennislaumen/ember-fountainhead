'use strict';
const parseMarkdown = require('../parse-markdown');

/**
 * Module handles decorating and compiling classes and their class items including:
 * - Compiling each class item to its class
 * - Creating an id for class and class src file
 * - Parsing class and class item descriptions markdown to HTML
 * @class DataTypes.GenerateClasses
 * @constructor
 * @param {Object} classes    Object of raw YUIDoc classes
 * @param {Object} classItems Array of raw YUIDoc classItems
 * @return {Object} Returns object: `{ classesMeta, classesDatas }` for saving
 */
module.exports = function generateClass(classes, classitems) {
  let classesMeta = [];
  let classesDatas = [];
  let map = {};

  // Prep classes by adding arrays for methods/properties/events
  for (let classKey in classes) {
    if (!classes.hasOwnProperty(classKey)) { return; }
    Object.assign(classes[classKey], { method: [], property: [], event: [] });
  }

  // ========================================================
  // Decorate && Sort Class Items
  // ========================================================

  // Sort alphabet style
  classitems.sort((a, b) => {
    if (a.name === b.name) { return 0; }
    return a.name < b.name ? -1 : 1;
  });

  /*
   * Class items can have duplicate entries, which should be deduped for the
   * final ouput. Handle picking last declared item by working array by starting
   * from the END. Each item is added to a map which prevents dupes from being
   * picked up. Items are added using their name && type b/c duplicate names with
   * different types is valid.
   */
  for (let i = classitems.length - 1, ii = 0; i >= ii; i--) {
    let item = classitems[i];

    // Only handle item if it is not already in map, prevents dupes
    if (!map[`${item.name}_${item.class}`]) {
      if (item.description) { item.description = parseMarkdown(item.description); }
      if (item.deprecationMessage) { item.deprecationMessage = parseMarkdown(item.deprecationMessage); }
      if (item.params && item.params.length) {
        item.params.forEach(param => {
          param.description = param.description ? parseMarkdown(param.description) : null;
        });
      }

      // Attach to the right parent class
      if (item.class) {
        classes[item.class].classitems.unshift(item);
      }

      // Attach to parent class type array
      if (item.itemtype) {
        classes[item.class][item.itemtype].unshift(item);
      }

      // Add src file id for reference
      if (item.file) {
        item.srcFileId = item.file.replace(/\/|\\/g, '_');
      }

      // Add to map to prevent dupes
      map[`${item.name}_${item.class}`] = true;
    }
  }

  // ========================================================
  // Decorate && Sort Classes
  // ========================================================

  for (let classKey in classes) {
    if (!classes.hasOwnProperty(classKey)) { return; }

    const klass = classes[classKey];
    const klassMethods = klass.classitems.filter(item => {
      return (item.itemtype === 'method');
    }).map(method => method.name);

    // Add class meta
    classesMeta.push({
      methods: klassMethods,
      name: klass.name,
      type: 'classes'
    });

    // Add src file id for reference
    if (klass.file) {
      klass.srcFileId = klass.file.replace(/\/|\\/g, '_');
    }

    // Parse class markdown description
    if (klass.description) {
      klass.description = parseMarkdown(klass.description);
    }

    // Add class object that will be saved as individual file
    classesDatas.push(klass);
  }

  // Alphabetize meta for sidebar display
  classesMeta.sort((a, b) => a.name < b.name ? -1 : 1);

  return {
    classesMeta: classesMeta,
    classesDatas: classesDatas
  };
};
