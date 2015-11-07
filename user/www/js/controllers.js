angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('SearchCtrl', function($scope, uiGmapGoogleMapApi) {
  var uiGmapGoogleMap ='';
  var directionsDisplay ='';

  init();
  function init(){
    $scope.startEnd = {};
    $scope.mapOptions = {scrollwheel: false, disableDefaultUI: true};
    getGeoLocation();
    initValet();
    initMap();
  };

  function initMap(){
    $scope.map = {
      center: { latitude: 1.301905, longitude: 103.851645 },
      options: { minZoom: 3, maxZoom: 16 },
      zoom: 18,
      control : {}
    };
  }

  function initValet(){
    $scope.vehicles = [
      {
        id: 'valet1',
        last_known_location: { latitude: 1.303614, longitude: 103.851344}
      },{
        id: 'valet2', last_known_location: { latitude: 1.302477, longitude: 103.850558}
      },{
        id: 'valet3', last_known_location: { latitude: 1.301690, longitude: 103.851269}
      }
    ];
    console.log($scope.vehicles)
  }

  function getGeoLocation(){
    var lat = 1.301905;
    var lng = 103.851645;

    $scope.markerEnd = {
      id: 'end'
    };

    $scope.markerStart = {
      id: 'start',
      coords: {latitude: lat,longitude: lng},
      coord: {lat: lat, lng: lng},
      latlng: lat + ',' + lng,
      options: {
        draggable: true
      },
      events: {
        dragend: function (marker, eventName, args) {
          console.log($scope.markerStart);
          lat = $scope.markerStart.coords.latitude;
          lng = $scope.markerStart.coords.longitude;
          $scope.map.center = { latitude: lat, longitude: lng }
          console.log(lat, lng);
          //find name location
        }
      }
    }
    console.log($scope.markerStart)

  }
  //init



  uiGmapGoogleMapApi.then(function(maps) {
    console.log('a');
  });


  $scope.doMapStart = function(item) {
    console.log($scope.startEnd);
    lat = item.geometry.location.lat();
    lng = item.geometry.location.lng();
    $scope.map.center = { latitude: lat, longitude: lng }
    $scope.map.zoom = 18;
    $scope.markerStart.coords = { latitude: lat, longitude: lng }
    $scope.markerStart.latlng = lat+','+lng ;
    $scope.markerStart.coord =  { lat: lat, lng: lng }

  };

  $scope.doMapEnd = function(item) {
    lat = item.geometry.location.lat();
    lng = item.geometry.location.lng();
    $scope.markerEnd = {
      id: 'end',
      coords: { latitude: lat, longitude: lng },
      latlng: lat+','+lng,
      coord: { lat: lat, lng: lng }
    }
    $scope.markerStart.options = {
      draggable: false
    }


  };

  //only in Singapore
  $scope.geocodeOptions = {
    componentRestrictions: {
      //VN, SG
      country : 'SG'
    },
  };

})

.controller('IntroCtrl', function($scope) {
  console.log('halo');

})


;
