angular.module('hype_client').directive('venueRegion', function venueRegion() {
  'use strict';

  return {
    templateUrl: 'js/components/venue_region/venue_region.html',
    scope: '=',
    controller: function ($scope, $ionicModal) {

      $scope.$watch('region.venues', function () {
        $scope.firstRow = _.slice($scope.region.venues, 0, 5);
        $scope.secondRow = _.slice($scope.region.venues, 5, 10);
        $scope.thirdRow = _.slice($scope.region.venues, 10, 15);
        $scope.fourthRow = _.slice($scope.region.venues, 15, 20);
        $scope.fifthRow = _.slice($scope.region.venues, 20, 25);

        $scope.sixthRow = _.slice($scope.region.venues, 25, 30);
        $scope.seventhRow = _.slice($scope.region.venues, 30, 35);
        $scope.eighthRow = _.slice($scope.region.venues, 35, 40);

        $scope.allRows = [$scope.firstRow, $scope.secondRow, $scope.thirdRow, $scope.fourthRow, $scope.fifthRow, $scope.sixthRow, $scope.seventhRow];
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
        animation: 'slide-in-up'
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

        var aR = 224, aG = 131, aB = 131,
            bR = 239, bG = 2, bB = 2;

        var red   = _.floor((bR - aR) * venue.normalizedHeatScore + aR);      // Evaluated as -255*value + 255.
        var green = _.floor((bG - aG) * venue.normalizedHeatScore + aG);      // Evaluates as 0.
        var blue  = _.floor((bB - aB) * venue.normalizedHeatScore + aB);

        var heatColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

        return !!venue.normalizedHeatScore ? {background: heatColor} : null;
      };

      $scope.closeVenueModal = function () {
        $scope.modal.hide();
      };

    }
  };

})
