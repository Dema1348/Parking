(function(){
  'use strict';
  angular.module('app', ['ionic',

                          //Modulos externos
                          'ngMap',
                          'ngLocale',
                          'ui.gravatar',
                          'angular-storage',
                          //Modulos de la aplicación  
                          'app.core',
                          'app.api',
                          'app.login',
                          'app.common',
                          'app.menu',
                          'app.sensors',
                          'app.home',
                          'app.sensor',
                          'app.settings'])
})();
