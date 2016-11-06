(function(){
  'use strict';
  angular
    .module('app.autos')
    .controller('AutoEdit', AutoEdit);

  function AutoEdit($scope, $state, $timeout,store,UiUtils,$stateParams,HOST){
    var vm = this;
    vm.data = {};
    vm.formAuto={};
    vm.data.auto={};
    vm.data.auto=$stateParams.auto;
    vm.send=send;
 


    function send(auto) {

    	new SwaggerClient({
        url: HOST,
        usePromise: true
        }).then(function(client) {
          console.log(client);
          client.Auto.updateAuto({api_key:store.get('user').token, body: auto})
            .then(function(result) {
               UiUtils.showError(result.obj.message).then(function() {
                vm.data.auto = {};
                vm.formAuto.$commitViewValue();
                vm.formAuto.$setUntouched();
                vm.formAuto.$setPristine();
                $state.go("app.autos");
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
