/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

window.onload = observer();

function observer(){

firebase.auth().onAuthStateChanged(function(user) {
    
    if (user) {
        console.log('conectado com o email:' + user.email);
        userLogado = user;
    
    } else {

      window.location.replace('./login');
        // document.write("OOps, você não está logado!");
      // User is signed out.
      // ...
    }
  });

}

setTimeout(function(){
  usuarioLogado = firebase.auth().currentUser; 
  
  if(usuarioLogado) {
    console.log("você está conectado!");
  } else {
    window.location.replace('./login');
  }

}, 1500);
