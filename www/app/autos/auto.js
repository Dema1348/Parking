(function(){
  'use strict';
  angular
    .module('app.autos')
    .controller('Auto', Auto);

  function Auto($scope, $state, $timeout,store,UiUtils,HOST){
    var vm = this;
    vm.data = {};
    vm.formAuto={};
    vm.data.auto={};
    vm.send=send;
 


    function send(auto) {
    	new SwaggerClient({
        url: HOST,
        usePromise: true
        }).then(function(client) {
          client.Auto.createAuto({api_key:store.get('user').token, body: auto})
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
