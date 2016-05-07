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

app.directive("barChart", ["$http", function($http){
  return {
    restrict: "A",
    link: function(scope, elem){
      $http.get('http://localhost:8080/get_histogram/duration,30').then(function(response) {
        var chartData = response.data;
        var categories = chartData.map(function(d){ return Math.round(d.min) + "-" + Math.round(d.max) });
        var values = chartData.map(function(d){ return d.count });
        
        elem.highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: 'Songs Distribution By Duration'
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: 'Duration (seconds)'
            }
          },
          series: [{
            name: 'Count',
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

app.directive("pieChart", ["$http", function($http){
  return {
    restrict: "A",
    link: function(scope, elem){
      $http.get('http://localhost:8080/get_unique_values_and_counts/artist_location,30').then(function(response) {
        var chartData = response.data;
        var data = chartData.filter(function(d){ return d.value }).map(function(d){ return { name: d.value, y: d.count } });
        
        elem.highcharts({
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Top 30 Song Production Locations'
          },
          series: [{
            name: 'Count of songs',
            data: data
          }],
          credits: {
            enabled: false
          }
        });
      });
    }
  }
}]);