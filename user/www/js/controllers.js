angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  window.localStorage.setItem('userID', 'thanhtung2806@gmail.com');
})

.controller('SearchCtrl', function($scope, uiGmapGoogleMapApi, $timeout, $filter) {
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
    uiGmapGoogleMapApi.then(function(maps) {
      uiGmapGoogleMap = maps;
      directionsDisplay = new maps.DirectionsRenderer({ polylineOptions: {strokeColor:"#969696", strokeWeight:5}, suppressMarkers:true });
      $timeout(function(){
        directionsDisplay.setMap($scope.map.control.getGMap());
      }, 100);
    });
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
        }
      }
    }
    // console.log($scope.markerStart)
  }

  //find name base on lat, lng
  var findNameLocation = function(lat,lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.startEnd.start = results[0];
        window.localStorage['userStart'] = results[0].formatted_address;
      } else {
        console.log(status);
      }
    });
  }

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
     window.localStorage['userStart'] = $scope.startEnd.start.formatted_address;

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
    window.localStorage['userEnd'] = $scope.startEnd.end.formatted_address;
    $scope.markerStart.options = {
      draggable: false
    }
    $scope.vehicles = [];
    //calc route
    calcRoute();
  };

  var calcRoute = function(){
    maps = uiGmapGoogleMap;
    directionsService = new maps.DirectionsService();
    var start = $scope.markerStart.latlng;
    var end = $scope.markerEnd.latlng;
    var request = {
      origin: start,
      destination: end,
      optimizeWaypoints: true,
      travelMode: maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      console.log(response);
      if (status == maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var totalDistance = response.routes[0].legs[0].distance.value;
        var totalTime = response.routes[0].legs[0].duration.value;
        var totalFare = 3.5;
        totalDistance = totalDistance / 1000;
        totalTime = totalTime / 60;
        totalFare = totalFare + (totalDistance*0.5);
        window.localStorage['totalDistance'] = totalDistance;
        window.localStorage['totalTime'] = totalTime;
        window.localStorage['totalFare'] = totalFare;
      }
    })
  }

  //only in Singapore
  $scope.geocodeOptions = {
    componentRestrictions: {
      //VN, SG
      country : 'SG'
    },
  };

})

.controller('SummaryCtrl', function($scope) {
  console.log('SummaryCtrl');
  $scope.userStart = localStorage.getItem("userStart");
  $scope.userEnd = localStorage.getItem("userEnd");
  $scope.totalDistance = localStorage.getItem("totalDistance");
  $scope.totalTime = localStorage.getItem("totalTime");
  $scope.totalFare = localStorage.getItem("totalFare");

})

.controller('IntroCtrl', function($scope) {
  console.log('halo');

})


;
