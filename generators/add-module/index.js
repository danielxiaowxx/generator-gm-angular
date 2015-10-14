'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

var folderPath, folder;

module.exports = yeoman.generators.Base.extend({

  init: function() {
    this.argument('name', {
      required: true,
      type    : String,
      desc    : 'The angular-module name'
    });

    this.log('You called the GmAngular add-module with the argument ' + this.name + '.');

    // example: name = demo-user
    this.moduleName = s(this.name).slugify().value(); // => demo-user
    this.camelModuleName = s(this.moduleName).camelize().value(); // => demoUser
    this.firstCapCamelModuleName = s(this.camelModuleName).capitalize().value(); // => DemoUser

    folder = 'public/app/components/' + this.moduleName;
    folderPath = './' + folder + '/';
  },

  copyModule: function() {
    var done = this.async();
    common.exec('cp -rf ' + this.templatePath('.') + ' ' + this.destinationPath(folderPath)).then(function() {
      done();
    })

  },

  removeFiles: function() {
    common.removeFiles(this, [
      '_module.js',
      'assets/less/_style.less',
      'services/_rest-service.js'
    ], folder)
  },

  copyTemplates: function() {

    this.fs.copyTpl(
      this.templatePath('./_module.js'),
      this.destinationPath(folderPath + this.moduleName + '.js'),
      {
        moduleName             : this.moduleName,
        firstCapCamelModuleName: this.firstCapCamelModuleName
      });

    this.fs.copyTpl(
      this.templatePath('./services/_rest-service.js'),
      this.destinationPath(folderPath + 'services/' + this.moduleName + '-rest-service.js'),
      {
        moduleName     : this.moduleName,
        camelModuleName: this.camelModuleName
      });

    this.fs.copyTpl(
      this.templatePath('./assets/less/_style.less'),
      this.destinationPath(folderPath + 'assets/less/' + this.moduleName + '.less'),
      {
        moduleName             : this.moduleName,
        firstCapCamelModuleName: this.firstCapCamelModuleName
      });
  },

  addLessImport: function() {
    var fullPath = 'public/app/assets/less/app.less';
    util.rewriteFile({
      file     : fullPath,
      needle   : '@import "app-special";',
      splicable: [
        '',
        '@import "../../components/' + this.moduleName + '/assets/less/' + this.moduleName + '.less";'
      ]
    });
  },

  addScript: function() {
    var fullPath = 'public/app/index.html';
    util.rewriteFile({
      file     : fullPath,
      needle   : '<!--/build -->',
      splicable: [
        '<!--build:js js/components/' + this.moduleName + '/' + this.moduleName + '.min.js-->',
        '<script type="text/javascript" src="js/components/' + this.moduleName + '/' + this.moduleName + '.js"></script>',
        '<!--/build -->'
      ]
    });
  },

  addDependencyToApp: function() {
    var fullPath = 'public/app/app.js';
    util.rewriteFile({
      file       : fullPath,
      isAppend   : true,
      appendAfter: true,
      needle     : "'demo'",
      splicable  : [
        ", '" + this.moduleName + "'"
      ]
    });
  },

  buildScript: function() {
    common.exec('cd public && gulp pre-dev')
  }
});
