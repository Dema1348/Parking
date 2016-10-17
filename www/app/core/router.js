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
      
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/menu/menu.html',
        controller: 'Menu',
        controllerAs: 'vm'

      })

        .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'app/home/home.html',
            controller: 'Home',
             controllerAs: 'vm'
          }
        }
      })
      
      .state('app.sensors', {
        url: '/sensors',
        views: {
          'menuContent': {
            templateUrl: 'app/sensors/sensors.html',
            controller: 'Sensors',
             controllerAs: 'vm'
          }
        }
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
        }
      })
      
   
      
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'app/settings/settings.html',
            controller: 'Settings',
            controllerAs: 'vm',
            resolve: {
              resolvedSettings: function(Storage){
                return Storage.getUserSettings();
              }
            }
          }
        }
      });

      $urlRouterProvider.otherwise('/login');

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
