'use strict';

const concatIntoFile = require('../lib/gulp/concat-into-file.js');
const configuration = require('../lib/gulp/configuration');
const merge = require('merge-stream');
const plugins = require('../lib/gulp/plugins').read();
const tasks = require('../lib/gulp/tasks');

module.exports = (gulp, projectArguments) => {
  let config = configuration.merge(configuration.default(), projectArguments.config);

  let merged = merge();
  let toConcat = config['scripts'].concat;

  let buildFile = function(file) {
    let src = config.scripts.src;

    if(file.src) {
      src = file.src;
    }

    let fileStream = gulp.src(src)
      .pipe(tasks['scripts'](file.settings, plugins, config))
      .pipe(concatIntoFile(file, plugins, config));

    merged.add(fileStream);
  };

  if(!toConcat.length) {
    return merged;
  }

  toConcat.forEach(buildFile);
  return merged;
};
