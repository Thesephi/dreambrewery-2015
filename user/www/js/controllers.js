angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('SearchCtrl', function($scope, uiGmapGoogleMapApi) {
  var uiGmapGoogleMap ='';
  var directionsDisplay ='';

  // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  init();
  function init(){
    $scope.startEnd = {};
    $scope.map = {
      center: { latitude: 1.3068147, longitude: 103.8099239 },
      options: { minZoom: 3, maxZoom: 16 },
      zoom: 18,
      control : {}
    };
    var lat = 1.3068147;
    var lng = 103.8099239;
    console.log(lat,lng)

    $scope.markerEnd = {
      id: 'end'
    };
    $scope.markerStart = {
      id: 'start',
      coords: {latitude: lat,longitude: lng},
      coord: {lat: lat, lng: lng},
      latlng: lat + ',' + lng
    }
    console.log($scope.markerStart)

  };

  function getGeoLocation(){

  }
  //init



  uiGmapGoogleMapApi.then(function(maps) {
    console.log('a');


  });


  $scope.doMapStart = function(item) {
    console.log($scope.startEnd);


  };

  $scope.doMapEnd = function(item) {
    console.log($scope.startEnd);


  };

  //only in Singapore
  $scope.geocodeOptions = {
    componentRestrictions: {
      //VN, SG
      country : 'SG'
    },
  };

  console.log($scope.geocodeOptions)

})

.controller('IntroCtrl', function($scope) {
  console.log('halo');

})


;
