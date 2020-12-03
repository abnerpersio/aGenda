/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');
var serviceAccount = require("./aGendaKey.json");

const {google} = require('googleapis');
const googleCalendar = require('./google-calendar');
const { firebase } = require('googleapis/build/src/apis/firebase');

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyAUR1AS0beiA9C1ObpNwVw2T-VM_mxtx0I",
  authDomain: "a-genda-2020.firebaseapp.com",
  databaseURL: "https://a-genda-2020.firebaseio.com",
  appId: "1:397881610119:web:1309ef7354f79472448d22",
});

exports.requestFunction = functions.https.onRequest((req, res) => {

  res.send(req.query || 'Nada enviado');

});

exports.calendarSinc = functions.https.onRequest((req, res) => {
  
  functions.database.ref(userUid + '/agenda/')
  res.send(req.query.event || 'Nenhum evento enviado');

});

// primeira versao
// exports.criarCalendarioNovo = functions.database.ref('/users/{userUid}/googletoken')
//   .onCreate((snapshot, context) => {
//     tokenDoGoogle = snapshot.val();
    
//     criarCalendario(tokenDoGoogle);
//   });

// const criarCalendario = (token) => {
//   console.log('token para criar novo calendario: ' + token);
// }

// const adicionarEventoNoGoogle = () => {
//   return true   
// }

// exports.sincronizarTodosEventos = functions.database.ref('/users/{userUid}/agenda/{evento}')
//     .onWrite((snapshot, context) => {
//       const evento = snapshot.val();
      
//       adicionarEventoNoGoogle(evento);
//     });
// primeira versao /////

exports.criarCalendarioNovo = functions.database.ref('/users/{userUid}/googletoken')
  .onCreate((snapshot, context) => {
    tokenDoGoogle = snapshot.val();
    
    criarCalendario(tokenDoGoogle);
  });

const criarCalendario = (token) => {
  console.log('token para criar novo calendario: ' + token);
}

const adicionarEventoNoGoogle = () => {
  return true   
}

exports.sincronizarTodosEventos = functions.database.ref('/users/{userUid}/agenda/{evento}')
    .onWrite((snapshot, context) => {
      const evento = snapshot.val();
      
      adicionarEventoNoGoogle(evento);
    });


/*  calendar API */

exports.acessarLinkParaLogar = functions.https.onRequest((req, res) => {

  res.set('Access-Control-Allow-Origin', 'https://localhost');
  res.set('Access-Control-Allow-Credentials', 'true');

  res.redirect(googleCalendar.urlGoogle());

})

exports.getGoogleToken = functions.https.onRequest((req, res) => {

  res.set('Access-Control-Allow-Origin', 'https://localhost');
  res.set('Access-Control-Allow-Credentials', 'true');

  var htmlPage = `
  <!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>a Genda - Gerenciamento Inteligente</title>
    <link rel="icon" href="./../assets/images/favicon.ico">	
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> 

  </head>
  <body>	
    <div class="navbar navbar navbar-dark bg-dark">
      <div class="navbar-header">
        <a class="" href="./home"><img src="../assets/images/logo_light.png" alt=""></a>

        <ul class="nav navbar-nav">
          <li><a data-toggle="collapse" data-target="#navbar-mobile"><i class="icon-tree5"></i></a></li>
        </ul>
      </div>

    </div>
    <div class="page-container">

      <div class="page-content">

        <div class="content-wrapper mb-5">

              <div class="card p-5">
                <div class="card-body">
                    <h4 class="text-center text-success" id="status">Pronto, suas contas foram sincronizadas com sucesso!</h4>
                    <h5 class="text-center"><a href="../home">Voltar ao menu principal</a></h5>  
                  </div>
              </div>
        </div>
      </div>

      <div class="footer fixed-bottom">
        &copy; 2020 <a href="#">a Genda Sistemas de Controle</a>.
        Criado com &hearts; por <a target="blank" href="https:/instagram.com/abnerpersio">Abner Persio</a>
      </div>
    </div>
  </body>
  </html>
  `;   
  
  googleCalendar.pegarContaDoGoogleComCodigo(req.query.code, (err, res) => {
    if (err) {
        document.write('sua requisição não correu bem, tente novamente mais tarde.')
    } else {
        var tokens = res;
        console.log(tokens.refreshToken + ' refresh / access: ' + tokens.accessToken)        
    }
  });

  res.send(htmlPage)
});

checkToken = () => {

  const oauth2Client = new google.auth.OAuth2();
  googleCalendar.checkToken(oauth2Client, tokenDeAcesso).then(function() {
    
    res.send(htmlPage);

  }).catch(function(err){
    res.send('Ocorreu um erro, tente novamente ou entre em contato com o suporte :)') 
  });

  googleCalendar.listEvents(oauth2Client, (events) => {  
      
    console.log('eventos: ' + events[0].summary);
    testeDosEventos = events;
  });

}

