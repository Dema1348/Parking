(function(){
  'use strict';
  angular
    .module('app.home')
    .controller('Home', Home);

  function Home(NgMap,$timeout,UiUtils,store,$ionicModal,$scope,$state,HOST,$ionicPopup){
    var vm=this;
    var map; 
    var geocoder;
    var marker;
    var wait=false;
    vm.data={};
    vm.data.range=16;
    vm.data.pos={};
    vm.data.selectParking={};
    vm.showParking=showParking;
    vm.verHorarios=verHorarios;
    vm.customIcon = {
        "url": "img/mapa2.png"
    };



    getPendientes();
    $timeout(initMap, 1500);

    function initMap() {

    	NgMap.getMap('map-home').then(function(evtMap) {
			 map = evtMap;  
			 geocoder = new google.maps.Geocoder;
		 	 marker = map.markers[0];
	   	 marker.setPosition(map.getCenter());
			 google.maps.event.addListener(map, 'center_changed', function() {
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

    };


    function doFind(lat,lon) {
     console.log("Buscando");
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.Estacionamiento.findByGeo({api_key:store.get('user').token , lat:lat, lon:lon})
          .then(function(result) {
            console.dir(result.obj);
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
	     vm.modal.remove();
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

    function verHorarios(estacionamiento) {
        vm.modal.hide();
        $state.go("app.horarios",{estacionamiento:estacionamiento,isArriendo:true});
    }




    function getPendientes() {
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.User.findPendientes({api_key:store.get('user').token})
          .then(function(result) {
           for (var i = 0; i < result.obj.length; i++) {
             showCalificacion(result.obj[i]);
           };
          })
          .catch(function(error) {
            console.dir(error);
           
          });
      });

    }


    function showCalificacion(calificacion) {
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;
        var califacion = $ionicPopup.show({
        template: '<rating ng-model="rating.rate" max="rating.max"></rating>',
        title: "Califica el serivicio de <span class='name'>"+calificacion.nombre+" "+calificacion.apPaterno+" "+calificacion.apMaterno+"</span>",
        subTitle: 'De 1 a 5 estrellas',
        scope: $scope,
        cssClass:'calificacion-parking',
        buttons: [
          { text: 'Cancelar' ,
            type: 'no-parking',
          },
          {
            text: '<b>Enviar</b>',
            type: 'ok-parking',
            onTap: function(e) {

              if (!$scope.rating.rate) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                calificacion.rate=$scope.rating.rate
                $scope.rating.rate = 3;
                return calificacion;
              }
            }
          }
        ]
    });

        califacion.then(function(data) {
          if(data){
            console.log(data);
            enviarCalificacion(data.id,data.rate);
          }
        })
    };

    function enviarCalificacion(id,rate) {
      
        var rate={
          id:id,
          rate:rate
        }

        new SwaggerClient({
        url: HOST,
        usePromise: true
        }).then(function(client) {
          client.User.createRate({api_key:store.get('user').token,body:rate})
            .then(function(result) {
               console.dir(result);
            })
            .catch(function(error) {
              console.dir(error);
             
            });
        });
    };

          


  }
})();
