(function(){
  'use strict';
  angular
    .module('app.arriendos')
    .controller('Arriendos', Arriendos);

  function Arriendos($scope, $state, store,UiUtils,$stateParams,$ionicModal,moment,HOST){
    var vm = this;
    vm.getHorarios= getHorarios;
    vm.eliminarReserva=eliminarReserva;
    vm.hoy= new Date();
    vm.data = {};
    vm.data.detalleReserva={};
    vm.calendar = {};
    vm.calendar.eventSource = [];
    vm.calendar.mode="week";
    vm.calendar.week="app/horarios/week.html";
    vm.calendar.event="app/horarios/event.html" 

   
    getHorarios();

    function getHorarios() {
      console.log("Cargando horarios");
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
      	console.log(client);
        client.User.findReservas({api_key:store.get('user').token})
          .then(function(result) {
          console.log(result);
          var events = [];
          for (var i = 0; i < result.obj.length; i++) {

            events.push({title:"Reservado",
                                           allDay:false,
                                           id: result.obj[i].id,
                                           type:"Ocupado",
                                           telefono:result.obj[i].telefono,
                                           horaEntrada:result.obj[i].horaEntrada,
                                           horaSalida:result.obj[i].horaSalida,
                                           correo:result.obj[i].correo,
                                           nombre:result.obj[i].nombre,
                                           apMaterno:result.obj[i].apMaterno,
                                           apPaterno:result.obj[i].apPaterno,
                                           autoPatente:result.obj[i].autoPatente,
                                           total:result.obj[i].total,
                                           startTime:  new Date(result.obj[i].horaEntrada),
                                           endTime:  new Date(result.obj[i].horaSalida)});
          };

          vm.calendar.eventSource=events;         
           UiUtils.showToast("Horarios encontrados")
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          });
      });

    }




    function eliminarReserva(id) {
       new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(client);
        client.Reserva.deleteReserva({api_key:store.get('user').token,id:id})
          .then(function(result) {
            getHorarios();
            vm.closeModal2();
            UiUtils.showError(result.obj.message);
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          });
      });
    };


    function combineDateAndTime (date, time) {
        var timeString = time.getHours() + ':' + time.getMinutes() + ':00';

        var year = date.getFullYear();
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        var dateString = '' + year + '-' + month + '-' + day;
        var combined = new Date(dateString + ' ' + timeString);

        return combined;
  };





     $ionicModal.fromTemplateUrl('app/arriendos/reserva.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal2 = modal;
    });
    vm.openModal2 = function(detalleReserva) {
      vm.data.detalleReserva=detalleReserva;
      vm.modal2.show();
    };
    vm.closeModal2 = function() {
       vm.modal2.hide();
    };
    $scope.$on('$destroy', function() {
       vm.modal2.remove();
    });


  


      vm.changeMode = function (mode) {
        console.log(mode);
          vm.calendar.mode = mode;
      };


      vm.onEventSelected = function (event) {
          console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
         
            dellateReserva(event);
           
          

      };


      vm.today = function () {
          vm.calendar.currentDate = new Date();
      };

      vm.isToday = function () {
          var today = new Date(),
              currentCalendarDate = new Date(vm.calendar.currentDate);

          today.setHours(0, 0, 0, 0);
          currentCalendarDate.setHours(0, 0, 0, 0);
          return today.getTime() === currentCalendarDate.getTime();
      };

      vm.onTimeSelected = function (selectedTime, events) {
          console.log('Dia seleccionado : ' + selectedTime + ', Horarios: ' + (events !== undefined && events.length !== 0));
      };

   


      function dellateReserva(event) {
      	console.log(event);
       	vm.openModal2(event);  
      }

    function subDate(horaInicio,horaTermino) {
      var start = moment(horaInicio);
      var end = moment(horaTermino);
      var duration = moment.duration(end.diff(start));
      var minutos = duration.asMinutes();


      return minutos;
    };

    
   
  }
})();
