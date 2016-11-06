(function(){
  'use strict';
  angular
    .module('app.pagos')
    .controller('Pagos', Pagos);

  function Pagos($scope,store, $state,utilApi,UiUtils,HOST){
    var vm = this; 
    vm.data={}

     getPagos();

    function getPagos() {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.User.findPagos({api_key:store.get('user').token})
          .then(function(result) {
           console.dir(result.obj);
           vm.data.pagos=result.obj;
           console.log(vm.data.autos);
           UiUtils.showToast("Autos encontrados")
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          });
      });

    }


  }
})();
