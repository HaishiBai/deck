'use strict';


angular.module('deckApp.securityGroup.aws.edit.controller', [
  'ui.router',
  'deckApp.account.service',
  'deckApp.caches.infrastructure',
  'deckApp.caches.initializer',
  'deckApp.tasks.monitor.service',
  'deckApp.securityGroup.write.service',
  'deckApp.vpc.read.service',
])
  .controller('EditSecurityGroupCtrl', function($scope, $modalInstance, $exceptionHandler, $state,
                                                accountService,  securityGroupReader,
                                                taskMonitorService, cacheInitializer, infrastructureCaches,
                                                _, application, securityGroup, securityGroupWriter) {

    $scope.securityGroup = securityGroup;

    $scope.state = {
      refreshingSecurityGroups: false,
    };

    $scope.taskMonitor = taskMonitorService.buildTaskMonitor({
      application: application,
      title: 'Updating your security group',
      forceRefreshMessage: 'Getting your updated security group from Amazon...',
      modalInstance: $modalInstance,
      forceRefreshEnabled: true
    });

    console.log(securityGroup);

    securityGroup.securityGroupIngress = _(securityGroup.inboundRules)
      .filter(function(rule) {
        return rule.securityGroup;
      }).map(function(rule) {
        return rule.portRanges.map(function(portRange) {
          return {
            name: rule.securityGroup.name,
            type: rule.protocol,
            startPort: portRange.startPort,
            endPort: portRange.endPort
          };
        });
      })
      .flatten()
      .value();

    securityGroup.ipIngress = _(securityGroup.inboundRules)
      .filter(function(rule) {
        return rule.range;
      }).map(function(rule) {
        return rule.portRanges.map(function(portRange) {
          return {
            cidr: rule.range.ip + rule.range.cidr,
            type: rule.protocol,
            startPort: portRange.startPort,
            endPort: portRange.endPort
          };
        });
      })
      .flatten()
      .value();

    this.getSecurityGroupRefreshTime = function() {
      return infrastructureCaches.securityGroups.getStats().ageMax;
    };

    this.refreshSecurityGroups = function() {
      $scope.state.refreshingSecurityGroups = true;
      return cacheInitializer.refreshCache('securityGroups').then(function() {
        initializeSecurityGroups().then(function() {
          $scope.state.refreshingSecurityGroups = false;
        });
      });
    };



    function initializeSecurityGroups() {
      return securityGroupReader.getAllSecurityGroups().then(function (securityGroups) {
        var account = securityGroup.accountName,
          region = securityGroup.region,
          vpcId = securityGroup.vpcId || null;
        $scope.availableSecurityGroups = _.filter(securityGroups[account].aws[region], { vpcId: vpcId });
      });
    }

    this.addRule = function(ruleset) {
      ruleset.push({});
    };

    this.removeRule = function(ruleset, index) {
      ruleset.splice(index, 1);
    };

    $scope.taskMonitor.onApplicationRefresh = $modalInstance.dismiss;

    this.upsert = function () {

      $scope.taskMonitor.submit(
        function() {
          return securityGroupWriter.upsertSecurityGroup($scope.securityGroup, application, 'Update');
        }
      );
    };

    this.cancel = function () {
      $modalInstance.dismiss();
    };

    initializeSecurityGroups();
  });
