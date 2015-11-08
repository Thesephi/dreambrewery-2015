angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  console.log('AppCtrl');
})

.controller('SearchCtrl', function($scope) {
  console.log('SearchCtrl');
  $scope.$on("$ionicView.loaded", function() {
    // set the logged in driver
    // so we don't have to deal with the boring sign-up, sign-in stuff
    var driver = {
      email: "Aditya_Franecki@geraldine.us",
      id: "a447d902-d86e-4ef9-b74e-4f6531cf806d",
      name: "Jayda Gibson",
      avatar: "http://drever.codeatnite.com/uploads/driver0.jpg"
    }
    localStorage.setItem('dre_driver', JSON.stringify(driver));
  });
});
