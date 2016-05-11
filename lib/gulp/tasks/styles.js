'use strict';

const gulp = require('gulp');
const lazypipe = require('lazypipe');
const path = require('path');

const buildSettings = require('../build-settings.js');
const runner = require('../runner.js');

module.exports = function(settings, plugins, config) {
  return lazypipe()
    .pipe(function() {
      let settingsDistDir = (settings && settings.dist_dir) ? settings.dist_dir : '';

      let defaults = [
        true,
        {
          file: path.join(config.dist_dir, settingsDistDir),
        }
      ];
      let taskSettings = buildSettings('newer', defaults, settings);
      return plugins.gulpif(taskSettings[0], plugins.newer(taskSettings[1].file));
    })
    .pipe(function() {
      let defaults = [
        '*.styl',
        {
          import: [
            '../base/_variables.styl',
            '../base/_mixins.styl',
          ],
        },
      ];
      return runner('stylus', defaults, settings, plugins);
    })
    .pipe(function() {
      let defaults = [
        true,
        {},
      ];
      return runner('autoprefixer', defaults, settings, plugins);
    })
    .pipe(function() {
      let defaults = [
        false,
        {
          discardComments: {
            removeAll: true,
          },
          discardDuplicates: true,
          colormin: true,
          discardEmpty: true,
          discardUnused: false,
          mergeRules: true,
          mergeLonghand: true,
          minifyFontValues: true,
          minifySelectors: true,
          minifyGradients: true,
          uniqueSelectors: true,
          zindex: true,
        },
      ];
      return runner('cssnano', defaults, settings, plugins);
    })();
};
