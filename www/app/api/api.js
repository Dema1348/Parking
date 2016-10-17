(function() {
	'use strict';

	angular
    .module('app.api')
	 .factory('Api', Api);


	function Api() {
     var client= new SwaggerClient({
	  url: 'http://localhost:10010/api-docs',
	   success: function() {},
	  usePromise: true
	});

	 return client
	}

})();