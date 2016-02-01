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

        $scope.allRows = [$scope.firstRow, $scope.secondRow, $scope.thirdRow, $scope.fourthRow, $scope.fifthRow];
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

      $scope.closeVenueModal = function () {
        $scope.modal.hide();
      };

    }
  };

})
