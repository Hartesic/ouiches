'use strict';
var ouichesApp = angular.module('ouichesApp', []);

ouichesApp.controller('ouichesController', ['$scope', '$http', 'chromeStorage', function($scope, $http, chromeStorage, tools){
	$scope.searchTag = '';
	$scope.sound;
	$scope.actual_tag = null;
	$scope.tag_list = [];
	$scope.fav_list = {};
	$scope.getTags = function(data){
		$scope.tag_list = data.items;
	};
	$scope.getFavs = function(data){
		$scope.fav_list = data;
	}
	$scope.openSite = function(){
		window.open('http://ouich.es/');
	};
	$scope.readTag = function(tag, index){
		if (typeof $scope.sound == 'object')
			$scope.sound.stop();
		$scope.sound = new Howl({
			urls: ['http://ouich.es/mp3/' + tag + '.mp3']
		}).play();
		$scope.actual_tag = $scope.tag_list[index];
		console.log($scope.actual_tag);
	};
	$scope.addTagToFavs = function(tag, index){
		$scope.fav_list[tag] = index;
		var data = {};
		data[tag] = index;
		chromeStorage.set(data, "Favoris ajouté");
	};
	$scope.removeTagFromFavs = function(tag){
		$scope.fav_list[tag] = false;
		var data = {};
		data[tag] = false;
		chromeStorage.set(data, "Favoris supprimé");
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

ouichesApp.filter('notFalse', function(){
	return function(favs, data_type){
		if (typeof data_type === 'undefined' || data_type === 'object'){
			var filtered_favs = {};
			for (var fav in favs){
				if (favs[fav] !== false)
					filtered_favs[fav] = favs[fav];
			}
			return filtered_favs;
		} else if (data_type === 'array'){
			var filtered_favs = [];
			for (var fav in favs){
				if (favs[fav] !== false)
					filtered_favs.push(fav);
			}
			return filtered_favs;
		} else
			console.log('Error: Unkown data type "' + data_type + '"');
		return;
	};
});
