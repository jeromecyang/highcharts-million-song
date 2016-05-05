var app = angular.module("highchartsMillionSong", []);

app.controller("mainController", ["$scope", function($scope){
  
}]);

app.directive("barChart", ["$http", function($http){
  return {
    restrict: "A",
    scope: { chartDataBindTo: "=" },
    link: function(scope, elem){
      
    }
  }
}]);