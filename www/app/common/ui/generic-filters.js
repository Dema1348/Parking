(function(){
  'use strict';
  angular.module('app.common')
    .filter('reverse', reverseArray)
    .filter('with', withArray)
    .filter('inSlicesOf', filterInSlicesOf);



  function reverseArray(){
    return function(items){
      return items.slice().reverse();
    };
  }

  function withArray(){
    return function(items, items2){
      return items.concat(items2);
    };
  }

  function filterInSlicesOf($rootScope){
    return function(items, count){
      if(!angular.isArray(items) && !angular.isString(items)) return items;
      if(!count){ count = 3; }
      var array = [];
      for(var i = 0; i < items.length; i++){
        var chunkIndex = parseInt(i / count, 10);
        var isFirst = (i % count === 0);
        if(isFirst){ array[chunkIndex] = []; }
        array[chunkIndex].push(items[i]);
      }

      if(angular.equals($rootScope.arrayinSliceOf, array)){
        return $rootScope.arrayinSliceOf;
      } else {
        $rootScope.arrayinSliceOf = array;
      }

      return array;
    };
  }
})();
