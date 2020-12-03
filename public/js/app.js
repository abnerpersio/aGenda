/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

var crud;
notificar('OLÁ, SEJA MUITO BEM VINDO!', 'bg-info');
 
$('.selecionador').pickadate({
    selectMonths: true, 
    selectYears: 15,
    labelMonthNext: 'Proximo Mês',
    labelMonthPrev: 'Mês Anterior',
    // Selecionador de mês
    labelMonthSelect: 'Selecionar Mês',
    labelYearSelect: 'Selecionar Ano',
    // Meses e escritas em português
    monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ],
    //
    weekdaysLetter: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
    // Botões hoje, limpar e fechar
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar',
    // o formato do input
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/mm/yyyy',
});

$('#data_evento').on('change',function(){

    valor = document.querySelector('#data_evento').value
    var diaPedido = valor.replaceAll('/', '-'); // formating to DD-MM-YYYY
    var salaPedida = document.querySelector('.input-salas').value;

    crud.checkers.primeiroChecarDisponibilidade(salaPedida, diaPedido);

});

function criarSelect(){

    $('.select-dois').select2({
        formatNoMatches: function () {
            return "Nenhum dado encontrado!";
        }
    });

}

function criarCampoDePesquisa() {
    $('.select-pesquisa').select2({
        formatNoMatches: function () {
            return "Nenhum dado encontrado!";
        }
    });
}

function criarBotaoSwitch(){
    var elems = document.querySelector('.js-switch');
    var switchery = new Switchery(elems);
}

criarBotaoSwitch();

var defaultName = { 
    nome: 'Agendeiro'
}

function novoDisplayVue(nome, dataSource){
    displayElements = document.querySelectorAll('.vue-display-' + nome);
    var nome = nome;

    displayElements.forEach(function(el){
        nome = new Vue({
            el: el,
            data: {
                items: dataSource 
            }
        })
    });    
}

function atualizarListagens(){ 

    $('.filter').on('change',function(){
        $('.fullcalendar').fullCalendar('rerenderEvents');
    });

    $('.profissionais-filtro').on('change',function(){
        console.log('mudado profissa')
        var salvarLocal = $('.profissionais-filtro').val();
        localStorage.setItem("ultimo_selecionado", salvarLocal);
    
        document.querySelector(".salas-filtro").value = 'all';			
        $('.fullcalendar').fullCalendar('rerenderEvents');
    });
     
    $('.salas-filtro').on('change',function(){
        console.log('mudado sala')
        var salvarLocal = $('.salas-filtro').val();
        localStorage.setItem("ultimo_selecionado", salvarLocal);
    
        document.querySelector(".profissionais-filtro").value = 'all';
        $('.fullcalendar').fullCalendar('rerenderEvents');
    });

}

function novoCliente(nome, telefone, cpf, email ) {
    var dadosDoClienteNovo = {
        nome,
        telefone,
        cpf,
        email
    } 

    crud.createDado('pacientes', dadosDoClienteNovo).then(function(response){
        if(response == 'success'){
            notificar('Novo paciente enviado com sucesso! :)', 'bg-success');
            
            setTimeout(() => {
                document.location.reload();
            }, 200);
        }else{
            notificar('Algo deu errado com sua requisição :(', 'bg-danger');
        }
    });

    // atualizar pagina
    
}

function pegarValor(el){
    return $(el).select2("val");
}

function adicionarEvento(tipoInput, pacienteInput, tratamentoInput, tipoTratamentoInput, especialidadeInput, procedimentosInput, profissionalInput, salaInput, dataInput, inicioInput, fimInput, obsInput ){

    var espaco = document.querySelector("#espacoEvento").value
    var tipoAgendamento = tipoInput.value;
    var pacienteValue = pegarValor(pacienteInput);
    var tratamento = tratamentoInput.value;
    var tipoTratamento = tipoTratamentoInput.value;
    var especialidade = especialidadeInput.value;
    var procedimentosValue = pegarValor(procedimentosInput);
    var profissional = profissionalInput.value;
    var sala = salaInput.value; 
    var dataDeInicio = moment(Date(dataInput.value)).format('YYYY-MM-DD') + 'T' + inicioInput.value + ':00';
    var dataDeFinal = moment(Date(dataInput.value)).format('YYYY-MM-DD') + 'T' + fimInput.value + ':00';
    var tempoValido = fimInput.value > inicioInput.value;
    var campoObservacoes = obsInput.value;

    var eventoAEnviar = {
        title: profissional + ' (' + pacienteValue + ')',
        start: dataDeInicio,
        end: dataDeFinal,
        desc: campoObservacoes, 
        color: '#00B1E7',
        espaco: espaco,
        agendamento: tipoAgendamento,
        tratamento: tratamento,
        tipo: tipoTratamento,
        procedimentos: procedimentosValue,
        prof: profissional,
        sala: sala,     
    }

    if(!tempoValido) {
        notificar('oops. horário inválido!' + ' de '+ inicioInput.value +' até ' + fimInput.value, 'bg-danger')
    } else if( dataInput.value == ""){ 
        notificar('oops. data inválida!', 'bg-danger')
    } else if( pacienteValue == null ){ 
        notificar('oops. escolha um paciente!', 'bg-danger')
    } else { 
        crud.checarECriar(eventoAEnviar);
    }

    console.log(eventoAEnviar); 

    // var eventoGooglePadrao = {
    //     "kind": "calendar#a-genda",
    //     "etag": etag,
    //     "id": string,
    //     "status": string,
    //     "created": datetime,
    //     "updated": datetime,
    //     "summary": string,
    //     "description": string,
    //     "colorId": string,
    //     "start": {
    //       "date": date,
    //       "dateTime": datetime,
    //       "timeZone": string
    //     },
    //     "end": {
    //       "date": date,
    //       "dateTime": datetime,
    //       "timeZone": string
    //     },
    //     "recurrence": [
    //       string
    //     ],
    //     "recurringEventId": string,
    //       "conferenceSolution": {
    //         "key": {
    //           "type": string
    //         },
    //         "name": string,
    //         "iconUri": string
    //       },
    //       "conferenceId": string,
    //       "signature": string,
    //       "notes": string,
    //     "reminders": {
    //       "useDefault": boolean,
    //       "overrides": [
    //         {
    //           "method": string,
    //           "minutes": integer
    //         }
    //       ]
    //     }
    // }

}

setTimeout(() => {
    crud = new Actions;
    crud.read();
    return crud;
}, 1500);

setTimeout(() => {

    novoDisplayVue('profissionais', crud.getDados('profissionais'));
    novoDisplayVue('salas', crud.getDados('salas'));
    novoDisplayVue('pacientes', crud.getDados('pacientes'));
    novoDisplayVue('especialidades', crud.getDados('especialidades'));
    novoDisplayVue('procedimentos', crud.getDados('procedimentos'));
    novoDisplayVue('username', crud.nomeUsuario || defaultName.nome);
    atualizarListagens();
    criarCampoDePesquisa();
    criarSelect();

}, 2000);

setTimeout(() => {
    rebootCalendario(crud.agenda);
}, 3000); 