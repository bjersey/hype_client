/**
 * Created by bjersey on 12/6/15.
 */
angular.module('hype_client').controller('HeatMapController', function ($rootScope, $scope, $timeout, $ionicPlatform, $state, $http, $openFB, $cordovaBeacon) {

    $scope.beacons = {};

    $rootScope.$on("$cordovaBeacon:didEnterRegion", function (event, pluginResult) {
      var uniqueBeaconKey;

      _.forEach(pluginResult.beacons, function (beacon){
        uniqueBeaconKey = beacon.uuid + ":" + beacon.major + ":" + beacon.minor;
        $scope.beacons[uniqueBeaconKey] = beacon;
      });

      $scope.$apply();
    });

    $rootScope.$on("$cordovaBeacon:didExitRegion", function (event, pluginResult) {
      var uniqueBeaconKey;

      _.forEach(pluginResult.beacons, function (beacon){
        uniqueBeaconKey = beacon.uuid + ":" + beacon.major + ":" + beacon.minor;
        delete $scope.beacons[uniqueBeaconKey];
      });

      $scope.$apply();
    });

    $ionicPlatform.ready(function () {
      $timeout(function () {
        screen.lockOrientation('landscape');
      }, 50);
      $timeout(function () {
        screen.lockOrientation('portrait');
      }, 50);
      $timeout(function () {
        screen.lockOrientation('landscapelock orie');
      }, 50);

      //$cordovaBeacon.requestWhenInUseAuthorization();
      //
      //$cordovaBeacon.startMonitoringForRegion($cordovaBeacon.createBeaconRegion("canvas", "f7826da6-4fa2-4e98-8024-bc5b71e0893e", "24103", "33672"));

    });

    $scope.isInVenueRange = function (venue) {
      return venue.name === "Canvas" && !!$scope.beacons["f7826da6-4fa2-4e98-8024-bc5b71e0893e:24103:33672"]
    };

    $scope.models = {};

    var updateData = function () {
      $openFB.isLoggedIn().then(function (loginStatus) {

        $http.get("https://hype-server.herokuapp.com/venue/venueregion/all/").then(function (response) {
          $scope.models.regions = response.data;

          var chinatown = $scope.models.regions.pop();
          $scope.models.regions.unshift(chinatown);

          var kStreet = _.remove($scope.models.regions, function (r) {
            return r.name === 'K Street';
          });

          $scope.models.regions.push(kStreet[0]);

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

            $scope.sortVenues(region, 'score');

            _.forEach(['fb_likes', 'followers_count', 'score'], function (metric) {
              $scope.rankVenues(region, metric);
            })

            //var allVenues = _.filter($scope.models.venues, {venue_region: region.id});
            //
            //allVenues = _.sortBy(allVenues, function (v) {
            //  return !!v.score ? v.score : 0;
            //});
            //
            //allVenues = _.reverse(allVenues);
            //
            //var topVenues = _.slice(allVenues, 0, 50);
            //
            //_.forEach(topVenues, function (venue) {
            //  venue.normalizedHeatScore =  !!venue.score ? ( (venue.score - minScore) / (maxScore - minScore) ) : null;
            //});
            //
            //region.venues = topVenues;

          });

        }, function (response) {
          console.log('failed to retrieve info for dashboard');
        });

        $http.get("https://hype-server.herokuapp.com/venue/ticker/").then(function (response) {

          $scope.models.tickerText = response.data.text;

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

    $scope.rankVenues = function rankVenues(region, metric) {
      var allVenues = _.sortBy($scope.models.venues, function (v) {
        return !!v[metric]
          ? v[metric]
          : 0;
      });

      allVenues = _.reverse(allVenues);

      allVenues = _.filter(allVenues, function(venue) {
        return !_.isNull(venue[metric]);
      });

      _.forEach(allVenues, function (venue) {
        venue.ranking = _.merge(venue.ranking, {});
        venue.ranking[metric] = _.merge(venue.ranking[metric], {});
        venue.ranking[metric].rank = _.indexOf(allVenues, venue) + 1;
      })
    };

    $scope.sortVenues = function (region, metric) {
      var venuesWithScores = _.filter($scope.models.venues, function (v) {
        return !!v[metric]
      });

      var allVenues = _.filter($scope.models.venues, {venue_region: region.id});

      allVenues = _.sortBy(allVenues, function (v) {
        return !!v[metric]
          ? v[metric]
          : 0;
      });

      allVenues = _.reverse(allVenues);

      var topVenues = _.slice(allVenues, 0, 50);

      var venuesWithScoresSorted = _.sortBy(venuesWithScores, metric);

      var minScore = venuesWithScoresSorted[6][metric];

      venuesWithScoresSorted = _.reverse(venuesWithScoresSorted);

      var maxScore = venuesWithScoresSorted[6][metric];

      //var maxScore = _.maxBy(venuesWithScores, function(v) {return v[metric]})[metric];
      //var minScore = _.minBy(venuesWithScores, function(v) {return v[metric]})[metric];

      _.forEach(topVenues, function (venue) {
        temp = !!venue[metric]
          ? ( (venue[metric] - minScore) / (maxScore - minScore) )
          : null;
        if (temp > 1) {
          venue.normalizedHeatScore = 1;
        }
        else if (temp < 0) {
          venue.normalizedHeatScore = 0;
        }
        else {
          venue.normalizedHeatScore = temp;
        }
      });

      region.venues = topVenues;
    };

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

      var foo = (idx % 3) * 33.3333;
      var bar = _.floor(idx / 3) * 50;

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
        $scope.socialMenuActive = false;
        $scope.disableRegionAnimation = true;
      }

    };

    $scope.socialMenuActive = false;

    $scope.toggleMenuActive = function () {
      $scope.socialMenuActive = !$scope.socialMenuActive;
    };

    var aR = 224, aG = 131, aB = 131,
      bR = 239, bG = 2, bB = 2;

    //$scope.startColor = [224, 131, 131];
    //$scope.endColor = [239, 2, 2];

    $scope.endColor = [0, 60, 69.6]; //0 60 69.6
    //$scope.endColor = [239, 2, 2]; //0 98.3 47.3
    $scope.startColor = [0, 98.3, 47.3]; //0 98.3 47.3

    $scope.sortBySocialPlatform = function (platform) {
      $scope.socialMenuActive = false;
      console.log(platform);
      var metric;

      if (platform === 'facebook') {
        metric = 'fb_likes';
        //$scope.startColor = [59, 89, 152]; // 221, 44.1, 41.4
        $scope.startColor = [221, 44.1, 41.4]; // 221, 44.1, 41.4
        $scope.endColor = [221, 31.1, 64.7];// 221, 31.1, 64.7
        //$scope.endColor = [137, 155, 193];// 221, 31.1, 64.7
      }
      else if (platform === 'twitter') {
        metric = 'followers_count';
        //$scope.startColor = [224, 131, 131]; //0 60 69.6
        $scope.startColor = [0, 98.3, 47.3]; //0 60 69.6
        //$scope.endColor = [239, 2, 2]; // 0 98.3 47.3
        $scope.endColor = [0, 60, 69.6];
      }
      else if (platform === 'instagram') {
        metric = 'score';
        //$scope.startColor = [224, 131, 131]; //0 60 69.6
        //$scope.endColor = [239, 2, 2];
        $scope.startColor = [0, 98.3, 47.3]; //0 60 69.6
        $scope.endColor = [0, 60, 69.6]; //0 98.3 47.3
      }
      else {
        metric = 'score';
        //$scope.startColor = [224, 131, 131]; //0 60 69.6
        $scope.startColor = [0, 60, 69.6]; //0 60 69.6
        //$scope.endColor = [239, 2, 2]; //0 98.3 47.3
        $scope.endColor = [0, 98.3, 47.3]; //0 98.3 47.3
      }

      _.forEach($scope.models.regions, function (region) {

        $scope.sortVenues(region, metric);

      });
    };

    $scope.goHeatMap = function () {
      //updateData();

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
  .controller('LoginController', function ($scope, $state, $http, $openFB, $ionicModal) {
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
