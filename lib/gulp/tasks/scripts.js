'use strict';

const buildSettings = require('../build-settings.js');
const debug = require('gulp-debug');
const gulp = require('gulp');
const gutil = require('gulp-util');
const isDevelopmentEnv = require('../is-development.js');
const lazypipe = require('lazypipe');
const path = require('path');
const runner = require('../runner.js');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

module.exports = function(settings, plugins, config) {
  return lazypipe()
    .pipe(function() {
      let nodeModulesDir = path.resolve(__dirname, '../../../..');
      let modulesDir = path.resolve('./scripts/modules/');
      let entryFile = path.join(modulesDir, '..' ,'app.js');

      let webpackDefaults = [
        true,
        {
          entry: {
            app: entryFile,
          },
          devtool: isDevelopmentEnv() ? 'source-map' : false,
          output: {
            filename: '[name].js',
          },
          resolveLoader: {
            root: nodeModulesDir,
            modulesDirectories: [
              nodeModulesDir,
              modulesDir,
            ],
          },
          resolve: {
            root: [
              modulesDir,
            ],
          },
          module: {
           loaders: [
             {
               test: /\.js$/,
               exclude: /node_modules\/(?!camper|glasse)/,
               loader: 'babel',
               query: {
                 presets: [
                   'env',
                 ],
                 plugins: [
                   'transform-runtime',
                 ],
               },
             },
           ],
         },
       },
      ];

      plugins.webpack = webpackStream;

      let taskSettings = buildSettings('webpack', webpackDefaults, settings);

      if(taskSettings.log === true) {
        gutil.log(
          'node_modules directory: ', nodeModulesDir, '\n',
          'modules directory: ', modulesDir, '\n',
          'entry file: ', entryFile, '\n',
          'output file: ', taskSettings[1].output.filename
        );
      }

      return runner('webpack', taskSettings, settings, plugins);
    })
    .pipe(function() {
      let uglifyDefaults = [
        ('*.js' && !isDevelopmentEnv()),
        {}
      ];

      let taskSettings = buildSettings('uglify', uglifyDefaults, settings);
      return runner('uglify', taskSettings, settings, plugins);
    })();
};
