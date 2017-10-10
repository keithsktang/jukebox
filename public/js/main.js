var app = angular.module('jukebox',[] );
app.controller('carousel', function($scope,$http, $timeout, $interval){
    $scope.hi = "Hello World!";
    $scope.albums = [];

    $http.get('/albums').then(function(response){
        $scope.albums = [{"id":1,"name":"If Your'e Reading This It's Too Late","artist_name":"DRAKE","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-1.png"},{"id":2,"name":"Hotter Than July","artist_name":"Stevie Wonder","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-2.png"},{"id":3,"name":"Overexposed","artist_name":"Maroon 5","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-3.png"},{"id":4,"name":"Hit n Run Phase One","artist_name":"PRINCE","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-4.png"},{"id":5,"name":"Brothers","artist_name":"The Black Keys","cover_photo_url":"https://s3.amazonaws.com/hakuapps/prod/album-5.png"}]        
        // $scope.albums = response.data;
        $timeout( function(){  
            assignPositions();
            scroll('left');
            scroll('left');        
            $scope.getSongs($('.three'))            
        }, 0);
        // $interval( scroll, 10000, '', '','next');
    });

    
    $scope.getSongs = function(id){
        angular.element('#songs').addClass('rollup')              
        $http.post('/songs', {id: id[0].id}).then(function(response){
            $scope.songs = response.data;
            $timeout(function(){angular.element('#songs').removeClass('rollup')},500)                    
            // $scope.songs = response.data;
        });
    }   
    // window.setInterval("scroll('next')", 4000);

    var albumPositions = [];
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
    /* Hover behaviours */
    // $('#scroller').hover(function() {
    //     $('.nav').stop(true, true).fadeIn(200);
    // }, function() {
    //     $('.nav').stop(true, true).fadeOut(200);
    // });

    /* Click behaviours */
    $('.left').click(function() {
        scroll('left');
       $scope.getSongs($('.three'))
        });
    $('.right').click(function() {
        scroll('right');
        $scope.getSongs($('.three'))    });
    $scope.fav = function(song, ev){
        let star = ev.target.id
        $('#'+star).hasClass('fav') ? $('#'+star).removeClass('fav') : $('#'+star).addClass('fav');
    }
   
})

