angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('SearchCtrl', function($scope, uiGmapGoogleMapApi) {
  //init
  $scope.startEnd = {};
  console.log($scope.startEnd)


  uiGmapGoogleMapApi.then(function(maps) {
    console.log('anh');
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
