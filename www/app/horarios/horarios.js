(function(){
  'use strict';
  angular
    .module('app.horarios')
    .controller('Horarios', Horarios);

  function Horarios($scope, $state, store,UiUtils,$stateParams,$ionicModal,moment,HOST){
    var vm = this;
    vm.getHorarios= getHorarios;
    vm.formHorario={};
    vm.formReserva={};
    vm.create=create;
    vm.createReserva=createReserva;
    vm.eliminarReserva=eliminarReserva;
    vm.recalcular=recalcular;
    vm.hoy= new Date();
    vm.data = {};
    vm.data.horario={};
    vm.data.reserva={};
    vm.data.estacionamiento={};
    vm.data.estacionamiento=$stateParams.estacionamiento;
    vm.data.isArriendo=$stateParams.isArriendo;
    vm.calendar = {};
    vm.calendar.eventSource = [];
    vm.calendar.mode="week";
    vm.calendar.week ="/app/horarios/week.html";
    vm.calendar.event="/app/horarios/event.html";

    

    if(vm.data.estacionamiento){
       console.log(vm.data.estacionamiento);
       getHorarios(vm.data.estacionamiento.id);
    }
 	 
    function getHorarios(id) {
      console.log("Cargando horarios");
      new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        client.Estacionamiento.findHorarios({api_key:store.get('user').token,id:id})
          .then(function(result) {
          console.log(result);
          var events = [];
          for (var i = 0; i < result.obj.length; i++) {
            events.push({title:result.obj[i].type=='Ocupado'?'Ocupado':'Libre',
                                           allDay:false,
                                           idReserva: result.obj[i].idReserva,
                                           id:result.obj[i].idHorario,
                                           type:result.obj[i].type,
                                           startTime:  new Date(result.obj[i].horaInicio),
                                           endTime:  new Date(result.obj[i].horaTermino)});
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



    function create() {
      var newHorario= angular.copy(vm.data.horario);
      console.log(newHorario);
      newHorario.idEstacionamiento=vm.data.estacionamiento.id;
      newHorario.horaInicio=combineDateAndTime(newHorario.dia,newHorario.horaInicio);
      newHorario.horaTermino=combineDateAndTime(newHorario.dia,newHorario.horaTermino);
      console.log(newHorario);
       new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(client);
        client.Horario.createHorario({api_key:store.get('user').token,body:newHorario})
          .then(function(result) {
            vm.data.horario = {};
            vm.formHorario.$commitViewValue();
            vm.formHorario.$setUntouched();
            vm.formHorario.$setPristine();
            getHorarios(vm.data.estacionamiento.id);
            vm.closeModal();
           UiUtils.showError(result.obj.message);
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          });
      });
    };

    function createReserva() {
      var newReserva= angular.copy(vm.data.reserva);
      newReserva.idHorario=newReserva.idHorario;
      newReserva.horaEntrada=combineDateAndTime(newReserva.dia,newReserva.horaEntrada);
      newReserva.horaSalida=combineDateAndTime(newReserva.dia,newReserva.horaSalida);
      delete newReserva.horaInicio;
      delete newReserva.horaTermino;
      delete newReserva.costo;
      console.log(newReserva);
       new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
      
        client.Reserva.createReserva({api_key:store.get('user').token,body:newReserva})
          .then(function(result) {
            vm.data.reserva = {};
            vm.formReserva.$commitViewValue();
            vm.formReserva.$setUntouched();
            vm.formReserva.$setPristine();
            getHorarios(vm.data.estacionamiento.id);
            vm.closeModal3();
           UiUtils.showError(result.obj.message);
          })
          .catch(function(error) {
            console.dir(error);
            UiUtils.showError(error.obj.message)
          });
      });
    }

     function getAutos() {
      if(!vm.data.autos){
         new SwaggerClient({
          url: HOST,
          usePromise: true
          }).then(function(client) {
            client.User.findAutos({api_key:store.get('user').token})
              .then(function(result) {
               vm.data.autos=result.obj;
               if(!vm.data.autos.length){
                  UiUtils.showError("DEBE CREAR UN AUTO PARA REALIZAR UNA RESERVA")
               }
              })
              .catch(function(error) {
                console.dir(error);
                UiUtils.showError(error.obj.message)
              });
          });
      }
    }

    function eliminarReserva(id) {
       new SwaggerClient({
      url: HOST,
      usePromise: true
      }).then(function(client) {
        console.log(client);
        client.Reserva.deleteReserva({api_key:store.get('user').token,id:id})
          .then(function(result) {
            getHorarios(vm.data.estacionamiento.id);
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
        var timeString=moment(time).format("HH:mm:ss");
        var year = date.getFullYear();
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        var dateString = '' + year + '-' + month + '-' + day;
        var combined = new Date((dateString + ' ' + timeString).replace(/-/g, "/"));
        return combined;
  };



     $ionicModal.fromTemplateUrl('app/horarios/newHorario.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });
    vm.openModal = function() {
      vm.data.horario.dia=new Date(vm.calendar.currentDate);
      console.log(vm.data.horario.dia);
      vm.modal.show();
    };
    vm.closeModal = function() {
       vm.modal.hide();
    };
    $scope.$on('$destroy', function() {
       vm.modal.remove();
    });


     $ionicModal.fromTemplateUrl('app/horarios/reserva.html', {
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


     $ionicModal.fromTemplateUrl('app/horarios/newReserva.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal3 = modal;
    });
    vm.openModal3 = function(bloque) {
      console.log(bloque);
      vm.data.reserva.horaInicio=new Date(bloque.startTime);
      vm.data.reserva.horaTermino=new Date(bloque.endTime);
      vm.data.reserva.dia=new Date(bloque.startTime);
      vm.data.reserva.horaEntrada=new Date(1970, 0, 1, new Date(bloque.startTime).getHours(), new Date(bloque.startTime).getMinutes(), 0);
      vm.data.reserva.horaSalida=new Date(1970, 0, 1, new Date(bloque.endTime).getHours(), new Date(bloque.endTime).getMinutes(), 0);
      vm.data.reserva.idHorario=bloque.id;
      vm.data.reserva.costo=calcularCosto(vm.data.estacionamiento.costo,subDate(vm.data.reserva.horaEntrada,  vm.data.reserva.horaSalida));
      vm.modal3.show();
      getAutos();
    };
    vm.closeModal3 = function() {
       vm.modal3.hide();
    };
    $scope.$on('$destroy', function() {
       vm.modal3.remove();
    });


      vm.changeMode = function (mode) {
        console.log(mode);
          vm.calendar.mode = mode;
      };


      vm.onEventSelected = function (event) {
          console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
          if(!vm.data.isArriendo && event.type=="Ocupado"){
            dellateReserva(event.idReserva);
           
          }
          if(vm.data.isArriendo && event.type=="Libre"){
            vm.openModal3(event);
           
          }
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

      function recalcular() {
        console.log('entre');
        if(vm.formReserva.$invalid){
          vm.data.reserva.costo=0;
        }else{
          vm.data.reserva.costo=calcularCosto(vm.data.estacionamiento.costo,subDate(vm.data.reserva.horaEntrada,  vm.data.reserva.horaSalida));

        }
      }


      function dellateReserva(id) {
        new SwaggerClient({
        url: HOST,
        usePromise: true
        }).then(function(client) {
          console.log(client);
          client.Reserva.detalleReserva({api_key:store.get('user').token,id:id})
            .then(function(result) {
              vm.openModal2(result.obj);
            })
            .catch(function(error) {
              console.dir(error);
              UiUtils.showError(error.obj.message)
            });
        });
      }

    function subDate(horaInicio,horaTermino) {
      var start = moment(horaInicio);
      var end = moment(horaTermino);
      var duration = moment.duration(end.diff(start));
      var minutos = duration.asMinutes();


      return minutos;
    };

    function calcularCosto(valor, minutos) {
      return (minutos/60)*valor;
    }
   
  }
})();
