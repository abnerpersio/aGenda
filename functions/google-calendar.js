const { google } = require("googleapis");
const { firebase } = require("googleapis/build/src/apis/firebase");

checkToken = async (auth, code) => {

  const { tokens } = await auth.getToken(code);

  if (tokens) {
    auth.setCredentials(tokens);
    
    auth.on('tokens', (tokens) => {
        
      if(tokens.refresh_token) {
        console.log('refresh token: ' + tokens.refresh_token);
        functions.database.ref('googletoken').set(tokens);
      }

    });

  } else {

      return 'nenhum token foi enviado, tente novamente';
  }

    return auth;
};

const googleConfig = {
  clientId: '397881610119-ls76le0ivu9ksfia345d516cumtp8q46.apps.googleusercontent.com',
  clientSecret: 'FdE14FSOswui75Cz6kwT_TJe',
  redirect: 'http://localhost:5000/sync/'
}

// scopes use for the application
const defaultScope = [
  'https://www.googleapis.com/auth/calendar',
]

// oauth2 client
function createConnection() {
  return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
  );
}

// generate authentication url
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope
  });
}

// pega o url para autenticar
module.exports.urlGoogle = function () {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

// pega os tokens necessarios
module.exports.pegarContaDoGoogleComCodigo = async function (code, enviarResposta) {
  
  const auth = createConnection();
  const { tokens } = await auth.getToken(code);

  auth.setCredentials(tokens);
  auth.on('tokens', (tokens) => {
        
    if(tokens.refresh_token) {
      console.log('refresh token: ' + tokens.refresh_token);
    } else {
      console.log('o pedido não deu certo');
      enviarResposta(err);
    }
  });

  const sendTokens = {
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token
  }
  
  enviarResposta(null, sendTokens);

}


const insertEvents = () => {

}

