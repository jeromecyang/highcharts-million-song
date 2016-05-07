var app = angular.module("highchartsMillionSong", []);

app.controller("mainController", ["$scope", function($scope){
  
}]);

app.directive("lineChart", ["$http", function($http){
  return {
    restrict: "A",
    link: function(scope, elem){
      $http.get('http://localhost:8080/aggregate_by_field/tempo,mean,year').then(function(response) {
        var chartData = response.data;
        chartData.splice(0,1);
        var categories = chartData.map(function(d){ return d.label });
        var values = chartData.map(function(d){ return d.value });
        
        elem.highcharts({
          title: {
            text: 'Tempo Over Years'
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: 'Tempo'
            }
          },
          series: [{
            name: 'Tempo',
            data: values
          }],
          credits: {
            enabled: false
          }
        });
      });
    }
  }
}]);