(function() {

  // 声明模块控制器
  angular.module('<%= moduleName %>.service', ['common.service']);
  angular.module('<%= moduleName %>.controller', []);

  // 声明模块
  var module = angular.module('<%= moduleName %>', ['<%= moduleName %>.controller', 'ui.bootstrap', 'plupload.directive']);

  /**
   * constants
   */
  module.constant('<%= moduleName %>Constants', {});

  /**
   * values
   */
  module.value('<%= moduleName %>Values', {});

  /**
   * config
   */
  module.config(['$routeProvider',
    function config($routeProvider) {

      $routeProvider
        //.when('/<%= moduleName %>/<%= moduleName %>-list', {
        //  templateUrl: '<%= moduleName %>/partials/<%= moduleName %>-list.tpl.html',
        //  controller : '<%= firstCapCamelModuleName %>ListCtrl'
        //})
        .when('/<%= moduleName %>', {redirectTo: '/<%= moduleName %>/<%= moduleName %>-list'});
    }
  ]);

})();