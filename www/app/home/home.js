(function(){
  'use strict';
  angular
    .module('app.home')
    .controller('Home', Home);

  function Home(NgMap,$timeout,UiUtils,store,$ionicModal,$scope){
    var vm=this;
    var map; 
    var geocoder;
    var marker;
    vm.data={};
    vm.data.range=16;
    vm.data.pos={};
    vm.data.selectParking={};
    vm.showParking=showParking;
    vm.customIcon = {
        "scaledSize": [32, 32],
        "url": "/img/marker.png"
    };

     vm.customIcon2 = {
        "scaledSize": [32, 32],
        "url": "/img/markerParking.png"
    };

    var wait=false;

    NgMap.getMap().then(function(evtMap) {
		 map = evtMap;  
		 geocoder = new google.maps.Geocoder;
	 	 marker = map.markers[0];
   	  	 marker.setPosition(map.getCenter());
		 google.maps.event.addListener(map, 'center_changed', function() {
		 	var marker = map.markers[0];
	       	marker.setPosition(map.getCenter());
		 	if(!wait){
		 		wait=true;
	       	  	doFind(marker.getPosition().lat(),marker.getPosition().lng());
		 	}else{
		 		$timeout(function() {
		 			wait=false;
		 		}, 1000);
		 	}
		 	
        });
      
  });


    function doFind(lat,lon) {
     console.log("Buscando");
      new SwaggerClient({
      url: 'http://localhost:10010/api-docs',
      usePromise: true
      }).then(function(client) {
        client.Estacionamiento.findByGeo({api_key:store.get('user').token , lat:lat, lon:lon})
          .then(function(result) {
          	setMarkers(result.obj);
          })
          .catch(function(error) {
            UiUtils.showError(error.obj.message);
          });
      });

    };


    function setMarkers(array) {
    	vm.data.parkings=[];
    	for (var i = 0; i < array.length; i++) {
    		array[i].geo=[array[i].geo.lat,array[i].geo.lon];
    	};
    	vm.data.parkings=array;
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
	     vm.modal.modal.remove();
	  });


	 

    function showParking() {
    	  vm.data.selectParking=angular.copy(this.data);
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
          


  }
})();
