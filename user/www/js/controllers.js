angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('SearchCtrl', function($scope, uiGmapGoogleMapApi) {
  uiGmapGoogleMapApi.then(function(maps) {
    console.log('anh');
  });

  $scope.doMapStart = function(item) {
    console.log('a');
    $scope.geocodeOptions = {
        componentRestrictions: {
          //VN, SG
          country : 'SG'
        },
      };

  };

  console.log($scope.geocodeOptions)

})

.controller('IntroCtrl', function($scope) {
  console.log('halo');

})


;
