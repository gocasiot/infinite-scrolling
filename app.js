'use strict';

var app = angular.module('myApp', []);

app.factory('VideoFactory', function ($http, $log) {
	
	var factory = {
		getVideos: function (nextPageToken) {
			return $http.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					maxResults: 20,
					part: "snippet",
					key: "AIzaSyDooeiZVrFs_K7EHQHvEpnqVF_S2gg3am0",
					pageToken: nextPageToken
				}
			})
			.then(function (res) {
				return res.data;
			})
			.catch($log);
		}
	};

	return factory;
});


app.controller('HomeCtrl', function ($scope, VideoFactory, $window) {
	var nextPageToken;

	// Load up to 20 videos when open the page
	VideoFactory.getVideos()
	.then(function (res) {
		nextPageToken = res.nextPageToken;
		$scope.videos = res.items;
	});

	// When the user gets to the bottom of the page, call the 'getVideos' function to get more videos from youtube
	angular.element($window).bind("scroll", function() {
	    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
	    var body = document.body, html = document.documentElement;
	    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
	    var windowBottom = windowHeight + window.pageYOffset;
	    if (windowBottom >= docHeight) {

	        VideoFactory.getVideos(nextPageToken)
	        .then(function(res) {
	        	nextPageToken = res.nextPageToken;
	        	$scope.videos = $scope.videos.concat(res.items);
	        });

	    }
	});

	// Opens the selected youtube video 
	$scope.openVideo = function (videoId){
		$window.location.href = 'https://www.youtube.com/watch?v=' + videoId;
	}

	
});