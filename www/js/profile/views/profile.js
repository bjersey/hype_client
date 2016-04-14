angular.module('hype_client').controller('ProfileController', function ($scope, $state, $openFB) {

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
