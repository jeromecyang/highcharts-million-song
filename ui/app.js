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
          tooltip: {
            headerFormat: '<span style="font-size: 10px">Year: {point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'
          },
          colors: ['#f45b5b'],
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
            data: values,
            pointPadding: -0.25
          }],
          tooltip: {
            headerFormat: '<span style="font-size: 10px">Duration: {point.key} seconds</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>'
          },
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

app.directive("scatterPlot", ["$http", function($http){
  return {
    restrict: "A",
    link: function(scope, elem){
      $http.get('http://localhost:8080/get_top_n_sorted_by_field/song_hotttnesss,100').then(function(response) {
        var chartData = response.data;
        var data = chartData;
        data.forEach(function(song){
          song.x = song.loudness;
          song.y = song.tempo;
        });
        
        elem.highcharts({
          chart: {
            type: 'scatter',
            zoomType: 'xy'
          },
          title: {
            text: 'Loudness & Tempo Of The 100 Hottest Songs'
          },
          xAxis: {
            title: {
              text: 'Loudness'
            }
          },
          yAxis: {
            title: {
              text: 'Tempo'
            }
          },
          series: [{
            name: 'Hot Song',
            data: data
          }],
          tooltip: {
            headerFormat: '',
            pointFormatter: function(){
              var song = this;
              return "<b>" + song.title + "</b><br><i>" + song.artist_name + ", " + song.year + "</i>"
                + "<br>-<br>Duration: " + Math.round(song.duration)
                + "<br>Tempo: " + Math.round(song.tempo)
                + "<br>Loudness: " + song.loudness
                + "<br>Hotttnesss: " + Math.round(song.song_hotttnesss*1000)/1000;
            }
          },
          colors: ['#45a9a8'],
          credits: {
            enabled: false
          }
        });
      });
    }
  }
}]);

app.directive("highMap", ["$http", function($http){
  return {  
    restrict: "A",
    link: function(scope, elem){
      $http.get('http://localhost:8080/get_top_n_sorted_by_field/song_hotttnesss,200').then(function(response) {
        var chartData = response.data;
        var data = chartData.filter(function(song){ return song.artist_longitude && song.artist_latitude });
        data.forEach(function(song){
          song.lon = song.artist_longitude;
          song.lat = song.artist_latitude;
        });
        
        elem.highcharts('Map', {
          title: {
            text: 'Artist Locations Of The Top 200 Hottest Songs'
          },
          tooltip: {
            headerFormat: '',
            pointFormat: "<b>{point.title}</b><br>{point.artist_name}, {point.year}<br>{point.artist_location}"
                + "<br>-<br>Duration: {point.duration:,.0f}"
                + "<br>Tempo: {point.tempo:,.0f}"
                + "<br>Loudness: {point.loudness}"
                + "<br>Hotttnesss: {point.song_hotttnesss:,.3f}"
          },
          legend: {
            enabled: false
          },
          series: [{
            mapData: Highcharts.maps['custom/world']
          }, {
            type: 'mappoint',
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