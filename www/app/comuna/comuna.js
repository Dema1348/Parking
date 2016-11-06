(function(){
  'use strict';
  angular
    .module('app.comuna')
    .controller('Comuna', Comuna);

  function Comuna($scope,store, $state,utilApi,UiUtils,$ionicModal,HOST){
    var vm = this;
    var geocoder;
    geocoder = new google.maps.Geocoder;
    vm.data = {};
    vm.getProvicias=getProvicias;
    vm.getComunas=getComunas;
    vm.getEstacionamientos=getEstacionamientos;
    vm.data.regiones=utilApi.getRegiones();
    vm.showParking=showParking;
    vm.verHorarios=verHorarios;




    function getProvicias(id) {
      vm.data.provincias= utilApi.getProvincias(id);
    };

    function getComunas(id) {
      vm.data.comunas= utilApi.getComunas(id);
    };

    function getEstacionamientos(idComuna) {
      if(idComuna){
        new SwaggerClient({
        url: HOST,
        usePromise: true
        }).then(function(client) {
          console.log(client);
          console.log('ok');
          console.log(idComuna);
          client.Estacionamiento.findByComuna({api_key:store.get('user').token,comuna:idComuna})
            .then(function(result) {
             setMarkers(result.obj);
             console.dir(vm.data.estacionamientos);
             UiUtils.showToast("Estacionamientos encontrados: "+result.obj.length)
            })
            .catch(function(error) {
              console.dir(error);
              UiUtils.showError(error.obj.message)
            });
        });
      }
    
    }


     function setMarkers(array) {
      vm.data.parkings=[];
      for (var i = 0; i < array.length; i++) {
        array[i].geo=[array[i].geo.lat,array[i].geo.lon];
      };
      vm.data.estacionamientos=array;
    };


   $ionicModal.fromTemplateUrl('parking-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });
    vm.openModal = function() {
      vm.modal.show();
    };
    vm.closeModal = function() {
       vm.modal.hide();
    };
    $scope.$on('$destroy', function() {
       vm.modal.remove();
    });


   

    function showParking(estacionamiento) {
      console.log(estacionamiento);
        vm.data.selectParking=angular.copy(estacionamiento);
        geocodeLatLng( vm.data.selectParking.geo);
        vm.modal.show();

    }


    function geocodeLatLng(geo) {

    var latlng={lat:geo[0],lng:geo[1]};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          vm.data.selectParking.direccion=results[1].formatted_address;
        } else {
          vm.data.selectParking.direccion='Dirección no encontrada';
        }
       
      } else {
        vm.data.selectParking.direccion='Dirección no encontrada';
      }
       console.log(vm.data.selectParking.direccion);
    });
  }


   function verHorarios(estacionamiento) {
        vm.modal.hide();
        $state.go("app.horarios",{estacionamiento:estacionamiento,isArriendo:true});
    }

  }
})();
