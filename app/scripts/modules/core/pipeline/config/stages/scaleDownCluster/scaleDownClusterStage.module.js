'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.pipeline.stage.scaleDownCluster', [
  require('./scaleDownClusterStage.js'),
  require('./scaleDownClusterExecutionDetails.controller.js'),
  require('../stage.module.js'),
  require('../core/stage.core.module.js'),
  require('../../../../account/account.module.js'),
  require('../../../../utils/lodash.js'),
]).name;
