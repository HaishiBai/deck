'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.serverGroup.configure.azure.loadBalancer.directive', [])
  .directive('azureServerGroupLoadBalancersSelector', function(azureServerGroupConfigurationService, infrastructureCaches) {
    return {
      restrict: 'E',
      scope: {
        command: '=',
      },
      templateUrl: require('./serverGroupLoadBalancersSelector.directive.html'),
      link: function(scope) {

        scope.getLoadBalancerRefreshTime = function() {
          return infrastructureCaches.loadBalancers.getStats().ageMax;
        };

        scope.refreshLoadBalancers = function() {
          scope.refreshing = true;
          azureServerGroupConfigurationService.refreshLoadBalancers(scope.command).then(function() {
            scope.refreshing = false;
          });
        };
      }
    };
  }).name;
