import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

setResolver(resolver);
start();

// NOTE: testing using polyfill.io in test index.html

// Phantom Shims for A++ Testing
// ---------------------------------------------------------------------------
// string.includes, thanks MDN
// if (!String.prototype.includes) {
//   String.prototype.includes = function(search, begin) {
//     'use strict';
//     if (typeof begin !== 'number') {
//       begin = 0;
//     }
//
//     if (begin + search.length > this.length) {
//       return false;
//     } else {
//       return this.indexOf(search, begin) !== -1;
//     }
//   };
// }
//
// // Object.assign, thanks MDN
// if (typeof Object.assign !== 'function') {
//   Object.assign = function(target, varArgs) { // .length of function is 2
//     'use strict';
//     if (target === null || target === undefined) { // TypeError if undefined or null
//       throw new TypeError('Cannot convert undefined or null to object');
//     }
//
//     var to = Object(target);
//
//     for (var index = 1; index < arguments.length; index++) {
//       var nextSource = arguments[index];
//
//       if (nextSource !== null || nextSource !== null) { // Skip over if undefined or null
//         for (var nextKey in nextSource) {
//           // Avoid bugs when hasOwnProperty is shadowed
//           if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
//             to[nextKey] = nextSource[nextKey];
//           }
//         }
//       }
//     }
//     return to;
//   };
// }
