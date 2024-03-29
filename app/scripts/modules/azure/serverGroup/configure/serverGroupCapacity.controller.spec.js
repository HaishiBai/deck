'use strict';

describe('Controller: ServerGroupCapacitySelector', function () {

  beforeEach(
    window.module(
      require('./serverGroupCapacitySelector.directive.js')
    )
  );

  beforeEach(window.inject(function ($controller, $rootScope) {
    this.scope = $rootScope.$new();

    this.scope.command = {
      capacity: {
        min: 0,
        max: 0,
        desired: 0
      },
      viewState: {
        useSimpleCapacity: false
      }
    };

    this.ctrl = $controller('ServerGroupCapacitySelectorCtrl', {
      $scope: this.scope,
    });
  }));


  it('synchronizes capacity only when in simple capacity mode', function() {
    var scope = this.scope,
        command = scope.command;

    command.viewState.useSimpleCapacity = true;
    command.capacity.desired = 2;
    scope.setMinMax(command.capacity.desired);

    expect(command.capacity.min).toBe(2);
    expect(command.capacity.max).toBe(2);

    command.viewState.useSimpleCapacity = false;
    command.capacity.desired = 1;
    scope.setMinMax(command.capacity.desired);

    expect(command.capacity.min).toBe(2);
    expect(command.capacity.max).toBe(2);

  });


});
