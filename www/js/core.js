angular.module('hype_client', ['ionic', 'ngOpenFB', 'ngCordova', 'ngCordovaBeacon'])

  .run(function ($ionicPlatform, $openFB) {
    $ionicPlatform.ready(function () {

      screen.lockOrientation('portrait');

      $openFB.init({appId: '309453912512212'});

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      $cordovaStatusbar.hide();
    });
  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
