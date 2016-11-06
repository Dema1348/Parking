(function(){
  'use strict';
  angular.module('app', ['ionic',

                          //Modulos externos
                          'ngMap',
                          'ngLocale',
                          'ui.gravatar',
                          'angular-storage',
                          'angularMoment',
                          'ui.rCalendar',
                          'ionic.rating',

                          //Modulos de la aplicación  
                          'app.core',
                          'app.api',
                          'app.pagos',
                          'app.login',
                          'app.common',
                          'app.menu',
                          'app.estacionamientos',
                          'app.arriendos',
                          'app.horarios',
                          'app.autos',
                          'app.comuna',
                          'app.perfil',
                          'app.tarjeta',
                          'app.registro',
                          'platanus.rut',
                          'app.home',
                          'app.settings'])
})();
