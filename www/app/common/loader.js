(function() {
    'use strict';
    angular
        .module('app.common')
        .factory('Loader', Loader);

    function Loader($ionicLoading) {

        var loading = {
            show: show,
            showSpinner: showSpinner,
            hide: hide,
            showTime: showTime,
            showTimeSpinner: showTimeSpinner
        };

        return loading;

        function show(msg) {
            $ionicLoading.show({
                template: msg || "Cargando..."
            });
        }

        function showSpinner(msg) {
            $ionicLoading.show({
                template: "<ion-spinner icon='bubbles'></ion-spinner><p>" + msg + "</p>" || "<ion-spinner icon='bubbles'></ion-spinner><p>Cargando...</p>"
            });
        }


        function hide() {
            $ionicLoading.hide();
        }


        function showTime(msg, time) {
            $ionicLoading.show({
                template: msg || "Cargando...",
                duration: time || 3000
            });
        }

        function showTimeSpinner(msg, time) {
            $ionicLoading.show({
                template: "<ion-spinner icon='bubbles'></ion-spinner><p>" + msg + "</p>" || "<ion-spinner icon='bubbles'></ion-spinner><p>Cargando...</p>",
                duration: time || 3000
            });
        }
    }
})();