/**
 * Jest preprocessor to ignore scss imports
 */
var babelJest = require('babel-jest');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.s?css$/)) {
      return '';
    }
    return babelJest.process(src, path);
  }
};
