var app = angular.module("highchartsMillionSong", []);

app.controller("mainController", ["$scope", function($scope){
  
}]);

app.directive("barChart", ["$http", function($http){
  return {
    restrict: "A",
    scope: { chartDataBindTo: "=" },
    link: function(scope, elem){
      $http.get('http://localhost:8080/aggregate/mean,tempo,year').then(function(response) {
        var chartData = response.data;
        console.log(chartData);
      });
    }
  }
}]);