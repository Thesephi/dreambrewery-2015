var host = "drever.codeatnite.com/";
var hostUrl = "http://" + host;
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
    $scope.payment = 'cash';
    window.localStorage['payment'] = $scope.payment;
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
          window.localStorage['userStartLatLng'] = JSON.stringify($scope.markerStart.coords);

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
    window.localStorage['userStartLatLng'] = JSON.stringify($scope.markerStart.coords);

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
    window.localStorage['userEndLatLng'] = JSON.stringify($scope.markerEnd.coords);
    $scope.markerStart.options = {
      draggable: false
    }
    $scope.vehicles = [];
    calcRoute();
  };

  //calc route
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
        var totalFare = 22;
        totalDistance = totalDistance / 1000;
        totalTime = totalTime / 60;
        totalFare = totalFare + (totalDistance*1);
        window.localStorage['totalDistance'] = totalDistance;
        window.localStorage['totalTime'] = totalTime;
        window.localStorage['totalFare'] = totalFare;
      }
    })
  }

  $scope.getValuePayment = function(item) {
    window.localStorage['payment'] = item;
  };

  //only in Singapore
  $scope.geocodeOptions = {
    componentRestrictions: {
      //VN, SG
      country : 'SG'
    },
  };

})

.controller('SummaryCtrl', function($scope, Restangular, $state) {
  console.log('SummaryCtrl');
  $scope.userStart = localStorage.getItem("userStart");
  $scope.userStartLatLng = JSON.parse(localStorage.getItem("userStartLatLng"));
  $scope.userEnd = localStorage.getItem("userEnd");
  $scope.userEndLatLng = JSON.parse(localStorage.getItem("userEndLatLng"));
  $scope.totalDistance = localStorage.getItem("totalDistance");
  $scope.totalTime = localStorage.getItem("totalTime");
  $scope.totalFare = localStorage.getItem("totalFare");
  $scope.payment = localStorage.getItem("payment");
  $scope.user = JSON.parse(localStorage.getItem("dre_user"));
  console.log($scope.user);

  $scope.getValuePayment = function(item) {
    window.localStorage['payment'] = item;
  };
  // create booking here with date
  $scope.createBooking = function(){
    console.log('create');
    Restangular
      .all("api/booking/create")
      .post({
        userID: $scope.user.id,
        start_latitude: $scope.userStartLatLng.latitude,
        start_longitude: $scope.userStartLatLng.longitude,
        end_latitude: $scope.userEndLatLng.latitude,
        end_longitude: $scope.userEndLatLng.longitude,
        totalDistance: $scope.totalDistance,
        totalTime: $scope.totalTime,
        totalFare: $scope.totalFare,
        isAllNight: false,
        userStart: $scope.userStart,
        userEnd: $scope.userEnd,

      })
      .then(
        function(response) {
          console.log(response);
          if(response.generated_keys){
            window.localStorage['bookingID'] = response.generated_keys[0];
            $state.go('app.waiting');
          }
        },
        function(error) {
          console.log(error);
        }
      );
  }

  window.localStorage['dateStart'] = Date.now();
})

.controller('WaitingCtrl', function($scope, Restangular, $interval, $ionicLoading, $state) {
  console.log('WaitingCtrl');
  $scope.totalFare = localStorage.getItem("totalFare");
  $scope.payment = localStorage.getItem("payment");
  $scope.bookingID = window.localStorage['bookingID'];
  $scope.showInfo = false;
  $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br> Waiting for valet' });
  console.log($scope.bookingID);
  //get info valet & save it for next state

  function checkStatusBooking() {
    Restangular
      .all("api/booking/get?bookingID="+ $scope.bookingID + "&r=" + Math.random() )
      .get('')
      .then(
        function(response) {
          console.log(response);
          if(!response.state || response.state == 0){
            // no valet app
          } else if(response.state == -1){
            //cancel
          } else if(response.state == 1){
            // valet receive booking, show infos
            $scope.showInfo = true;
            $ionicLoading.hide();
            $scope.driver = response.driver;
            window.localStorage['driver'] = JSON.stringify($scope.driver);
            // $response.state.go('app.');
          } else if(response.state == 2){
            // completed
            $ionicLoading.hide();
            $interval.cancel(checkStatusInterval);
            $state.go('app.rating');
          }
        },
        function(error) {
          console.log(error);
        }
      );
  }
  checkStatusInterval =  $interval(checkStatusBooking, 5000);

})

