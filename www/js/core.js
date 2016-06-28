angular.module('hype_client', ['ionic', 'ngOpenFB', 'ngCordova', 'ngCordovaBeacon'])

  .run(function ($ionicPlatform, $openFB) {
    $ionicPlatform.ready(function () {

      try {
        screen.lockOrientation('portrait');
      } catch (e) {}

      $openFB.init({appId: '309453912512212'});

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      try {
        $cordovaStatusbar.hide();
      } catch (e) {}

    });
  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
