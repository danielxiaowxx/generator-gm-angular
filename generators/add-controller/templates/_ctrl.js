/**
 * Created by danielxiao on 15/1/28.
 */

(function() {

  angular.module('<%= moduleName %>.controller').controller('<%= firstCapCamelCtrlName %>Ctrl', ['$scope',

    function <%= firstCapCamelCtrlName %>Ctrl($scope) {

      /*========== Scope Models ==================================================*/

      /*========== Scope Functions ==================================================*/

      /*========== Listeners ==================================================*/

      $scope.$on('$routeChangeSuccess', function() {
        _init();
      });

      /*========== Watches ==================================================*/

      /*========== Private Functions ==================================================*/

      function _init() {
      }

    }
  ]);

})();