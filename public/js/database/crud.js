/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

class CheckFuncs {
    constructor(agenda) {
        this.agenda = agenda;
    }

    // funcao do moment.js
    verificarIgual(primeiro, segundo){
        return moment(primeiro).isSame(segundo);
    }

    // funcao do moment.js
    verificarEntre(entre, inicial, final){
        return moment(entre).isBetween(inicial, final);
    }

    // checa quais horarios do dia estão ocupados
    primeiroChecarDia(evento, salaPedida, diaPedido) {
        var diaDoEvento = moment(evento.start).format("DD-MM-YYYY");
        var horaDoInicio = moment(evento.start).format("HH:mm");
        var horaDoFinal = moment(evento.end).format("HH:mm");
        var salaDoEvento = evento.sala;

        var boolSala = salaDoEvento == salaPedida;
        var boolDia = diaDoEvento == diaPedido;
        // var boolDia = this.verificarIgual(diaDoEvento, diaPedido);

        if( boolSala && boolDia ){
            notificar('evento no mesmo dia e sala:  ' + ' das ' + horaDoInicio + ' as ' + horaDoFinal, 'bg-info', true);
            return horaDoInicio + ' -> ' + horaDoFinal;
        }else{
            return false
        }
    }

    primeiroChecarDisponibilidade(sala, dia) {
        var agendaCheck = this.agenda;            

        // percorre os eventos na agenda
        for ( var indexEvento in agendaCheck ) {
            this.primeiroChecarDia(agendaCheck[indexEvento], sala, dia)
        } 
    }

    // checa antes de enviar pro banco de dados se as condições do evento atual estão permitidas
    ultimoChecarHorario( novoEvento, eventoAntigo ) {
        let that = this; 

        const bools = {
            Espaco: novoEvento.espaco == eventoAntigo.espaco,
            Sala: novoEvento.sala == eventoAntigo.sala,
            InicioEntre: that.verificarEntre(novoEvento.start, eventoAntigo.start, eventoAntigo.end),
            FinalEntre: that.verificarEntre(novoEvento.end, eventoAntigo.start, eventoAntigo.end),
            InicioIgual: that.verificarIgual(novoEvento.start, eventoAntigo.start),
            FinalIgual: that.verificarIgual(novoEvento.end, eventoAntigo.end)
        }
    
        var condition1 = bools.Sala && bools.Espaco && (bools.InicioEntre || bools.FinalEntre);
        var condition2 = bools.Sala && bools.Espaco && (bools.InicioIgual || bools.FinalIgual); 
        // console.log('primeiro: ' + !condition1 + ' segundo: ' + !condition2);
        // return condition1 || condition2
        return !condition1 && !condition2
    }

    ultimoChecar(novoEvento){
        var checkAgenda = this.agenda;
        // let that = this;
        for ( var indexEvento in checkAgenda ) {
            
            var eventoAntigo = checkAgenda[indexEvento];
            
            if(this.ultimoChecarHorario( novoEvento, eventoAntigo )) {
                // does nothing
            } else { 
                return false
            }

        }

    }

}


class Actions {
    constructor() {
            this.nome = 'crud functions';
            this.usuarioLogado = firebase.auth().currentUser.uid;
            this.nomeUsuario = firebase.auth().currentUser.displayName;
            this.database = firebase.database();
            this.refAgenda = `users/${this.usuarioLogado}/agenda/`;
            this.refNovo = `users/${this.usuarioLogado}/`;
            this.agenda = [];
            this.checkers = new CheckFuncs(this.agenda);
        }

        async createDado(info, data) {

            try{
                this.database.ref(this.refNovo + info).push().set(data);
            }
            catch (error){
                return error;
            }
            finally{
                return 'success'
            }
        }

        getDados( dadoQuePreciso ){
            var dadosRetornados = [];

            this.database.ref(this.refNovo + dadoQuePreciso).once('value').then(function(snapshot) {  
                var listaDeDados = snapshot.val();
                for (var item in listaDeDados) {
                    dadosRetornados.push(listaDeDados[item]);
                }
                return dadosRetornados
            });

            return dadosRetornados
        }

        create(novoEvento) {

            var novaChave = this.database.ref(this.refAgenda).push().key;
            
            var dados = novoEvento;
            dados.id = novaChave;
            
            this.database.ref(this.refAgenda + novaChave).set(dados);
        }

        checarECriar(evento){
            // if(!this.checkers.ultimoChecar(evento))  ou 
            if(this.checkers.ultimoChecar(evento) == false){
                alert('O evento não pode ser enviado! Verifique os horários disponíveis e tente novamente');
                return false;
            }else{
                this.create(evento);
                notificar('evento enviado com sucesso!', 'bg-success');
                setTimeout(() => {
                    document.location.reload();
                }, 200);
            }
        }

        read() {

            let that = this;
            this.database.ref(this.refAgenda).on('value', function (snapshot) {
        
                var agendaUsuario = snapshot.val();
                that.agenda = [];
                for (var evento in agendaUsuario) {
                    that.agenda.push(agendaUsuario[evento]);
                    that.checkers.agenda = that.agenda;
                }
                
                rebootCalendario(that.agenda);
            });

            return this.agenda & this.checkers.agenda;
        }

        update(id, updates) {

            var updateRef = this.database.ref(this.refAgenda).child(id);
            updateRef.update(updates);
            
            // caso precise fazer update de varias refs ao mesmo tempo 
            // upToDate[ref] = updates;
            // this.database.ref().update(upToDate);

        }

        delete (id)  {

            this.database.ref(this.refAgenda + '/' + id).remove();
        
        }

    }
