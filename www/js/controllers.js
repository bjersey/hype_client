/**
 * Created by bjersey on 12/6/15.
 */
angular.module('hype_client').controller('HeatMapController', function ($scope, $state, $http, $ionicModal, $openFB) {

    $scope.models = {};

    $openFB.isLoggedIn().then(function (loginStatus) {

      $http.get("http://hype-server.herokuapp.com/venue/all/").then(function (response) {
        $scope.models.venues = _.slice(_.sortByOrder(response.data, function (venue) {
          return venue.score ? venue.score : 0;
        }, ['desc']), 0, 12);

        _.forEach($scope.models.venues, function (venue) {
          $openFB.api({
            path: '/' + venue.facebook_id,
            params: {fields: 'id,name,likes,checkins'}
          }).then(
            function (fb_details) {
              console.log(fb_details);
              venue.fb_likes = fb_details.likes;
              venue.fb_checkins = fb_details.checkins;
            },
            function (error) {
              alert('Facebook error: ' + error.error_description + ' ' + venue.name);
            });
        })

      }, function (response) {
        console.log('failed to retrieve info for dashboard');
      });

    }, function (err) {
      console.log(err);
      $state.go('login');
    });

    $ionicModal.fromTemplateUrl('templates/venue.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openVenueModal = function (venueId) {
      $scope.activeVenue = _.find($scope.models.venues, {id: venueId});
      $scope.modal.show();
    };

    $scope.closeVenueModal = function () {
      $scope.modal.hide();
    };

    $scope.goProfile = function () {
      $openFB.isLoggedIn().then(function (loginStatus) {
        $state.go('profile');
      }, function (err) {
        console.log(err);
        $state.go('login');
      });

    };

  })
  .controller('LoginController', function ($scope, $state, $openFB) {
    $scope.fbLogin = function () {
      $openFB.login({scope: 'email,public_profile'}).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            $state.go('heatMap');
          }
          else {
            alert('Facebook login failed');
          }
        });
    };

  })
  .controller('ProfileController', function ($scope, $state, $openFB) {

    $openFB.api({
      path: '/me',
      params: {fields: 'id,name,email,gender,age_range'}
    }).then(
      function (user) {
        console.log(user);
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });

  });
