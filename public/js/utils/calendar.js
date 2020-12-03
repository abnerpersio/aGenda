/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

function editEvent(event){
    console.log(event);	
}    

function passarInfosEvento(evento) { 

    var displays = {
        title: document.querySelector("#display-title"),
        desc: document.querySelector("#display-desc"),
        start: document.querySelector("#display-inicio"),
        end: document.querySelector("#display-fim"),
        paciente: document.querySelector("#display-paciente"),
        prof: document.querySelector("#display-profissional"),
        sala: document.querySelector("#display-sala"),
        espaco: document.querySelector("#display-espaco"),
        id: document.querySelector("#display-id"),
    }

    var confirmado = document.querySelector("#display-confirmado");
    if(evento.color == '#5cb85c'){
        confirmado.innerText = 'Sim'
    } else if(evento.color == '#00B1E7'){
        confirmado.innerText = 'Não'
    }

    for(var prop in displays) {
        displays[prop].innerText = evento[prop]
    }
}

function openConfig(evento) {
    passarInfosEvento(evento);
    $("#modal_evento").modal();
}  

function confirmarEvento(idEvento) {
    crud.update(idEvento, {'color': '#5cb85c'});
    notificar('evento confirmado :)', 'bg-success');
}

function renderCalendario(eventos) {
    var calendarioEl = $("#calendario"); 

    calendarioEl.fullCalendar({
        eventColor: '#00B1E7',
        lang: 'pt-br',
        defaultView: 'agendaWeek',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },	
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [ 0, 1, 2, 3, 4, 5, 6 ], // Monday - Thursday
          
            start: '06:00', // a start time (10am in this example)
            end: '23:00', // an end time (6pm in this example)
        },
        events: eventos,
        eventRender: function eventRender( event, element, view ) {
            var filtrar_espaco, filtrar_profissional = true, filtrar_sala = true;

            // espaco filtros
            var espaco = $('.filter').val();
            filtrar_espaco = ['all', event.espaco].indexOf(espaco) >= 0;

            // profissional filtros
            var profissional = $('.profissionais-filtro').val();
            if(profissional !== 'all'){
                filtrar_profissional = ['all', event.prof].indexOf(profissional) >= 0;
            }

            // salas filtros
            var salas = $('.salas-filtro').val();
            if(salas !== 'all'){
                filtrar_sala = ['all', event.sala].indexOf(salas) >= 0;
            }

            // return filtro desejado
            return filtrar_espaco && filtrar_profissional && filtrar_sala;

        },

        eventClick: function(event, jsEvent, view) {
            openConfig(event);
        }   
    });

}
 
function rebootCalendario(){
    $('.fullcalendar').fullCalendar('destroy');
    renderCalendario(crud.agenda);
}

