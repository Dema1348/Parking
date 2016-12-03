(function() {
    'use strict';

    angular
        .module('app.common')
        .factory('Message', Message);


    function Message() {

        var msg = {
            error: "Error al conectarse. Revisa la conexión de red de tu dispositivo",
            done: "Mensaje enviado con éxito",
            loading: "Cargando...",
            timeout: "Ha ocurrido un error al enviar la solicitud",
            block: "Vuelva a intentarlo en 30 segundos"
        };

        return msg;



    }
}());