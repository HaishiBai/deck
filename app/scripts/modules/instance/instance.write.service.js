'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.instance.write.service', [
    require('../tasks/taskExecutor.js'),
    require('../serverGroups/serverGroup.read.service.js'),
  ])
  .factory('instanceWriter', function (taskExecutor, serverGroupReader) {

    function terminateInstance(instance, application, params={}) {
      params.type = 'terminateInstances';
      params.instanceIds = [instance.instanceId];
      params.serverGroup = instance.serverGroup;
      params.launchTimes = [instance.launchTime];
      params.region = instance.region;
      params.zone = instance.placement.availabilityZone;
      params.credentials = instance.account;
      params.providerType = instance.providerType;

      return taskExecutor.executeTask({
        job: [params],
        application: application,
        description: 'Terminate instance: ' + instance.instanceId
      });
    }

    function terminateInstanceAndShrinkServerGroup(instance, application) {
      return serverGroupReader.getServerGroup(application.name, instance.account, instance.region, instance.serverGroup).
        then(function(serverGroup) {
          var setMaxToNewDesired = serverGroup.asg.minSize === serverGroup.asg.maxSize;
          return taskExecutor.executeTask({
            job: [
              {
                type: 'terminateInstanceAndDecrementAsg',
                instance: instance.instanceId,
                asgName: instance.serverGroup,
                region: instance.region,
                credentials: instance.account,
                providerType: instance.providerType,
                cloudProvider: instance.providerType,
                adjustMinIfNecessary: true,
                setMaxToNewDesired: setMaxToNewDesired,
              }
            ],
            application: application,
            description: 'Terminate instance ' + instance.instanceId + ' and shrink ' + instance.serverGroup,
          });
        });
    }

    function rebootInstance(instance, application) {
      return taskExecutor.executeTask({
        job: [
          {
            type: 'rebootInstances',
            instanceIds: [instance.instanceId],
            region: instance.region,
            zone: instance.placement.availabilityZone,
            credentials: instance.account,
            cloudProvider: instance.providerType,
            providerType: instance.providerType
          }
        ],
        application: application,
        description: 'Reboot instance: ' + instance.instanceId
      });
    }

    function deregisterInstanceFromLoadBalancer(instance, application, params={}) {
      params.type = 'deregisterInstancesFromLoadBalancer';
      params.instanceIds = [instance.instanceId];
      params.loadBalancerNames = instance.loadBalancers;
      params.region = instance.region;
      params.credentials = instance.account;
      params.providerType = instance.providerType;
      params.cloudProvider = instance.providerType;

      return taskExecutor.executeTask({
        job: [params],
        application: application,
        description: 'Deregister instance: ' + instance.instanceId
      });
    }

    function registerInstanceWithLoadBalancer(instance, application, params={}) {
      params.type = 'registerInstancesWithLoadBalancer';
      params.instanceIds = [instance.instanceId];
      params.loadBalancerNames = instance.loadBalancers;
      params.region = instance.region;
      params.credentials = instance.account;
      params.providerType = instance.providerType;
      params.cloudProvider = instance.providerType;

      return taskExecutor.executeTask({
        job: [params],
        application: application,
        description: 'Register instance: ' + instance.instanceId
      });
    }

    function enableInstanceInDiscovery(instance, application) {
      return taskExecutor.executeTask({
        job: [
          {
            type: 'enableInstancesInDiscovery',
            instanceIds: [instance.instanceId],
            region: instance.region,
            credentials: instance.account,
            providerType: instance.providerType,
            cloudProvider: instance.providerType,
          }
        ],
        application: application,
        description: 'Enable instance: ' + instance.instanceId
      });
    }

    function disableInstanceInDiscovery(instance, application) {
      return taskExecutor.executeTask({
        job: [
          {
            type: 'disableInstancesInDiscovery',
            instanceIds: [instance.instanceId],
            region: instance.region,
            credentials: instance.account,
            providerType: instance.providerType,
            cloudProvider: instance.providerType,
          }
        ],
        application: application,
        description: 'Disable instance: ' + instance.instanceId
      });
    }

    return {
      terminateInstance: terminateInstance,
      rebootInstance: rebootInstance,
      registerInstanceWithLoadBalancer: registerInstanceWithLoadBalancer,
      deregisterInstanceFromLoadBalancer: deregisterInstanceFromLoadBalancer,
      enableInstanceInDiscovery: enableInstanceInDiscovery,
      disableInstanceInDiscovery: disableInstanceInDiscovery,
      terminateInstanceAndShrinkServerGroup: terminateInstanceAndShrinkServerGroup,
    };

  }).name;
