// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ion-google-place', 'uiGmapgoogle-maps', 'ionic-ratings', 'restangular'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, RestangularProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.summary', {
    url: '/summary',
    views: {
      'menuContent': {
        templateUrl: 'templates/summary.html',
        controller: 'SummaryCtrl'
      }
    }
  })

  .state('app.waiting', {
    url: '/waiting',
    views: {
      'menuContent': {
        templateUrl: 'templates/waiting.html',
        controller: 'WaitingCtrl'
      }
    }
  })

  .state('app.rating', {
    url: '/rating',
    views: {
      'menuContent': {
        templateUrl: 'templates/rating.html',
        controller: 'RatingCtrl'
      }
    }
  })

  .state('test-gimmie', {
    url: '/test/gimmie',
    templateUrl: 'templates/test/gimmie.html',
    controller: 'GimmieTestCtrl'
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro');
  $ionicConfigProvider.navBar.alignTitle('center');
  RestangularProvider.setBaseUrl(hostUrl);
  RestangularProvider.setDefaultHeaders({
    'Access-Control-Allow-Origin': host,
    'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  });
})
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBerkRSY_8JrdijfYF5wFcGUm3d-TUpibQ',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places'
    });
})
;
