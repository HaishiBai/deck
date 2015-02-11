'use strict';

describe('Controller: awsCreateLoadBalancerCtrl', function () {

  // load the controller's module
  beforeEach(module('deckApp.loadBalancer.aws.create.controller'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    this.$scope = $rootScope.$new();
    this.ctrl = $controller('awsCreateLoadBalancerCtrl', {
      $scope: this.$scope,
      $modalInstance: { dismiss: angular.noop, result: { then: angular.noop } },
      application: {name: 'app'},
      loadBalancer: null,
      isNew: true
    });
  }));

  it('requires health check path for HTTP/S', function () {
    var loadBalancer = {
      healthCheckProtocol: 'HTTP'
    };

    this.$scope.loadBalancer = loadBalancer;

    expect(this.ctrl.requiresHealthCheckPath()).toBe(true);

    loadBalancer.healthCheckProtocol = 'HTTPS';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(true);

    loadBalancer.healthCheckProtocol = 'SSL';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(false);

    loadBalancer.healthCheckProtocol = 'TCP';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(false);

  });

  it('includes SSL Certificate field when any listener is HTTPS', function() {
    var loadBalancer = {
      listeners: [],
    };

    this.$scope.loadBalancer = loadBalancer;

    expect(this.ctrl.showSslCertificateIdField()).toBe(false);

    loadBalancer.listeners.push({ externalProtocol: 'HTTP' });
    expect(this.ctrl.showSslCertificateIdField()).toBe(false);

    loadBalancer.listeners.push({ externalProtocol: 'HTTPS' });
    expect(this.ctrl.showSslCertificateIdField()).toBe(true);

    loadBalancer.listeners = [ { externalProtocol: 'HTTPS' }, { externalProtocol: 'HTTPS' }];
    expect(this.ctrl.showSslCertificateIdField()).toBe(true);
  });

});