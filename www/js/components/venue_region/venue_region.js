angular.module('hype_client').directive('venueRegion', function venueRegion() {
  'use strict';

  return {
    templateUrl: 'js/components/venue_region/venue_region.html',
    scope: '=',
    controller: function ($scope, $ionicModal) {

      $scope.$watch('region.venues', function () {
        $scope.bang = _.slice($scope.region.venues, 0, 35);
      });

      $scope.calcVenuePosition = function calcVenuePosition(idx) {
        var foo = (idx % 5) * 20;
        var bar = _.floor(idx / 5) * 20;

        var top = bar + '%';
        var left = foo + '%';

        return {
          top: top,
          left: left
        }
      };

      $ionicModal.fromTemplateUrl('templates/venue.html', {
        scope: $scope,
        animation: 'slide-in-left'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.openVenueModal = function (venueId) {
        if (!!$scope.disableRegionAnimation) {
          $scope.activeVenue = _.find($scope.models.venues, {id: venueId});
          $scope.modal.show();
        }
      };

      $scope.calcHeatMapColor = function calcHeatMapColor(venue) {

        var aH = $scope.startColor[0], aS = $scope.startColor[1], aL = $scope.startColor[2];
        var bH = $scope.endColor[0], bS = $scope.endColor[1], bL = $scope.endColor[2];

        var h = aH;
        var s = (bS - aS) * (venue.normalizedHeatScore * 10) + aS;

        s = _.inRange(s, aS, bS) ? s : aS;
        var l = (aL - bL) * (venue.normalizedHeatScore * 3) + bL;

        l = _.inRange(l, aL, bL) ? l : aL;

        var heatColor = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

        return !!venue.normalizedHeatScore ? {background: heatColor} : null;
      };

      $scope.closeVenueModal = function () {
        $scope.modal.hide();
      };

    }
  };

});
