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

        $scope.bang = _.slice($scope.region.venues, 0, 35);

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

      var convertRgbtoDec = function (r, g, b) {
        return parseInt(r.toString(16) + g.toString(16) + b.toString(16), 16);
      };

      var convertDectoRgb = function(dec) {
        var hexValue = dec.toString(16);

        hexValue = _.padStart(hexValue, 6, '0');

        var r, g, b;
        r = parseInt(hexValue[0] + hexValue[1], 16);
        g = parseInt(hexValue[2] + hexValue[3], 16);
        b = parseInt(hexValue[4] + hexValue[5], 16);

        return [r, g, b];
      };

      $scope.calcHeatMapColor = function calcHeatMapColor(venue) {


        var aH = $scope.startColor[0], aS = $scope.startColor[1], aL = $scope.startColor[2];
        var bH = $scope.endColor[0], bS = $scope.endColor[1], bL = $scope.endColor[2];
        //var aR = $scope.startColor[0], aG = $scope.startColor[1], aB = $scope.startColor[2],
        //    bR = $scope.endColor[0], bG = $scope.endColor[1], bB = $scope.endColor[2];

        //var aDec = convertRgbtoDec(aR, aG, aB);
        //var bDec = convertRgbtoDec(bR, bG, bB);


        //var finalDec = _.floor((bDec - aDec) * venue.normalizedHeatScore + aDec);

        //var r, g, b;
        //
        //var foo = convertDectoRgb(finalDec);

        //r = foo[0];
        //g = foo[1];
        //b = foo[2];

        //console.log(r, g, b);

        var h = aH;
        //var s = aS - (venue.normalizedHeatScore * 70);
        var s = (bS - aS) * (venue.normalizedHeatScore * 10) + aS;

        s = _.inRange(s, aS, bS) ? s : aS;
        //var l = aL + (venue.normalizedHeatScore * 100);
        var l = (aL - bL) * (venue.normalizedHeatScore * 3) + bL;

        l = _.inRange(l, aL, bL) ? l : aL;



        //var red   = _.floor((bR - aR) * venue.normalizedHeatScore + aR);
        //var green = _.floor((bG - aG) * venue.normalizedHeatScore + aG);
        //var blue  = _.floor((bB - aB) * venue.normalizedHeatScore + aB);

        var heatColor = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

        return !!venue.normalizedHeatScore ? {background: heatColor} : null;
      };

      $scope.closeVenueModal = function () {
        $scope.modal.hide();
      };

    }
  };

})
