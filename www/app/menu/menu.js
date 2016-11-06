(function(){
  'use strict';
  angular.module('app.menu')
    .controller('Menu', Menu);

  function Menu($state, $scope, $ionicHistory, store){
    var vm = this;
    var user=store.get('user');
    vm.logout = logout;
    vm.data={}
    vm.data.user=user;

    function logout(){
       $ionicHistory.clearCache(['app']).then(function() {
           store.remove('user');
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          $state.go('login');
     
       });
     
    };

  }
})();
