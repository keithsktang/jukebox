var app = angular.module('jukebox',[] );
app.controller('albumCrtl', function($scope,$http, $timeout, $interval){
    $scope.hi = "Hello World!";
    $http.get('/albums').then(function(response){
        $scope.albums = response.data;
        $timeout( assignPositions, 0);
        // $interval( scroll, 10000, '', '','next');
    });

    
    // window.setInterval("scroll('next')", 4000);

    var itemPositions = [];
    function assignPositions() {
        for (var i = 0; i < $scope.albums.length; i++) {
            if (i === 0) {
                itemPositions[i] = 'one';
            } else if (i === 1) {
                itemPositions[i] = 'two';
            } else if (i === 2) {
                itemPositions[i] = 'three';
            } else if (i === 3) {
                itemPositions[i] = 'four';
            } else {
                itemPositions[i] = 'five';
            }
        }
        /* Add each class to the corresponding element */
        var items = $('#scroller .item');
        items.each(function(index) {
            $(this).addClass(itemPositions[index]);
        });
    }
    function scroll(direction) {
        if (direction === 'prev') {
            itemPositions.push(itemPositions.shift());
        } else if (direction === 'next') {
            itemPositions.unshift(itemPositions.pop());
        }
        $('#scroller .item').removeClass('one two three four five').each(function(index) {
            $(this).addClass(itemPositions[index]);
        });        
    }
    /* Hover behaviours */
    // $('#scroller').hover(function() {
    //     $('.nav').stop(true, true).fadeIn(200);
    // }, function() {
    //     $('.nav').stop(true, true).fadeOut(200);
    // });

    /* Click behaviours */
    $('.prev').click(function() {
        scroll('prev');
    });
    $('.next').click(function() {
        scroll('next');
    });

})

