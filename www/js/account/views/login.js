angular.module('hype_client').controller('LoginController', function ($scope, $state, $http, $openFB, $ionicModal) {

  $scope.fbLogin = function () {
    $openFB.login({scope: 'email,public_profile,user_location,user_likes'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $http.post("https://hype-server.herokuapp.com/core/login/fb/", {fb_access_token: response.authResponse.token}).then(function () {
            // $http.post("http://localhost:8000/core/login/fb/", {fb_access_token: response.authResponse.token}).then(function () {
            $state.go('heatMap');
          }, function () {
            console.log('token did not verify');
          });
        }
        else {
          alert('Facebook login failed');
        }
      });
  };

  $scope.goToLogin = function () {
    $scope.modal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.signup = function (venueId) {
    $scope.modal.show();
  };

});
