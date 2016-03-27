var nforce = require('nforce');
var express = require('express');
var port = 3000;

var org = nforce.createConnection({
  clientId: '3MVG9uudbyLbNPZMk0vYn7ICarLW4qV5bLdL.KqYws.i1.oN99y14Skth6utXg0nwCuPpSMtr9lB7HIOx6M65',
  clientSecret: '6326007125179395206',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  apiVersion: 'v34.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://sedreambmo-dev-ed.lightning.force.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);