'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.pipelines.stage.checkPreconditions', [
  require('../stage.module.js'),
  require('../core/stage.core.module.js'),
  require('./checkPreconditionsExecutionDetails.controller.js'),
  require('./modal/editPrecondition.controller.modal.js'),
  require('./checkPreconditionsStage.js'),
]).name;
