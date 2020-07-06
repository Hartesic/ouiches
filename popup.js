'use strict';
var ouichesApp = angular.module('ouichesApp', []);

ouichesApp.controller('ouichesController', ['$scope', '$http', 'chromeStorage', function($scope, $http, chromeStorage, tools){
	$scope.getTags = function(data){
		$scope.tagList = data.items;
	};
	$scope.getFavs = function(data){
		$scope.favList = data;
	};
	$scope.openSite = function(){
		window.open('https://ouich.es/');
	};
	$scope.readTag = function(tagObj){
		if ($scope.sound !== null)
			$scope.sound.stop();
		$scope.sound = new Howl({
			urls: ['https://ouich.es/mp3/' + tagObj.tag + '.mp3']
		}).play();
		$scope.selectedTag = tagObj;
	};
	$scope.updateHoveredTag = function(tag){
		$scope.hoveredTag = tag;
	};
	$scope.addTagToFavs = function(tagObj){
		$scope.favList[tagObj.tag] = $scope.tagList.indexOf(tagObj);
		var data = {};
		data[tagObj.tag] = $scope.tagList.indexOf(tagObj);
		chromeStorage.set(data, "Favoris ajouté");
	};
	$scope.removeTagFromFavs = function(tag){
		$scope.favList[tag] = false;
		var data = {};
		data[tag] = false;
		chromeStorage.set(data, "Favoris supprimé");
	};
	$scope.isFav = function(tag){
		if (typeof $scope.favList[tag] === 'undefined')
			return false;
		return $scope.favList[tag] !== false;
	};
	/*
	** Main function
	** Initialize the tags, favorites and $scope variables
	*/
	$scope.init = function(){
		$scope.searchTag = '';
		$scope.sound = null;
		$scope.selectedTag = null;
		$scope.hoveredTag = null;
		$scope.tagList = [];
		$scope.favList = {};
		$http.get('tags.json').success($scope.getTags);
		chromeStorage.get(null, $scope.getFavs);
	}();
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
	return function(favs, dataType){
		if (typeof dataType === 'undefined' || dataType === 'object'){
			var filteredFavs = {};
			for (var fav in favs){
				if (favs[fav] !== false)
					filteredFavs[fav] = favs[fav];
			}
			return filteredFavs;
		} else if (dataType === 'array'){
			var filteredFavs = [];
			for (var fav in favs){
				if (favs[fav] !== false)
					filteredFavs.push(fav);
			}
			return filteredFavs;
		} else
			console.log('Error: Unkown data type "' + dataType + '"');
		return;
	};
});
