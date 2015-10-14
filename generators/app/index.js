'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Promise = require('bluebird');
var path = require('path');
var s = require('underscore.string');
var logger = require('./logger');
var common = require('./common');

// Global Variables
var folder, folderPath;

module.exports = yeoman.generators.Base.extend({

  /**
   * 初始化
   */
  init: function() {

    this.pkg = this.fs.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        logger.green('Running npm install for you....');
        logger.green('This may take a couple minutes.');
        logger.log('installing node project');
        common.exec('cd ' + folder + ' && npm install')
          .then(function() {
            logger.log('installing angular project');
            return common.exec('cd ' + folder + '/public && npm install && bower install && gulp pre-dev')
          })
          .then(function () {
            logger.log('');
            logger.green('------------------------------------------');
            logger.green('Your application is ready!');
            logger.log('');
            logger.green('To Get Started, run the following command:');
            logger.log('');
            logger.yellow('cd ' + folder + ' && nodemon bin/www');
            logger.log('');
            logger.yellow('cd ' + folder + '/public && gulp develop');
            logger.log('');
            logger.green('Happy Hacking!');
            logger.green('------------------------------------------');
          });
      }
    });
  },

  /**
   * 检查git是否安装
   */
  checkForGit: function () {
    var done = this.async();

    common.exec('git --version')
      .then(function () {
        done();
      })
      .catch(function (err) {
        logger.red(new Error(err));
        return;
      });
  },

  /**
   * 打印欢迎信息
   */
  welcomeMessage: function () {
    logger.log(yosay(
      'Welcome to the luminous ' + chalk.red('GmAngular') + ' generator!'
    ));
  },

  promptForFolder: function () {
    var done = this.async();

    var prompt = {
      name: 'folder',
      message: 'In which folder would you like the project to be generated? ',
      default: 'gm-angular'
    };

    this.prompt(prompt, function (props) {
      folder = props.folder;
      folderPath = './' + folder + '/';
      done();
    }.bind(this));
  },

  cloneAPIRepo: function() {
    var done = this.async();

    logger.green('Cloning the gm-restify-node-api-seed repo.......');

    common.exec('git clone http://gitlab.globalmarket.com/spec/gm-restify-node-api-seed.git --branch master --single-branch ' + folder)
      .then(function () {
        done();
      })
      .catch(function (err) {
        logger.red(err);
        return;
      });
  },

  cloneGMAngularRepo: function () {
    var done = this.async();

    logger.green('Cloning the gm-angular repo.......');

    common.exec('cd ./' + folder + '/public && rm -rf ./* && git clone http://gitlab.globalmarket.com/spec/gm-angular-seed-project.git --branch master --single-branch .')
      .then(function () {
        done();
      })
      .catch(function (err) {
        logger.red(err);
        return;
      });
  },

  removeFiles: function() {
    common.removeFiles(this, [
      'package.json',
      'public/package.json',
      'public/bower.json',
      'public/app/index.html'
    ], folder)
  },

  remoteGitRemote: function() {
    var done = this.async();

    common.exec('cd ' + folder + ' && git remote remove origin').then(function() {
      return common.exec('cd ' + folder + '/public && git remote remove origin')
    }).then(function() {
      done();
    })
    .catch(function (err) {
      logger.red(err);
      return;
    });

  },

  getPrompts: function () {
    var done = this.async();

    var prompts = [{
      name: 'appName',
      message: 'What would you like to call your application?',
      default: folder
    }, {
      name: 'appDescription',
      message: 'How would you describe your application?',
      default: 'globalmarket angular front-end project'
    }, {
      name: 'appKeywords',
      message: 'How would you describe your application in comma seperated key words?',
      default: 'GlobalMarket, AngularJS, Restify, API'
    }, {
      name: 'appAuthor',
      message: 'What is your company/author name?'
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appKeywords = props.appKeywords;
      this.appAuthor = props.appAuthor;

      this.slugifiedAppName = s(this.appName).slugify().value();
      this.humanizedAppName = s(this.appName).humanize().value();
      this.capitalizedAppAuthor = s(this.appAuthor).capitalize().value();

      done();
    }.bind(this));
  },

  copyTemplates: function () {

    // copy package.json
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(folderPath + 'package.json'),
      {
        slugifiedAppName: this.slugifiedAppName,
        appDescription: this.appDescription,
        capitalizedAppAuthor: this.capitalizedAppAuthor
      });

    // copy package.json
    this.fs.copyTpl(
      this.templatePath('public/_package.json'),
      this.destinationPath(folderPath + 'public/package.json'),
      {
        slugifiedAppName: this.slugifiedAppName,
        appDescription: this.appDescription,
        capitalizedAppAuthor: this.capitalizedAppAuthor
      });

    // copy bower.json
    this.fs.copyTpl(
      this.templatePath('public/_bower.json'),
      this.destinationPath(folderPath + 'public/bower.json'),
      {
        slugifiedAppName: this.slugifiedAppName,
        appDescription: this.appDescription,
        capitalizedAppAuthor: this.capitalizedAppAuthor
      });

    // copy app/index.html
    this.fs.copyTpl(
      this.templatePath('public/app/_index.html'),
      this.destinationPath(folderPath + 'public/app/index.html'),
      {
        slugifiedAppName: this.slugifiedAppName
      });
  }

});
