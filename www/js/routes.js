/**
 * Created by bjersey on 12/6/15.
 */

angular.module('hype_client').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('heatMap', {
      cache: false,
      url: '/heatmap',
      templateUrl: 'templates/heatmap.html',
      controller: 'HeatMapController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController'
    });

  $urlRouterProvider.otherwise('/heatmap');
});
