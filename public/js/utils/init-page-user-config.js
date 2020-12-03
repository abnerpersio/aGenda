/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

var defaultName = { 
    nomeUsuario: 'Agendeiro'
}

function novoDisplayVue(nome, dataSource){
    displayElements = document.querySelectorAll('.vue-display-' + nome);

    displayElements.forEach(function(el){
        nome = new Vue({
            el: el,
            data: {
                items: dataSource, 
            }
        })
    });    
}

function criarCampoDePesquisa() {
    $('.select-pesquisa').select2({
        formatNoMatches: function () {
              return "Nenhum dado encontrado!";
          }
    });
}

function reloadCampoDePesquisa(){

    $(".select-pesquisa").select2('destroy');

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
    novoDisplayVue('username', crud.nomeUsuario || defaultName.nomeUsuario);
    criarCampoDePesquisa();

}, 2000);