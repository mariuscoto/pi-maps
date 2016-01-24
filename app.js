var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// Init db connection
var Mongoose = require('mongoose')
Mongoose.connect('mongodb://root:root@ds047095.mongolab.com:47095/heroku_bgc82cxd')

// Add default laocation
var Location = require('./models/location')
Location
  .update({'profile': 'default'}, {$set: {'places': 'Bucuresti'}}, {upsert: true})
  .exec(function() {})

// App config
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

// App routes
app.get('/', function(req, res) {
    res.render('index.html');
});
app.get('/remote', function(req, res) {
    res.render('remote.html', {
      places: req.query.places || ''
    });
});
app.post('/directions', function(req, res) {
    // Remove tailing ','
    req.body.places = req.body.places.replace(/,+$/, "");

    Location
      .update({'profile': 'default'}, {$set: {'places': req.body.places}}, {upsert: true})
      .exec(function() {})
    res.redirect('/remote?places=' + req.body.places)
});
app.get('/directions', function(req, res) {
    Location.findOne({'profile': 'default'}).exec(gotDirections)

    function gotDirections (err, dirs) {
        res.send(dirs)
    }
});

// Start app
app.listen(process.env.PORT || 3000, function () {
  console.log('App started!');
});
