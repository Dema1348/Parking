(function(){
  'use strict';
  angular
    .module('app.estacionamientos')
    .controller('EstacionamientosDenegado', EstacionamientosDenegado);

  function EstacionamientosDenegado($scope, $state, store,UiUtils,$ionicHistory,HOST){
    var vm = this;
    vm.updateRol= updateRol;
    vm.formEstacionamiento={};


    function updateRol() {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.User.updateRol({api_key:store.get('user').token})
          .then(function(result) {
           console.dir(result.obj);
            var user= store.get('user');
            user.rol=1;
            store.set('user',user);
            UiUtils.showError(result.obj.message).then(function() {
              $ionicHistory.nextViewOptions({
                historyRoot: true
            });
              $state.go('app.estacionamientos');
            })
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
      });

    }


  }
})();
