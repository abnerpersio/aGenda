/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

firebase.auth().languageCode = 'pt';

function autenticarEmail(email, senha) {
    firebase.auth().signInWithEmailAndPassword(email, senha).then(function(){
        notificar('Login efetuado com sucesso!', 'bg-success');
        window.location.href= "./home"
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/invalid-email"){
            notificar('Email inválido :(', 'bg-danger');
        } else if( errorCode == "auth/wrong-password"){
            notificar('Senha incorreta :(', 'bg-danger');
        } else {    
            notificar('Não foi possível efetuar login' + errorCode, 'bg-danger')
        }
    });
} 

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/calendar");

function popupLogin(){
    // firebase.auth().getRedirectResult()        
    // firebase.auth().currentUser.linkWithPopup(provider)
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {

        if (result.credential) {
            document.write("Você está sendo direcionado com segurança! Se nada acontecer, tente novamente");

            var token = result.credential.accessToken
            console.log(result);
            console.log(result.credential);
            var refreshToken = result.credential.refresh;
            crud.createDado('googletoken', token);

            // var url = "http://localhost:5000/sync/?token=" + token;
            // window.location.href = url;
        }
            // The signed-in user info.
        

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
            // ...
        console.log("Erro de login: " + errorCode);
        console.log("Mensagem de erro: " + errorMessage);
        console.log("Usuário com erro: " + email);

    });

}

function testeAutenticarAnonimo() {

    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}
