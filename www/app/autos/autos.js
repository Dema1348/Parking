(function(){
  'use strict';
  angular
    .module('app.autos')
    .controller('Autos', Autos);

  function Autos($scope, $state, store,UiUtils,HOST,Loader,Message){
    var vm = this;
    vm.getAutos= getAutos;
    vm.formEstacionamiento={};
    vm.create=create;
    vm.eliminar=eliminar;
    vm.edit=edit;
    vm.data = {};

 	  getAutos();

    function getAutos() {
      Loader.show(Message.loader);
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.User.findAutos({api_key:store.get('user').token})
          .then(function(result) {
           console.dir(result.obj);
           vm.data.autos=result.obj;
           console.log(vm.data.autos);
           UiUtils.showToast("Autos encontrados")
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
          .finally(function() {
	         Loader.hide();
	     });
      });

    }

    function eliminar(id,indice) {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(client);
        client.Auto.deleteAuto({api_key:store.get('user').token,id:id})
          .then(function(result) {
            vm.data.autos.splice(indice,1);
            UiUtils.showError(result.obj.message)
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
      });
    };

    function edit(auto) {
      $state.go('app.editAuto',{auto: auto});
    };



    function create() {
      $state.go('app.newAuto')
    };
  }
})();
