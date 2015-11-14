'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.azure.securityGroup.transformer', [
  require('../vpc/vpc.read.service.js'),
])
  .factory('azureSecurityGroupTransformer', function (vpcAzureReader) {

    function normalizeSecurityGroup(securityGroup) {
      return vpcAzureReader.listAzureVpcs().then(addVpcNameToSecurityGroup(securityGroup));
    }

    function addVpcNameToSecurityGroup(securityGroup) {
      return function(vpcs) {
        var matches = vpcs.filter(function(test) {
          return test.id === securityGroup.vpcId;
        });
        securityGroup.vpcName = matches.length ? matches[0].name : '';
      };
    }

    return {
      normalizeSecurityGroup: normalizeSecurityGroup,
    };
  }).name;