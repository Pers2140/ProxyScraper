var express = require('express');
var app = express();


var useproxiesrouter = require('./routes/US_proxies/USProxyRoute.js');
var rueproxiesrouter = require('./routes/RU_proxies/RUProxyRoute.js');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use('/usproxies', useproxiesrouter)
app.use('/ruproxies', rueproxiesrouter)
// index page
// app.get('/', function(req, res) {
//   res.render('usproxies.ejs');
// });

// // about page
// app.get('/about', function(req, res) {
//   res.render('pages/about');
// });

app.listen(80);
console.log('Server is listening on port 80');