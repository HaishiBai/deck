'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.loadBalancers.configure.azure.loadBalancerZoneSelector.directive', [
])
  .directive('azureLoadBalancerAvailabilityZoneSelector', function() {
    return {
      restrict: 'E',
      scope: {
        availabilityZones: '=',
        region: '=',
        model: '=',
        usePreferredZones: '=',
        provider: '='
      },
      templateUrl: require('./azureLoadBalancerAvailabilityZoneSelector.directive.html'),
      controller: function($scope, $q, accountService) {
        $scope.model.usePreferredZones = angular.isDefined($scope.model.usePreferredZones) ? $scope.model.usePreferredZones : true;

        function setDefaultZones() {

          var defaultCredentials = $scope.model.credentials;
          var defaultRegion = $scope.region;

          accountService.getAvailabilityZonesForAccountAndRegion($scope.provider, defaultCredentials, defaultRegion).then(
            function(preferredZones) {
              $scope.model.regionZones = angular.copy(preferredZones);
            }
          );
        }

        setDefaultZones();

        $scope.$watch('region',  setDefaultZones);
        $scope.$watch('model.credentials', setDefaultZones);

        $scope.autoBalancingOptions = [
          { label: 'Enabled', value: true},
          { label: 'Manual', value: false}
        ];

        $scope.reset = function(preferred) {
          $scope.model.usePreferredZones = preferred;
          if(preferred) {
            setDefaultZones();
          }
        };

      },
    };
}).name;
