var app = angular.module('jukebox',[] );
app.controller('carousel', function($scope,$http, $timeout, $interval){
$scope.albums = [];

    // Auto scroll functions and stop scrolling as windows.interval promise
    var stop;
    $scope.autoScroll = function(){
        if(angular.isDefined(stop)) return;
        stop = $interval( function(){ // create promise obj
            scroll('right');
            $scope.getSongs($('.three'))            
        }, 4000, $scope.albums.length)};
    $scope.stopScroll = function(){
        if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined; //promise must be cleared for every instance
        }
    };

    //Get albums on load
    $http.get('/albums').then(function(response){
        // $scope.albums = [{"id":1,"name":"If Your'e Reading This It's Too Late","artist_name":"DRAKE","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-1.png"},{"id":2,"name":"Hotter Than July","artist_name":"Stevie Wonder","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-2.png"},{"id":3,"name":"Overexposed","artist_name":"Maroon 5","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-3.png"},{"id":4,"name":"Hit n Run Phase One","artist_name":"PRINCE","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-4.png"},{"id":5,"name":"Brothers","artist_name":"The Black Keys","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-5.png"}]        
        $scope.albums = response.data;
        $timeout( function(){  
            assignPositions();
            scroll('left'); 
            scroll('left');        
            $scope.getSongs($('.three'))  // to match spec, first load album Id 3.
        }, 0);
        // $scope.autoScroll();
    });

    //Get fav list on load 
    $http.get('/fav').then(function(response){
        $scope.favList = response.data;
    })

    //load song and matching favorite songs with mongo favList to show yellow star
    $scope.getSongs = function(id){
        angular.element('#songs').addClass('rollup')              
        $http.post('/songs', {id: id[0].id}).then(function(response){
            $scope.songs = response.data;
            $scope.songs.forEach(function(song){
                var fav = $scope.favList;
                for (var i = 0; i < fav.length; i++ ){
                    if(fav[i].id == song.id && fav[i].fav === 'true'){
                       $timeout(function(){
                        $('#star'+song.id).addClass('fav');
                       }, 0) 
                    }
                }
            });
            $timeout(function(){angular.element('#songs').removeClass('rollup')},500)                    
        });
    }   

    var albumPositions = []; // assign initial postions
    function assignPositions() {
        for (var i = 0; i < $scope.albums.length; i++) {
            if (i === 0) {
                albumPositions[i] = 'one';
            } else if (i === 1) {
                albumPositions[i] = 'two';
            } else if (i === 2) {
                albumPositions[i] = 'three';
            } else if (i === 3) {
                albumPositions[i] = 'four';
            } else {
                albumPositions[i] = 'five';
            }
        }
        
        /* Add each class to the corresponding element */
        var items = $('#carousel .album');
        items.each(function(index) {
            $(this).addClass(albumPositions[index]);
        });
    }

    // scrolling function, after each array shuttle, remove all class and re-assign
    function scroll(direction) {
        if (direction === 'left') {
            albumPositions.push(albumPositions.shift());
        } else if (direction === 'right') {
            albumPositions.unshift(albumPositions.pop());
        }
        $('#carousel .album').removeClass('one two three four five').each(function(index) {
            $(this).addClass(albumPositions[index]);
        });        
    }
    /* Carousel Hover  */
    $('#carousel').hover(function() {
        $('.scroll').stop(true, true).fadeIn(200);
    }, function() {
        $('.scroll').stop(true, true).fadeOut(200);
    });

    /* Left/Right Click */
    $('.left').click(function() {
        scroll('left');
       $scope.getSongs($('.three'))
        });
    $('.right').click(function() {
        scroll('right');
        $scope.getSongs($('.three'))    });

        // Persisting Favorite Song
    $scope.fav = function(song, ev){
        var starId = ev.target.id //find star element id by song id.
        var request = { // set request obj
            mongoId:{ "_id": ""},
            data: {
                "id": song.id,
                "fav": 'true'
            }
        }
        // try to see if the song is already in the favList
        var favSong = $scope.favList.find(function(fav){
            return fav.id == song.id;
        })
        if(!favSong){ // if not already in favList, add to favList 
            request.data.fav = 'true'
            $http.post('/favList', request).then(function(res){
                favRes($scope, song, request, starId, res);
            })
        }else{ //if already in favList, update fav state
            request.mongoId['_id'] = favSong['_id'];
            favSong.fav === 'true' ? request.data.fav = 'false': request.data.fav = 'true';
            $http.put('/favList', request).then(function(res){
                favRes($scope, song, request, starId, res);
            })
        }
    }

})
// shared response function to update UI class
function favRes($scope, song, request, starId, res) {
    var index = $scope.favList.findIndex(function(fav) {
    return fav.id == song.id;
});
    if (index != -1){
        $scope.favList[index].fav = request.data.fav;
    }else {
        $scope.favList.push(request.data)
    }
    $('#' + starId).hasClass('fav')?$('#' + starId).removeClass('fav'): $('#' + starId).addClass('fav');
}

