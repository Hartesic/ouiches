'use strict';
var ouichesApp = angular.module('ouichesApp', []);

ouichesApp.controller('ouichesController', ['$scope', '$http', 'chromeStorage', 'tools', function($scope, $http, chromeStorage, tools){
	$scope.searchTag = '';
	$scope.sound;
	$scope.tag_list = [];
	$scope.fav_list = [];
	$scope.getTags = function(data){
		$scope.tag_list = data;
	};
	$scope.getFavs = function(data){
		$scope.fav_list = tools.objectKeysToArray(data);
	}
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
	$scope.addTagToFavs = function(tag){
		if ($scope.fav_list.indexOf(tag) > -1)
			return;
		$scope.fav_list.push(tag);
		var data = {};
		data[tag] = true;
		chromeStorage.set(data, "Favoris ajouté");
	};
	$scope.removeTagFromFavs = function(tag){
		if ($scope.fav_list.indexOf(tag) > -1){
			$scope.fav_list.splice($scope.fav_list.indexOf(tag), 1);
			var data = {};
			data[tag] = false;
			chromeStorage.set(data, "Favoris supprimé");
		}
	}
	$http.get('tags.json').success($scope.getTags);
	chromeStorage.get(null, $scope.getFavs);
}]);

ouichesApp.factory('chromeStorage', [function(){
	return {
		get: function(data, func){
			chrome.storage.sync.get(data, func);
		},
		set: function(data, msg){
			chrome.storage.sync.set(data, function(){
				console.log(msg);
			});
		}
	};
}]);

ouichesApp.factory('tools', [function(){
	return {
		objectValuesToArray: function(data){
			var result = [];
			for (var index in data)
				result.push(data[index]);
			return result;
		},
		objectKeysToArray: function(data){
			var result = [];
			for (var index in data){
				if (data[index] == true)
					result.push(index);
			}
			return result;
		}
	};
}]);