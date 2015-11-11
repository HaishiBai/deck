'use strict';


let angular = require('angular');

module.exports = angular
  .module('spinneker.fastProperty.aca.strategy.controller', [
    require('../../fastProperty.write.service.js')
  ])
  .controller('acaStrategyController', function(parentVM, modalInstance, fastPropertyWriter) {
    var vm = parentVM; //controllerAs: strategy
    vm.form = parentVM.formScope.newFastPropertyForm;
    vm.property.strategy.name = 'aca';
    vm.property.strategy.rolloutListString = "";



    vm.property.canary = {
      name: `${vm.appName}-${vm.property.key}-${vm.isEditing ? 'update' : 'create'}`,
      successfulScore: 100,
      unhealthyScore: 100,
    };

    vm.clusterIsSet = () => {
      if (vm.property &&
          vm.property.startScope &&
          typeof vm.property.startScope.cluster === 'undefined'
      ) {
        vm.form.$setValidity('noCluster', false);
        return false;
      }
      vm.form.$setValidity('noCluster', true);
      return true;
    };


    vm.submit = () => {
      vm.property.startScope = vm.transformScope(vm.property.startScope);
      vm.property.targetScope = vm.transformScope(vm.property.targetScope);
      vm.property.strategy.rolloutList = vm.property.strategy.rolloutListString.split(/\s*,\s*/).map(Number);

      delete vm.property.env; //removing to help with downstream marshalling.

      fastPropertyWriter.upsertFastProperty(vm.property).then(
        function(result) {
          modalInstance.close(result);
        },
        function(error) {
          window.alert(JSON.stringify(error));
        });
    };

    vm.update = vm.submit;

    return vm;
  })
  .name;
