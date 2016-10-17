(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('Services', Services);

  function Services($http, Storage){

    return {
      login: login
    };

    function login(){
      
        
    }
  }
})();