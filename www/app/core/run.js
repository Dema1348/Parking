(function(){
	'use strict';
	angular
  		.module('app.core')
    	.run(run);

    	 function run($rootScope,$ionicPlatform){

    	 	 $ionicPlatform.ready(function() {
    	 	 	console.log('READY');
    	 	 	

			    if(window.cordova && window.cordova.plugins.Keyboard) {
			      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			      // for form inputs)
			      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			      // Don't remove this line unless you know what you are doing. It stops the viewport
			      // from snapping when text inputs are focused. Ionic handles this internally for
			      // a much nicer keyboard experience.
			      cordova.plugins.Keyboard.disableScroll(true);
			    }
			    if(window.StatusBar) {
			      StatusBar.styleDefault();
			    }
			  });



	    $rootScope.safeApply = function(fn){
	      var phase = this.$root ? this.$root.$$phase : this.$$phase;
	      if(phase === '$apply' || phase === '$digest'){
	        if(fn && (typeof(fn) === 'function')){
	          fn();
	        }
	      } else {
	        this.$apply(fn);
	      }
	    };
	  }

 
})();

