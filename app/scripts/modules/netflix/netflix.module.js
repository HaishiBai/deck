'use strict';

let angular = require('angular');

// load all templates into the $templateCache
var templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular
  .module('spinnaker.netflix', [
    require('./whatsNew/whatsNew.directive.js'),
    require('./blesk/blesk.module.js'),
    require('./fastProperties/fastProperties.module.js'),
    require('./alert/alertHandler.js'),
    require('./feedback/feedback.module.js'),
    require('./instance/aws/netflixAwsInstanceDetails.controller.js'),
    require('./pipeline/stage/canary/canaryStage.module.js'),
    require('./canary'),
    require('./templateOverride/templateOverrides.module.js'),
    require('./migrator/pipeline/pipeline.migrator.directive.js'),
  ])
  .run(function(cloudProviderRegistry) {
    cloudProviderRegistry.overrideValue(
      'aws',
      'instance.detailsTemplateUrl',
      require('./instance/aws/instanceDetails.html')
    );
    cloudProviderRegistry.overrideValue(
      'aws',
      'instance.detailsController',
      'netflixAwsInstanceDetailsCtrl'
    );
  }).name;
