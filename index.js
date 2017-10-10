var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require('request');
var options = {host: "stg-resque.hakuapp.com", path: "/albums.json"};

var mockSongs = [
    [{"id":1,"album_id":1,"song_name":"Legend","song_order":5,"song_label":["explicit","upbeat"],"song_duration":"4:01"},{"id":2,"album_id":1,"song_name":"Energy","song_order":1,"song_label":null,"song_duration":"3:01"},{"id":3,"album_id":1,"song_name":"10 Bands","song_order":4,"song_label":["explicit","upbeat"],"song_duration":"2:57"},{"id":4,"album_id":1,"song_name":"Know Yourself","song_order":2,"song_label":null,"song_duration":"4:35"},{"id":5,"album_id":1,"song_name":"No Tellin'","song_order":3,"song_label":["explicit","upbeat"],"song_duration":"5:10"}],
    [{"id":6,"album_id":2,"song_name":"Did I Hear You Say You Love Me","song_order":3,"song_label":["explicit","upbeat"],"song_duration":"4:07"},{"id":7,"album_id":2,"song_name":"All I Do","song_order":5,"song_label":["explicit"],"song_duration":"5:06"},{"id":8,"album_id":2,"song_name":"Rocket Love","song_order":4,"song_label":[],"song_duration":"4:39"},{"id":9,"album_id":2,"song_name":"I Ain't Gonna Stand for It","song_order":2,"song_label":["explicit"],"song_duration":"4:39"},{"id":10,"album_id":2,"song_name":"As If You Read My Mind","song_order":1,"song_label":[],"song_duration":"3:37"}],
    [{"id":11,"album_id":3,"song_name":"One More Night","song_order":4,"song_label":["explicit","upbeat"],"song_duration":"3:39"},{"id":12,"album_id":3,"song_name":"Payphone","song_order":3,"song_label":[],"song_duration":"3:51"},{"id":13,"album_id":3,"song_name":"Daylight","song_order":1,"song_label":["explicit","upbeat"],"song_duration":"3:45"},{"id":14,"album_id":3,"song_name":"Lucky Strike","song_order":5,"song_label":null,"song_duration":"3:05"},{"id":15,"album_id":3,"song_name":"The Man Who Never Lied","song_order":2,"song_label":["explicit","upbeat"],"song_duration":"3:25"}],
    [{"id":16,"album_id":4,"song_name":"Million $ Show","song_order":3,"song_label":["explicit","upbeat"],"song_duration":"3:39"},{"id":17,"album_id":4,"song_name":"Payphone","song_order":5,"song_label":["explicit"],"song_duration":"3:51"},{"id":18,"album_id":4,"song_name":"Ain't About 2 Stop","song_label":["explicit"],"song_order":1,"song_duration":"3:39"},{"id":19,"album_id":4,"song_name":"Like a Mack","song_order":2,"song_label":["slow"],"song_duration":"4:05"},{"id":20,"album_id":4,"song_name":"This Could B Us","song_order":4,"song_duration":"4:11"}],
    [{"id":21,"album_id":5,"song_name":"Everlasting Light","song_order":5,"song_label":["explicit","upbeat"],"song_duration":"3:24"},{"id":22,"album_id":5,"song_name":"Next Girl","song_order":3,"song_label":["explicit"],"song_duration":"3:18"},{"id":23,"album_id":5,"song_name":"Tighten Up","song_order":2,"song_duration":"3:31"},{"id":24,"album_id":5,"song_name":"Howlin' for You","song_order":4,"song_label":["explicit"],"song_duration":"3:12"},{"id":25,"album_id":5,"song_name":"She's Long Gone","song_order":1,"song_duration":"3:12"}]
];
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
app.set('port', (process.env.PORT || 5000));
app.post('/songs', function(req, res){
    function findSong(song){
        return song[0].album_id == req.body.id;
    }
   
    res.send(mockSongs.find(findSong))
    // request('https://stg-resque.hakuapp.com/songs.json?album_id=' + req.body.id, function(error, response, body){
    //     if(!error && response.statusCode == 200){
    //         res.send(body);
    //     }
    // })
})

// app.listen(3010, function(){
//     console.log('Server started on Port 3010...')
// })
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

