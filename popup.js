'use strict';
var ouichesApp = angular.module('ouichesApp', []);

ouichesApp.controller('ouichesController', ['$scope', '$http', function($scope, $http){
	$scope.tagFilter;
	$scope.sound;
	$http.get('tags.json').success(function(data){
		$scope.tag_list = data;
	});
	$scope.openSite = function(){
		window.open('http://ouich.es/');
	};
	$scope.readTag = function(tag){
		if (typeof $scope.sound == 'object')
			$scope.sound.stop();
		$scope.sound = new Howl({
			urls: ['http://ouich.es/mp3/' + tag + '.mp3']
		}).play();
	};
}]);