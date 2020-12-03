/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

function renderActions(){
    a = '<ul class="text-center icons-list"><li class="dropdown">';
    b =	'<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>';
    c = '<ul class="dropdown-menu dropdown-menu-right"><li><a href="#"><i class="icon-pencil7"></i> Editar Paciente </a></li><li class="divider"></li><li><a href="#"><i class="icon-bin"></i> Excluir registro </a></li></ul>';
    d = '</li></ul>';
    return a + b + c + d;
}

function renderCheck(){
    return '<input type="checkbox" class="styled">';
}

// pattern for datatable
$.extend( $.fn.dataTable.defaults, {
    responsive: true,
    autoWidth: false,
    order: [[ 1, "asc" ]],
    lengthMenu: [ 25, 50, 75, 100 ],
    displayLength: 25,
    dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',	
    language: {
        sEmptyTable: "Nenhum registro encontrado",
        sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
        sInfoFiltered: "(Filtrados de _MAX_ registros)",
        sInfoPostFix: "",
        sInfoThousands: ".",
        sLengthMenu: "_MENU_ resultados por página",
        sLoadingRecords: "Carregando...",
        sProcessing: "Processando...",
        sZeroRecords: "Nenhum registro encontrado",
        sSearch: "<span>Pesquisar:</span> _INPUT_",
        oPaginate: {
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        oAria: {
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        },
        select: {
            "rows": {
                "_": "Selecionado %d linhas",
                "0": "Nenhuma linha selecionada",
                "1": "Selecionado 1 linha"
            }
        },
        buttons: {
            "copy": "Copiar para a área de transferência",
            "copyTitle": "Cópia bem sucedida",
            "copySuccess": {
                "1": "Uma linha copiada com sucesso",
                "_": "%d linhas copiadas com sucesso"
            }
        }
    }
});
// pattern for datatable

function renderTable(dataToTable) {

    $('#table').DataTable({
        data: dataToTable,
        columns: [
            {	
                orderable: false,
                width: '20px',
                render: renderCheck
            },
            {
                orderable: true,
                width: '100px',
                data: "nome"
            },
            {
                orderable: true,
                width: '100px',
                data: "cpf"
            },
            { 
                orderable: true,
                width: '100px',
                data: "telefone"
            },
            {  
                orderable: false,
                width: '20px',
                render: renderActions, 	
            }
        ],
    });
}

$('.tokenfield-1').tokenfield();
$('.tokenfield-2').tokenfield();

function pegarTokens1(){
    let items = $('.tokenfield-1').tokenfield('getTokensList');
    return items
}
function pegarTokens2(){
    let items = $('.tokenfield-2').tokenfield('getTokensList');
    return items
}

function enviarVariosDados1(tipo) {
    var listaDeDados = pegarTokens1();
    var arrayDeDados = listaDeDados.split(', ');

    arrayDeDados.forEach(function(dadoUnico){
        enviarDados(tipo, dadoUnico);
    });    
}

function enviarVariosDados2(tipo) {
    var listaDeDados = pegarTokens2();
    var arrayDeDados = listaDeDados.split(', ');

    arrayDeDados.forEach(function(dadoUnico){
        enviarDados(tipo, dadoUnico);
    });
}

function enviarDados(tipo, dado){

    var dadoGenericoComNome = {
        nome: dado
    }
    
    crud.createDado(tipo, dadoGenericoComNome).then(function(response){
        notificar('registro enviado com sucesso', 'bg-success');
    })
    .catch(function(error){
        notificar('algo deu errado :(', 'bg-danger')
    });

    // atualizar pagina
    setTimeout(() => {
        document.location.reload();
    }, 100);
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
        }else{
            notificar('Algo deu errado com sua requisição :(', 'bg-danger');
        }
    });

    // atualizar pagina
    setTimeout(() => {
        document.location.reload();
    }, 100);
}
