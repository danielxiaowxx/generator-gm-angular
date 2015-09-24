'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var child_process = require('child_process');
var yosay = require('yosay');
var Promise = require('bluebird');
var path = require('path');
var s = require('underscore.string');
var logger = require('./logger');

var exec = function (cmd) {
  return new Promise(function (resolve, reject) {
    child_process.exec(cmd, function (err, res) {
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

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
        exec('cd ' + folder + ' && npm install --verbose && bower install --verbose && gulp pre-dev')
          .then(function () {
            logger.log('');
            logger.green('------------------------------------------');
            logger.green('Your application is ready!');
            logger.log('');
            logger.green('To Get Started, run the following command:');
            logger.log('');
            logger.yellow('cd ' + folder + ' && gulp develop');
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

    exec('git --version')
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

  cloneRepo: function () {
    var done = this.async();

    logger.green('Cloning the gm-angular repo.......');

    exec('git clone http://gitlab.globalmarket.com/spec/gm-angular-seed-project.git ' + folder)
      .then(function () {
        done();
      })
      .catch(function (err) {
        logger.red(err);
        return;
      });
  },

  removeFiles: function () {
    var done = this.async();

    var files = [
      'package.json',
      'bower.json',
      'app/index.html'
    ];

    var remove = [];

    for(var i = 0; i < files.length; i++) {
      remove.push(exec('rm ./' + folder + '/' + files[i]));
    };

    Promise.all(remove)
      .then(function () {
        done();
      })
      .catch(function (err) {
        logger.red(err);
        return;
      });
  },

  remoteGitRemote: function() {
    var done = this.async();

    exec('cd ' + folder + ' && git remote remove origin').then(function() {
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
      default: 'GlobalMarket, AngularJS'
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

    // copy bower.json
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath(folderPath + 'bower.json'),
      {
        slugifiedAppName: this.slugifiedAppName,
        appDescription: this.appDescription,
        capitalizedAppAuthor: this.capitalizedAppAuthor
      });

    // copy app/index.html
    this.fs.copyTpl(
      this.templatePath('app/_index.html'),
      this.destinationPath(folderPath + 'app/index.html'),
      {
        slugifiedAppName: this.slugifiedAppName
      });
  }

});
