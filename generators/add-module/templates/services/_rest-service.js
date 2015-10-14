
(function() {

  var serviceModule = angular.module('<%= moduleName %>.service');

  serviceModule.constant('<%= camelModuleName %>ServiceConst', {
    backendContext: '/<%= camelModuleName %>RestService'
  });

  serviceModule.factory('<%= camelModuleName %>RestService', ['utilService', '<%= camelModuleName %>ServiceConst',
      function <%= camelModuleName %>RestService(utilService, <%= camelModuleName %>ServiceConst) {

        return {

        };

      }]
  );

})();