'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.netflix.fastProperties.strategySelector.controller', [
    require('../fastProperty.strategy.provider.js'),
    require('../fastProperty.read.service.js'),
    require('../../../core/config/settings.js'),
    require('../../../core/application/service/applications.read.service.js'),
    require('../../../core/utils/lodash.js'),
    require('../../../core/application/listExtractor/listExtractor.service'),
    require('./fastPropertyWizardManagement.service'),
    require('./fastPropertyScopeBuilder.service'),
  ])
  .controller('FastPropertyUpsertController', function ($scope, $controller, $templateCache, $compile, $modalInstance, $q, _,
                                                        settings, applicationList, applicationReader, fastPropertyReader,
                                                        fastPropertyStrategy, clusters, appName, fastProperty, isEditing,
                                                        appListExtractorService, fastPropertyWizardManagementService,
                                                        fastPropertyScopeBuilderService) {
    let vm = this;

    let objectValuesToList = (object) => {
      return Object.keys(object).map((key) => object[key]);
    };

    let isSkip = (prop) => prop && prop === 'none';

    let prepareScope = (propertyScope) => {
      vm.selectedScope = _(propertyScope)
        .omit(isSkip)
        .transform((result, value, key) => {
          if(key === 'appIdList') {
            result.appId = value.join(',');
          } else {
             result[key] = value;
          }
          result.env = vm.property.env;
        })
        .value();

      return vm.selectedScope;
    };

    vm.transformScope = (fpScope) => {
      return _(fpScope)
        .omit(isSkip)
        .transform( (result, value, key) => {
          if(key === 'appIdList') {
            result.appId = value.join(',');
            result[key] = value;
          } else {
            result[key] = value;
          }
          result.env = vm.property.env;
        })
        .value();

    };

    let getImpact = () => {
      let fastPropertyScope = prepareScope(vm.property.targetScope);
      vm.impactLoading = true;
      fastPropertyReader.fetchImpactCountForScope(fastPropertyScope)
        .then((impact) => vm.impact = impact.count)
        .finally( () => {
          vm.impactLoading = false;
        });
    };


    vm.property = angular.copy(fastProperty);

    vm.property.targetScope = {};
    vm.property.startScope = {};
    vm.property.strategy = {};
    vm.property.env = 'prod';
    vm.property.constraints = 'none';

    vm.chosenApps = {};

    vm.scopeLists = {
      application: [],
      region: [],
      stack: [],
      asg:[],
      cluster: [],
      zone:[],
      instance: [],
    };

    vm.startLists = {
      application: [],
      region: [],
      stack: [],
      asg:[],
      cluster: [],
      zone:[],
      instance: [],
    };

    vm.applicationList = [];

    vm.isEditing = isEditing || false;
    vm.heading = vm.isEditing ? 'Update Fast Property' : 'Create Fast Property';
    vm.clusters = clusters;
    vm.appName = appName;
    vm.property.targetScope = angular.copy(fastProperty.selectedScope)|| {};

    vm.strategies = fastPropertyStrategy.getStrategies();
    vm.selectedStrategy = vm.strategies.length === 1 ? {selected: _.first(vm.strategies)} : {};


    vm.instanceChange = fastPropertyScopeBuilderService.createInstanceChangeFn(vm.property.targetScope, getImpact);
    vm.availabilityZoneChange = fastPropertyScopeBuilderService.createAvailabilityZoneChangeFn(vm, vm.property.targetScope, vm.scopeLists, vm.instanceChange);
    vm.asgChange = fastPropertyScopeBuilderService.createAsgChangeFn(vm, vm.property.targetScope, vm.scopeLists, vm.availabilityZoneChange);
    vm.clusterChange = fastPropertyScopeBuilderService.createClusterChangeFn(vm, vm.property.targetScope, vm.scopeLists, vm.asgChange);
    vm.stackChange = fastPropertyScopeBuilderService.createStackChangeFn(vm, vm.property.targetScope, vm.scopeLists, vm.clusterChange);
    vm.regionChange = fastPropertyScopeBuilderService.createRegionChangeFn(vm, vm.property.targetScope, vm.scopeLists, vm.stackChange);
    vm.getRegions = fastPropertyScopeBuilderService.createGetRegionsFn(vm, vm.property.targetScope, vm.scopeLists, vm.regionChange);
    vm.applicationChange = fastPropertyScopeBuilderService.createApplicationChangeFn(vm.property.targetScope, vm.getRegions);
    vm.applicationSelected = fastPropertyScopeBuilderService.createApplicationSelectedFn(vm, vm.applicationChange);

    vm.startInstanceChange = fastPropertyScopeBuilderService.createInstanceChangeFn(vm.property.startScope, angular.noop);
    vm.startAvailabilityZoneChange = fastPropertyScopeBuilderService.createAvailabilityZoneChangeFn(vm, vm.property.startScope, vm.startLists, vm.startInstanceChange);
    vm.startAsgChange = fastPropertyScopeBuilderService.createAsgChangeFn(vm, vm.property.startScope, vm.startLists, vm.startAvailabilityZoneChange);
    vm.startClusterChange = fastPropertyScopeBuilderService.createClusterChangeFn(vm, vm.property.startScope, vm.startLists, vm.startAsgChange);
    vm.startStackChange = fastPropertyScopeBuilderService.createStackChangeFn(vm, vm.property.startScope, vm.startLists, vm.startClusterChange);
    vm.startRegionChange = fastPropertyScopeBuilderService.createRegionChangeFn(vm, vm.property.startScope, vm.startLists, vm.startStackChange);
    vm.getStartRegions = fastPropertyScopeBuilderService.createGetRegionsFn(vm, vm.property.startScope, vm.startLists, vm.startRegionChange);
    vm.startApplicationChange = fastPropertyScopeBuilderService.createApplicationChangeFn(vm.property.startScope, vm.getStartRegions);
    vm.startApplicationSelected = fastPropertyScopeBuilderService.createApplicationSelectedFn(vm, vm.startApplicationChange);



    vm.applicationRemoved = (appName) => {
      delete vm.chosenApps[appName];
      vm.applicationChange();
    };

    vm.startApplicationRemoved = (appName) => {
      delete vm.chosenApps[appName];
      vm.startApplicationChange();
    };

    vm.refreshAppList = (query) => {
      vm.applicationList = query ? applicationList
        .filter((app) => {
          return app.name.toLowerCase().indexOf(query.toLowerCase()) === 0;
        })
        .map((app) => {
          return app.name;
        })
        .sort() : [];
    };

    vm.getAppClusters = () => {
      return appListExtractorService.getClusters(objectValuesToList(vm.chosenApps));
    };

    vm.setFormScope = (scope) => {
      vm.formScope = scope;
    };


    let resetProperty = () => {
      delete vm.property.canary;
      vm.property.startScope = {};
      vm.property.strategy = {};
    };

    vm.setStrategy = function() {
      let selected = vm.getSelected();
      //resetProperty();
      if(!_.isEmpty(selected)) {
        fastPropertyWizardManagementService.hidePages(selected.wizardScreens);
        fastPropertyWizardManagementService.showPages(selected.wizardScreens);

        Object.assign(vm.property.startScope, vm.property.targetScope);
        vm.property.startScope.appIdList.forEach(vm.startApplicationSelected);


        let controller = selected.controller;
        let controllerAs = selected.controllerAs;

        vm.setControllerToScope(controller, controllerAs);

      }
    };

    vm.getSelected = () => {
       return vm.selectedStrategy.selected ? vm.selectedStrategy.selected : {};
    };

    vm.setControllerToScope = (controller) => {
      if(controller) {
        let ctrl = $controller(controller, {parentVM: vm, modalInstance: $modalInstance});
        vm.submit = ctrl.submit;
        vm.update = ctrl.update;
      }
    };


    vm.init = () => {
      vm.property.targetScope.appIdList = [vm.appName];
      vm.applicationSelected(vm.appName);
      vm.setStrategy();
    };

    vm.init();

  })
  .name;
