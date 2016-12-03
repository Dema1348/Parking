
(function(){
  'use strict';
  angular
    .module('app.login')
    .controller('Login', Login);

  function Login($scope, $state, store,UiUtils,HOST,Loader,Message){
    var vm = this;
    vm.doLogin= doLogin;
    vm.formLogin={};
    vm.data = {};
  
 
    function doLogin() {
      Loader.show(Message.loader);
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.Auth.login({credenciales: vm.data.credenciales})
          .then(function(result) {
            store.set('user', result.obj)
            $state.go('app.home');
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)            
          }).finally(function() {
            Loader.hide();
          });
      });

    };

  }
})();
