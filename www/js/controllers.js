/**
 * Created by bjersey on 12/6/15.
 */
angular.module('hype_client').controller('HeatMapController', function ($scope, $state, $http, $openFB) {

    //window.screen.lockOrientation('portrait');

    $scope.models = {};

    var updateData = function () {
      $openFB.isLoggedIn().then(function (loginStatus) {

        $http.get("https://hype-server.herokuapp.com/venue/venueregion/all/").then(function (response) {
          $scope.models.regions = response.data;

          $scope.models.regionGroup = [_.slice($scope.models.regions, 0, 6), _.slice($scope.models.regions, 6, 11),
                                       _.slice($scope.models.regions, 11, 16), _.slice($scope.models.regions, 16, 21)];

          _.forEach($scope.models.regions, function (region) {
            region.isOpen = false;
          });

          $scope.models.activeRegionNumber = 0;

          $scope.models.activeRegionGroup = $scope.models.regionGroup[$scope.models.activeRegionNumber];

        }, function (response) {
          console.log('failed to retrieve info for dashboard');
        });

        $http.get("https://hype-server.herokuapp.com/venue/venue/all/").then(function (response) {

          $scope.models.venues = response.data;

          _.forEach($scope.models.regions, function (region) {
            region.venues = _.slice(_.filter($scope.models.venues, {venue_region: region.id}), 0, 50);
          });

        }, function (response) {
          console.log('failed to retrieve info for dashboard');
        });

      }, function (err) {
        console.log(err);
        console.log("first time?");
        $state.go('login');
      });

    };
    updateData();

    $scope.swipeRegionsLeft = function swipeRegionsLeft() {
      if (!_.isEmpty($scope.models.regionGroup[$scope.models.activeRegionNumber + 1]) && !$scope.disableRegionAnimation) {
        $scope.models.activeRegionNumber = $scope.models.activeRegionNumber + 1;
        $scope.models.activeRegionGroup = $scope.models.regionGroup[$scope.models.activeRegionNumber];
      }
      console.log('swiping left');
    };

    $scope.swipeRegionsRight = function swipeRegionsRight() {
      if (!_.isEmpty($scope.models.regionGroup[$scope.models.activeRegionNumber - 1]) && !$scope.disableRegionAnimation) {
        $scope.models.activeRegionNumber = $scope.models.activeRegionNumber - 1;
        $scope.models.activeRegionGroup = $scope.models.regionGroup[$scope.models.activeRegionNumber];
      }
      console.log('swiping right');
    };

    $scope.calcRegionPosition = function calcRegionPosition(idx) {

      var foo = (idx % 3) * 34;
      var bar = _.floor(idx / 3) * 45;

      var top = bar + '%';
      var left = foo + '%';

      return {
        top: top,
        left: left
      }
    };

    $scope.isRegionOpen = function isRegionOpen(venue) {
      return venue.isOpen;
    };

    $scope.disableRegionAnimation = false;

    $scope.toggleVenueRegion = function openVenueRegion(region) {

      if (!$scope.disableRegionAnimation) {
        region.isOpen = !region.isOpen;
        $scope.disableRegionAnimation = true;
      }

    };

    $scope.goHeatMap = function () {
      updateData();

      _.forEach($scope.models.regions, function (region) {
        region.isOpen = false;
      });
      $scope.disableRegionAnimation = false;
    }
    ;

    $scope.goProfile = function () {
      $openFB.isLoggedIn().then(function (loginStatus) {
        $state.go('profile');
      }, function (err) {
        console.log(err);
        $state.go('login');
      });

    };

  })
  .controller('LoginController', function ($scope, $state, $http, $openFB) {
    $scope.fbLogin = function () {
      $openFB.login({scope: 'email,public_profile,user_location,user_likes'}).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            $http.post("https://hype-server.herokuapp.com/core/login/", {fb_access_token: response.authResponse.token}).then(function () {
              //$http.post("http://localhost:8000/core/login/", {fb_access_token: response.authResponse.token}).then(function () {
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
