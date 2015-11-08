var host = "drever.codeatnite.com/";
var hostUrl = "http://" + host;
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  console.log('AppCtrl');
})

.controller('SearchCtrl', function($scope, Restangular, $interval, $ionicLoading) {
  console.log('SearchCtrl');
  $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br> Search booking ' });
  $scope.showInfo = false;
  var lat = 1.3068147;
  var lng = 103.8099239;
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
    function checkStatusBooking() {
      Restangular
      .all("api/booking/search?lat="+ lat +"&lng=" + lng + "&r=" + Math.random() )
      .get('')
      .then(
        function(response) {
          console.log(response);
          $scope.booking = response[0];
          console.log($scope.booking);
          $scope.bookingID = response[0].id
          $interval.cancel(checkStatusInterval);
          getBooking();
        },
        function(error) {
          console.log(error);
        }
      );
    }
    checkStatusInterval =  $interval(checkStatusBooking, 5000);
    function getBooking() {
      Restangular
      .all("api/booking/get?bookingID="+ $scope.bookingID + "&r=" + Math.random() )
      .get('')
      .then(
        function(response) {
          console.log(response);
          $ionicLoading.hide();
          $scope.showInfo = true;
          $scope.bookingInfo = response;
          if(!$scope.bookingInfo.payment){
            $scope.bookingInfo.payment = "cash";
          }
        },
        function(error) {
          console.log(error);
        }
      );
    }


    $scope.showComplete = false;
    $scope.complete = function() {
      console.log('complete');
      Restangular
      .all("api/booking/complete?bookingID="+ $scope.bookingID + "&r=" + Math.random() )
      .get('')
      .then(
        function(response) {
          console.log(response);

        },
        function(error) {
          console.log(error);
        }
      );
    }


    $scope.accept = function(){
      console.log('accept');
      Restangular
      .all("api/booking/accept?bookingID="+ $scope.bookingID + "&r=" + Math.random() )
      .get('')
      .then(
        function(response) {
          console.log(response);
          $scope.showComplete = true;
        },
        function(error) {
          console.log(error);
        }
      );
    }

  });
});
