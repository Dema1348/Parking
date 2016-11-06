(function(){
  'use strict';
  angular
    .module('app.tarjeta')
    .controller('Tarjeta', Tarjeta);

  function Tarjeta($scope,store, $state,utilApi,UiUtils){
    var vm = this;
    var user=store.get('user');
    vm.data={}
    vm.data.user=user;
    console.log(vm.data.user);
 

  }
})();
