'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

var ctrlFolder, ctrlFolderPath, tplFolder, tplFolderPath;

module.exports = yeoman.generators.Base.extend({

  getPrompts: function() {
    var done = this.async();

    var prompts = [{
      name    : 'moduleName',
      message : 'What is your controller\' module name?',
      required: true
    }, {
      name    : 'ctrlName',
      message : 'What is your controller name?',
      required: true
    }];

    this.prompt(prompts, function(props) {

      this.moduleName = s(props.moduleName).slugify().value(); // => demo-user
      this.camelModuleName = s(this.moduleName).camelize().value(); // => demoUser
      this.firstCapCamelModuleName = s(this.camelModuleName).capitalize().value(); // => DemoUser

      this.ctrlName = this.moduleName + '-' + s(props.ctrlName).slugify().value(); // => demo-user
      this.camelCtrlName = s(this.ctrlName).camelize().value(); // => demoUser
      this.firstCapCamelCtrlName = s(this.camelCtrlName).capitalize().value(); // => DemoUser

      ctrlFolder = 'app/components/' + this.moduleName + '/controllers';
      ctrlFolderPath = './' + ctrlFolder + '/';
      tplFolder = 'app/components/' + this.moduleName + '/assets/partials';
      tplFolderPath = './' + tplFolder + '/';

      done();
    }.bind(this));
  },

  copyTemplates: function() {
    this.fs.copyTpl(
      this.templatePath('./_ctrl.js'),
      this.destinationPath(ctrlFolderPath + this.ctrlName + '-ctrl.js'),
      {
        moduleName           : this.moduleName,
        firstCapCamelCtrlName: this.firstCapCamelCtrlName
      });

    this.fs.copyTpl(
      this.templatePath('./_tpl.html'),
      this.destinationPath(tplFolderPath + this.ctrlName + '.tpl.html'),
      {
        moduleName: this.moduleName,
        firstCapCamelCtrlName  : this.firstCapCamelCtrlName
      });
  },

  addRoute: function() {
    var fullPath = 'app/components/' + this.moduleName + '/' + this.moduleName + '.js';
    util.rewriteFile({
      file     : fullPath,
      insertPrev: true,
      needle   : '.when(',
      splicable: [
        ".when('/" + this.moduleName + "/" + this.ctrlName + "', {",
        "  templateUrl: '" + this.moduleName + "/partials/" + this.ctrlName + ".tpl.html',",
        "  controller : '" + this.firstCapCamelCtrlName + "Ctrl'",
        "})"
      ]
    });
  },

  buildScript: function() {
    common.exec('gulp pre-dev')
  }

});
