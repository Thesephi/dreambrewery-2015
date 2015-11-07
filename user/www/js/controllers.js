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

  // init center map
  function initMap(){
    $scope.map = {
      center: { latitude: 1.301905, longitude: 103.851645 },
      options: { minZoom: 3, maxZoom: 16 },
      zoom: 18,
      control : {}
    };
  }

  // init valet around
  function initValet(){
    $scope.vehicles = [
      {
        id: 'valet1',
        last_known_location: { latitude: 1.303614, longitude: 103.851344}
      },{
        id: 'valet2', last_known_location: { latitude: 1.302477, longitude: 103.850558}
      },{
        id: 'valet3', last_known_location: { latitude: 1.301805, longitude: 103.851445}
      }
    ];
    console.log($scope.vehicles)
  }

  // get location start point
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
          findNameLocation(lat,lng);
          $scope.map.center = { latitude: lat, longitude: lng }
          console.log(lat, lng);
          //find name location
        }
      }
    }
    console.log($scope.markerStart)
  }

  //find name base on lat, lng
  var findNameLocation = function(lat,lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.startEnd.start = results[0];
      } else {
        console.log(status);
      }
    });
  }

  // check map loading
  uiGmapGoogleMapApi.then(function(maps) {
    console.log('a');
  });

  // search start point
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
  // search end point
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