.controller('RatingCtrl', function($scope, $http, $ionicPopup) {
  console.log('RatingCtrl');
  $scope.showRatingBox = true;
  $scope.totalFare = localStorage.getItem("totalFare");
  $scope.dateStart = localStorage.getItem("dateStart");
  $scope.driver = JSON.parse(localStorage.getItem("driver"));

  setupGimmie($scope, $http, $ionicPopup);

  var selectedRating;
  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star',
    iconOnColor: 'rgb(51, 153, 255)',
    iconOffColor:  'rgb(52, 63, 81)',
    rating:  2,
    minRating:1,
    callback: function(rating) {
      console.log(rating);
    }
  };

})

.controller('IntroCtrl', function($scope) {
  console.log('halo');
  $scope.$on("$ionicView.loaded", function() {
    // set the logged in user
    // so we don't have to deal with the boring sign-up, sign-in stuff
    var user = {
      email: "Joelle@gideon.biz",
      id: "b26c346d-36fd-4649-aaca-00fd8b3867e7",
      name: "Lennie Lueilwitz III",
      avatar: "http://drever.codeatnite.com/uploads/user0.jpg"
    }
    localStorage.setItem('dre_user', JSON.stringify(user));
  });

})

.controller('GimmieTestCtrl', function($scope, $http, $ionicPopup) {
  console.log('Gimmie Gimmie');
  setupGimmie($scope, $http, $ionicPopup);
})

;

function setupGimmie($scope, $http, $ionicPopup) {
  var user = JSON.parse(localStorage.getItem('dre_user'));
  var userID = user.id || "b26c346d-36fd-4649-aaca-00fd8b3867e7";

  $scope.$on("$ionicView.loaded", function() {
    var d = window.document;
    _gimmie = {
        "endpoint": "http://drever.codeatnite.com/api/gimmie?userID="+userID,
        "key": "109dd42f1c3caf0d527df115d5f2",
        "user": {
          "name": user.name,
          "realname": user.name,
          "email": user.email,
          "avatar": user.avatar
        },
        "events": {
          // This function will get call when Widget is loaded.
          "widgetLoad": function() {

          },
          // This function will get call when user finished rating a valet
          "rate_valet": function() {
            console.log('Congratulations. You got a reward for being generous in giving the Valet a rating!');
          }
        },
    };

    var js, id = "gimmie-widget",
        ref = d.getElementsByTagName("script")[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement("script");
    js.id = id;
    js.async = true;
    js.src = "//api.gimmieworld.com/cdn/gimmie-widget2.all.js";
    ref.parentNode.insertBefore(js, ref);

  });

  $scope.showGimmie = function(data) {

    var title, template;
    if(data.success) {
      title = "Congratulations";
      template = "<div style='text-align: center;'><img style='width:100%; height:auto;' src='http://drever.codeatnite.com/uploads/lucha.jpg' />" + data.payload.actions[0].message + "<br />Total pts: " + data.payload.user.awarded_points + "<br /><br />Also you got 1 free beer from our Lucha & Gimmie.io partners :)</div>";
    } else {
      title = "Hang on...";
      template = "You earned some points just now, but the system failed to acknowledge that. We're sorry!";
    }

    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });
    alertPopup.then(function(res) {
      console.log('Thank you!');
    });

 };

  $scope.afterValetRated = function() {
    var eventName = "rate_valet";
    $http({
      url: "http://drever.codeatnite.com/api/gimmie/trigger?eventName="+eventName+"&userID="+userID
    }).then(function(result) {
      console.log(result.data.response);
      $scope.showRatingBox = false;
      $scope.showGimmie({
        success: true,
        payload: result.data.response
      });
    }, function(err) {
      console.log(err);
      $scope.showGimmie({
        success: false,
        payload: err
      });
    });
  }

  $scope.afterLocoPicked = function() {
    var eventName = "pick_loco";
    $http({
      url: "http://drever.codeatnite.com/api/gimmie/trigger?eventName="+eventName+"&userID="+userID
    }).then(function(result) {
      console.log(result.data.response);
      $scope.showGimmie({
        success: true,
        payload: result.data.response
      });
    }, function(err) {
      console.log(err);
      $scope.showGimmie({
        success: false,
        payload: err
      });
    });
  }
}
