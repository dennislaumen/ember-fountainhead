/**
 * Module handling exporting metadata about methods from the YUIDoc classitems;
 * used for generating searchable method names and maintaining a link to the
 * actual class that it belongs to for maximum FUN.
 * @class DataTypes.GenerateMethodsMeta
 * @constructor
 * @param {Array} classItems Array of raw YUIDoc classItems
 * @return {Object} Returns object: `{ name, class, itemtype }` for saving
 */
module.exports = function generateMethodsMeta(classItems) {
  // Sort through the class items, pull out only the methods, create a new array
  // of simplified objects representing the methods
  return classItems.reduce((base, item) => {
    if (item.itemtype === 'method') {
      base.push({
        name: item.name,
        class: item.class,
        type: 'method'
      });
    }
    return base;
  }, []);
};
