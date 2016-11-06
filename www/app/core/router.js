(function(){
  'use strict';
  angular
  	.module('app.core')
    .config(router);

  function router($stateProvider, $urlRouterProvider, $provide){
      $stateProvider
      
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'Login',
        controllerAs: 'vm'
      })     


       .state('registro', {
        url: '/registro',
        templateUrl: 'app/registro/registro.html',
        controller: 'Registro',
        controllerAs: 'vm'
      })
      
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/menu/menu.html',
        controller: 'Menu',
        controllerAs: 'vm',




      })

        .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'app/home/home.html',
            controller: 'Home',
             controllerAs: 'vm'
          }
        },
        cache:false,
         authenticate: true
      })
      
      .state('app.estacionamientos', {
        url: '/estacionamientos',
        views: {
          'menuContent': {
            templateUrl: 'app/estacionamientos/estacionamientos.html',
            controller: 'Estacionamientos',
             controllerAs: 'vm'
          }
        },
        cache:false,
         authenticate: true,
         dueno:true
      })

      .state('app.newEstacionamiento', {
        url: '/estacionamientos/nuevo',
        views: {
          'menuContent': {
            templateUrl: 'app/estacionamientos/estacionamiento.html',
            controller: 'Estacionamiento',
             controllerAs: 'vm'
          }
        },
         authenticate: true,
        dueno:true

      })

        .state('app.estacionamientosDenegado', {
        url: '/estacionamientosDenegado',
        views: {
          'menuContent': {
            templateUrl: 'app/estacionamientos/estacionamientosDenegado.html',
            controller: 'EstacionamientosDenegado',
             controllerAs: 'vm'
          }
        },
         authenticate: true,
      })


     .state('app.autos', {
        url: '/autos',
        views: {
          'menuContent': {
            templateUrl: 'app/autos/autos.html',
            controller: 'Autos',
             controllerAs: 'vm'
          }
        },
        cache:false,
         authenticate: true
      })

     .state('app.newAuto', {
        url: '/autos/nuevo',
        views: {
          'menuContent': {
            templateUrl: 'app/autos/auto.html',
            controller: 'Auto',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })


          .state('app.editAuto', {
        url: '/autos/edit',
        params: {
          auto: null
        },
        views: {
          'menuContent': {
            templateUrl: 'app/autos/autoEdit.html',
            controller: 'AutoEdit',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })

        
      .state('app.comuna', {
        url: '/comuna',
        views: {
          'menuContent': {
            templateUrl: 'app/comuna/comuna.html',
            controller: 'Comuna',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })  

    .state('app.horarios', {
        url: '/horarios',
        params: {
          estacionamiento: null,
          isArriendo:null
        },
        views: {
          'menuContent': {
            templateUrl: 'app/horarios/horarios.html',
            controller: 'Horarios',
             controllerAs: 'vm'
          }
        },
        cache:false,
         authenticate: true
      })  


        
      .state('app.perfil', {
        url: '/perfil',
        views: {
          'menuContent': {
            templateUrl: 'app/perfil/perfil.html',
            controller: 'Perfil',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })  


     .state('app.pagos', {
        url: '/pagos',
        views: {
          'menuContent': {
            templateUrl: 'app/pagos/pagos.html',
            controller: 'Pagos',
             controllerAs: 'vm'
          }
        },
          cache:false,
         authenticate: true
      })  


    .state('app.arriendos', {
        url: '/arriendos',
        views: {
          'menuContent': {
            templateUrl: 'app/arriendos/arriendos.html',
            controller: 'Arriendos',
             controllerAs: 'vm'
          }
        },
        cache:false,
         authenticate: true
      })  



      .state('app.tarjeta', {
        url: '/tarjeta',
        views: {
          'menuContent': {
            templateUrl: 'app/tarjeta/tarjeta.html',
            controller: 'Tarjeta',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })  


      .state('app.sensor', {
        url: '/sensors/sensor',
        params:{param:null},
        views: {
          'menuContent': {
            templateUrl: 'app/sensor/sensor.html',
            controller: 'Sensor',
             controllerAs: 'vm'
          }
        },
         authenticate: true
      })
      
   

      $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("login");
      });

    

    // catch Angular errors
    $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
      return function(exception, cause){
        $delegate(exception, cause);
        var data = {};
        if(cause)               { data.cause    = cause;              }
        if(exception){
          if(exception.message) { data.message  = exception.message;  }
          if(exception.name)    { data.name     = exception.name;     }
          if(exception.stack)   { data.stack    = exception.stack;    }
        }
        console.error('Angular error: '+data.message, {cause: data.cause, stack: data.stack});
      };
    }]);
  }

  // catch JavaScript errors
  window.onerror = function(message, url, line, col, error){
    var stopPropagation = false;
    var data = {};
    if(message)       { data.message      = message;      }
    if(url)           { data.fileName     = url;          }
    if(line)          { data.lineNumber   = line;         }
    if(col)           { data.columnNumber = col;          }
    if(error){
      if(error.name)  { data.name         = error.name;   }
      if(error.stack) { data.stack        = error.stack;  }
    }
    if(navigator){
      if(navigator.userAgent)   { data['navigator.userAgent']     = navigator.userAgent;    }
      if(navigator.platform)    { data['navigator.platform']      = navigator.platform;     }
      if(navigator.vendor)      { data['navigator.vendor']        = navigator.vendor;       }
      if(navigator.appCodeName) { data['navigator.appCodeName']   = navigator.appCodeName;  }
      if(navigator.appName)     { data['navigator.appName']       = navigator.appName;      }
      if(navigator.appVersion)  { data['navigator.appVersion']    = navigator.appVersion;   }
      if(navigator.product)     { data['navigator.product']       = navigator.product;      }
    }
    console.error('JavaScript error: '+data.message, {cause: data.cause, stack: data.stack});
    return stopPropagation;
  };

})();
