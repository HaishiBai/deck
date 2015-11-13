'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.serverGroup.configure.azure.basicSettings', [
  require('../../../../core/modal/wizard/modalWizard.service.js'),
])
  .controller('azureServerGroupBasicSettingsCtrl', function($scope, modalWizardService) {

    $scope.$watch('form.$valid', function(newVal) {
      if (newVal) {
        modalWizardService.getWizard().markClean('location');
      } else {
        modalWizardService.getWizard().markDirty('location');
      }
    });

  }).name;
