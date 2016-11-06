
(function(){
  'use strict';
  angular
    .module('app.registro')
    .controller('Registro', Registro);

  function Registro($scope, $state, store,UiUtils,moment,HOST){
    var vm = this;
    vm.doRegistro= doRegistro;
    vm.formRegistro={};
    vm.data = {};
    
  
 
    function doRegistro() {
      var usuario=angular.copy(vm.data.newUser);
      usuario.div=(usuario.rut.substr(usuario.rut.length-1));
      usuario.rut=1*(usuario.rut.substr(0,usuario.rut.length-1));
      usuario.rol=1*usuario.rol;
      usuario.fechaNac=moment(usuario.fechaNac).format('YYYY-MM-DD'); 
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(usuario);
        client.User.create({body: usuario})
          .then(function(result) {
             console.log(result);
               UiUtils.showError(result.obj.message).then(function() {
                 vm.data.newUser = {};
                vm.formRegistro.$commitViewValue();
                vm.formRegistro.$setUntouched();
                vm.formRegistro.$setPristine();
                $state.go('login');
               });
               
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
            

          
          });
      });

    };

  }
})();