var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require('request');
var options = {host: "stg-resque.hakuapp.com", path: "/albums.json"};
// Body Parser for json encode
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));

app.get('/', function(req, res){
    res.send('hello world!')

})

app.get('/albums', function(req, res){
    request('https://stg-resque.hakuapp.com/albums.json', function(error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
})

app.get('/songs', function(req, res){
    request('https://stg-resque.hakuapp.com/songs.json?album_id=1', function(error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
})

app.listen(3010, function(){
    console.log('Server started on Port 3010...')
})