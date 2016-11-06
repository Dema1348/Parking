(function(){
  'use strict';
  angular
    .module('app.perfil')
    .controller('Perfil', Perfil);

  function Perfil($scope,store, $state,utilApi,UiUtils){
    var vm = this;
    var user=store.get('user');
    vm.data={}
    vm.data.user=user;
    console.log(vm.data.user);
 

  }
})();
