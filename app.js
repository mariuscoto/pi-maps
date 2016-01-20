var express = require('express');
var app = express();


// Init db connection
var Mongoose = require('mongoose')
Mongoose.connect('mongodb://root:root@ds047095.mongolab.com:47095/heroku_bgc82cxd')

var Location = require('./models/location')
new Location({'name': 'Craiova'}).save()


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App started!');
});
