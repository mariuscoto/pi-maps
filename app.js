var express = require('express');
var app = express();


// Init db connection
var Mongoose = require('mongoose')
Mongoose.connect('mongodb://root:root@ds047095.mongolab.com:47095/heroku_bgc82cxd')

var Location = require('./models/location')
Location
  .update({'profile': 'default'}, {$set: {'places': 'Bucuresti'}}, {upsert: true})
  .exec(function() {})


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index.html');
});
app.get('/remote', function(req, res) {
    res.render('remote.html');
});

app.get('/put_directions', function(req, res) {
    Location
      .update({'profile': 'default'}, {$set: {'places': req.query.places}}, {upsert: true})
      .exec(function() {})
    res.send('ok')
});
app.get('/directions', function(req, res) {
    Location.findOne({'profile': 'default'}).exec(gotDirections)

    function gotDirections (err, dirs) {
        res.send(dirs)
    }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App started!');
});
