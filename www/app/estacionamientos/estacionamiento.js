(function(){
  'use strict';
  angular
    .module('app.estacionamientos')
    .controller('Estacionamiento', Estacionamiento);

  function Estacionamiento($scope, $state, $timeout,store,UiUtils,utilApi,NgMap,HOST){
    var vm = this;
    var map;
    var marker;
    vm.data = {};
    vm.data.pos={};
    vm.send=send;
    vm.formEstacionamiento={};
    vm.data.estacionamiento={};
    vm.getProvicias=getProvicias;
    vm.getComunas=getComunas;
    vm.data.regiones=utilApi.getRegiones();

    vm.customIcon = {
        "url": "/img/mapa2.png"
    };

    $timeout(initMap, 1000);

    function initMap() {

    	NgMap.getMap('map-estacionamiento').then(function(evtMap) {
			 map = evtMap;  
		 	 marker = map.markers[0];
	   	  	 marker.setPosition(map.getCenter());
			 google.maps.event.addListener(map, 'center_changed', function() {
		       	marker.setPosition(map.getCenter());			 	
	        });
	      
	  });

    };


    function send(estacionamiento) {
    	estacionamiento.geo={
    		lat:marker.getPosition().lat(),
    		lon:marker.getPosition().lng()
    	}
    	estacionamiento.estado=1*estacionamiento.estado;
    	 new SwaggerClient({
	      url: HOST,
	      usePromise: true
	      }).then(function(client) {
	      	console.log(estacionamiento);
	        client.Estacionamiento.createEstacionamiento({api_key:store.get('user').token, body: estacionamiento})
	          .then(function(result) {
	           	 UiUtils.showError(result.obj.message).then(function() {
                vm.data.estacionamiento = {};
                vm.formEstacionamiento.$commitViewValue();
                vm.formEstacionamiento.$setUntouched();
                vm.formEstacionamiento.$setPristine();
	           	 	$state.go("app.estacionamientos");
	           	 });
	          })
	          .catch(function(error) {
	            console.dir(error);
	            UiUtils.showError(error.obj.message)
	            

	          
	          });
	      });

    };
  	
  	function getProvicias(id) {
  		vm.data.provincias= utilApi.getProvincias(id);
  	};

  	function getComunas(id) {
  		vm.data.comunas= utilApi.getComunas(id);
  	};
 
  }
})();
