var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require('request');
var mongojs = require('mongojs'); 
var db = mongojs('mongodb://sa:db123@ds115035.mlab.com:15035/jukebox',['favorites']);

// Body Parser for json encode
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

// Get favList
app.get('/fav', function(req, res, next){
    db.favorites.find(function(err, fav){
        if(!err){
        res.json(fav);
        }else{
            res.send(err);
        }
    })
})

// Persisting favorites methods
app.post('/favList', function(req, res, next){
        // simple validation for song_id presence
        if(!req.body.data['id']){ 
            res.status(400);
            res.json({
                "error": "Can't find song"
            });
        }else{
            db.favorites.save(req.body.data, function(err, favSong){
                if(err){
                    res.send(err);
                    
                }
                res.json(favSong);
            });
    
        }
    })

// Updating favorites methods
app.put('/favList', function(req, res, next){
        // simple validation for song_id presence
        if(!req.body.data['id']){ 
            res.status(400);
            res.json({
                "error": "Can't find song"
            });
        }else{
            db.favorites.update({_id: mongojs.ObjectId(req.body.mongoId['_id'])}, req.body.data,{}, function(err, favSong){
                if(err){
                    res.send(err);
                    
                }
                res.json(favSong);
                
            });
        }
    })



// Get albums method
app.get('/albums', function(req, res){
    request('https://stg-resque.hakuapp.com/albums.json', function(error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
})
//Get Songs method
app.post('/songs', function(req, res){
    request('https://stg-resque.hakuapp.com/songs.json?album_id=' + req.body.id, function(error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
})

//Set port 5000 for Dev eviornment only
app.set('port', (process.env.PORT || 5000));

//local port listener
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

 