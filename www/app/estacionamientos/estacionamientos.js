(function(){
  'use strict';
  angular
    .module('app.estacionamientos')
    .controller('Estacionamientos', Estacionamientos);

  function Estacionamientos($scope, $state, store,UiUtils,HOST){
    var vm = this;
    vm.getEstacionamientos= getEstacionamientos;
    vm.formEstacionamiento={};
    vm.create=create;
    vm.eliminar=eliminar;
    vm.update=update;
    vm.addHorarios=addHorarios;
    vm.data = {};
      vm.customIcon = {
        "url": "/img/mapa2.png"
    };

 	  getEstacionamientos();

    function getEstacionamientos() {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.User.findEstacionamientos({api_key:store.get('user').token})
          .then(function(result) {
           for (var i = 0; i < result.obj.length; i++) {
             result.obj[i].pos=[result.obj[i].geo.lat,result.obj[i].geo.lon];
           };
           
           vm.data.estacionamientos=result.obj;
           console.log(  vm.data.estacionamientos);
           UiUtils.showToast("Estacionamientos encontrados")
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
          .finally(function() {
	       $scope.$broadcast('scroll.refreshComplete');
	     });
      });

    }

        function eliminar(id,indice) {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(client);
        client.Estacionamiento.deleteEstacionamiento({api_key:store.get('user').token,id:id})
          .then(function(result) {
            vm.data.estacionamientos.splice(indice,1);
            UiUtils.showError(result.obj.message)
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
      });
    };

    function update(estacionamiento) {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        if(estacionamiento.estado == 0){
           client.Estacionamiento.enabled({api_key:store.get('user').token,id:estacionamiento.id})
          .then(function(result) {
            estacionamiento.estado=1;
            UiUtils.showError(result.obj.message)
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
        }else{
           client.Estacionamiento.disabled({api_key:store.get('user').token,id:estacionamiento.id})
          .then(function(result) {
             estacionamiento.estado=0;
            UiUtils.showError(result.obj.message)
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          })
        }
     
      });
    };

    function addHorarios(estacionamiento) {
        $state.go("app.horarios",{estacionamiento:estacionamiento});

    };



    function create() {
      $state.go('app.newEstacionamiento')
    };
  }
})();
