var express = require('express');
var app = express();


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App started!');
});
