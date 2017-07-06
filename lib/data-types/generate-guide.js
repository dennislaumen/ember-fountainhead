'use strict';
const frontMatter = require('front-matter');

const parseMarkdown = require('../parse-markdown');

/**
 * Handle syntax highlighting and creating meta information for a src file
 * @class DataTypes.GenerateGuide
 * @constructor
 * @param {Object} data
 * @param {string} data.fileSrc    Guide file src
 * @param {string} data.filePath Configured guide file path
 * @return {Object} Returns an object with guide data in the shape of:
 *                  `{ attributes, body, id, type }`
 *                  With the body parsed for markdown and handlebars contents
 */
module.exports = function generateGuide({ fileSrc, filePath }) {
  // front-matter will pull guide meta data out and return content as body
  const guide = frontMatter(fileSrc);

  // Fallback to the guide file path if an id isn't declared
  guide.id = guide.attributes.id || filePath.replace(/\\|\//g, '_');
  guide.attributes.linkText = guide.attributes.linkText || guide.attributes.linkLabel || guide.id;
  guide.type = 'guides';
  guide.body = parseMarkdown(guide.body);

  return guide;
};
