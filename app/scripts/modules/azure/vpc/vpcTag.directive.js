'use strict';

let angular = require('angular');

module.exports =  angular.module('spinnaker.azure.vpc.tag.directive', [
  require('./vpc.read.service.js'),
  require('../../core/utils/lodash.js'),
])
  .directive('vpcAzureTag', function(vpcAzureReader, _) {
    return {
      restrict: 'E',
      scope: {
        vpcId: '=',
      },
      template: '<span class="vpc-tag">{{vpcLabel}}</span>',
      link: function(scope) {
        function applyLabel() {
          if (!scope.vpcId) {
            scope.vpcLabel = 'None (EC2 Classic)';
          } else {
            vpcAzureReader.getAzureVpcName(scope.vpcId).then(function (name) {
              scope.vpcLabel = '(' + scope.vpcId + ')';

              if (name) {
                scope.vpcLabel = name + ' ' + scope.vpcLabel;
              }
            });
          }
        }

        scope.$watch('vpcId', applyLabel, true);
      }
    };
  })
  .name;
