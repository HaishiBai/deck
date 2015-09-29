'use strict';

/**
 * @ngdoc overview
 * @name spinnaker
 * @description
 * # spinnaker
 *
 * Main module of the application.
 */
//BEN_TODO figure out what actually gets used here
global.$ = global.jQuery = require('jquery'); //  deck is reliant on my jquery features we need to load it before angular.

global.Spinner = require('spin.js');

require('../../node_modules/angular-hotkeys/build/hotkeys.css');

require('jquery-ui');
require('bootstrap/dist/css/bootstrap.css');
require('select2-bootstrap-css/select2-bootstrap.css');
require('Select2/select2.css');
require('ui-select/dist/select.css');

require('angular-wizard/dist/angular-wizard.css');

require('source-sans-pro');


// likely that some of these can be moved to the modules that support them
require('./modules/applications/application.less');
require('./modules/healthCounts/counters.less');
require('./modules/delivery/delivery.less');
require('./modules/core/presentation/details.less');
require('./modules/fastProperties/fastProperties.less');
require('./modules/instance/instanceSelection.less');
require('./modules/core/presentation/main.less');
require('./modules/modal/modals.less');
require('./modules/navigation/navigation.less');
require('./modules/applications/newapplication.less');
require('./modules/pipelines/pipelines.less');
require('./modules/cluster/rollups.less');
require('./modules/tasks/tasks.less');
require('./modules/utils/stickyHeader/stickyHeader.less');

require('./modules/search/global/globalSearch.less');
require('./modules/confirmationModal/confirmationModal.less');

require('../fonts/spinnaker/icons.css');

require('Select2');

let angular = require('angular');

require('bootstrap/dist/js/bootstrap.js');
require('angulartics');

// load all templates into the $templateCache
var templates = require.context('../', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular.module('spinnaker', [
    require('angular-sanitize'),
    require('angular-messages'),
    require('exports?"ui.select"!ui-select'),
    require('exports?"angulartics"!angulartics'),
    require('exports?"cfp.hotkeys"!angular-hotkeys'),
    require('angular-animate'),
    require('angular-ui-router'),
    require('angular-ui-bootstrap'),
    require('exports?"restangular"!imports?_=lodash!restangular'),
    require('./modules/core/presentation/anyFieldFilter/anyField.filter.js'),
    require('./modules/core/presentation/robotToHumanFilter/robotToHuman.filter.js'),
    require('imports?define=>false!exports?"angularSpinner"!angular-spinner'),
    require('./modules/core/bootstrap/applicationBootstrap.directive.js'),

    require('./modules/core/presentation/presentation.module.js'),
    require('./modules/core/forms/forms.module.js'),
    require('./modules/modal/modal.module.js'),

    require('exports?"angular.filter"!angular-filter'),
    require('./modules/navigation/states.provider.js'),
    require('./modules/caches/cacheInitializer.js'),
    require('./modules/delivery/states.js'),
    require('exports?"infinite-scroll"!ng-infinite-scroll/build/ng-infinite-scroll.js'),

    require('./modules/insight/insight.module.js'),
    require('./modules/applications/application.module.js'),
    require('./modules/feedback/feedback.module.js'),

    require('./modules/amazon/aws.module.js'),
    require('./modules/google/gce.module.js'),
    require('./modules/utils/utils.module.js'),
    require('./modules/caches/caches.module.js'),
    require('./modules/naming/naming.service.js'),
    require('./modules/core/cloudProvider/serviceDelegate.service.js'),
    require('./modules/healthCounts/healthCounts.directive.js'),
    require('./modules/config/settings.js'),
    require('./modules/scheduler/scheduler.service.js'),
    require('./modules/clusterFilter/cluster.filter.module.js'),
    require('./modules/confirmationModal/confirmationModal.service.js'),
    require('./modules/common/ajaxError.interceptor.js'),
    require('./modules/deploymentStrategy/deploymentStrategy.module.js'),
    require('./modules/deploymentStrategy/strategies/redblack/redblack.strategy.module.js'),
    require('./modules/deploymentStrategy/strategies/none/none.strategy.module.js'),
    require('./modules/deploymentStrategy/strategies/highlander/highlander.strategy.module.js'),
    require('./modules/deploymentStrategy/strategies/rollingPush/rollingPush.strategy.module.js'),
    require('./modules/serverGroups/serverGroup.module.js'),
    require('./modules/securityGroups/securityGroup.module.js'),
    require('./modules/instance/instance.module.js'),
    require('./modules/pageTitle/pageTitleService.js'),
    require('./modules/help/help.module.js'),
    require('./modules/delivery/delivery.module.js'),
    require('./modules/pipelines/pipelines.module.js'),
    require('./modules/pipelines/config/stages/bake/bakeStage.module.js'),
    require('./modules/pipelines/config/stages/canary/canaryStage.module.js'),
    require('./modules/pipelines/config/stages/checkPreconditions/checkPreconditionsStage.module.js'),
    require('./modules/pipelines/config/stages/core/stage.core.module.js'),
    require('./modules/pipelines/config/stages/deploy/deployStage.module.js'),
    require('./modules/pipelines/config/stages/destroyAsg/destroyAsgStage.module.js'),
    require('./modules/pipelines/config/stages/disableAsg/disableAsgStage.module.js'),
    require('./modules/pipelines/config/stages/enableAsg/enableAsgStage.module.js'),
    require('./modules/pipelines/config/stages/executionWindows/executionWindowsStage.module.js'),
    require('./modules/pipelines/config/stages/findAmi/findAmiStage.module.js'),
    require('./modules/pipelines/config/stages/jenkins/jenkinsStage.module.js'),
    require('./modules/pipelines/config/stages/manualJudgment/manualJudgmentStage.module.js'),
    require('./modules/pipelines/config/stages/modifyScalingProcess/modifyScalingProcess.module.js'),
    require('./modules/pipelines/config/stages/pipeline/pipelineStage.module.js'),
    require('./modules/pipelines/config/stages/quickPatchAsg/quickPatchAsgStage.module.js'),
    require('./modules/pipelines/config/stages/quickPatchAsg/bulkQuickPatchStage/bulkQuickPatchStage.module.js'),
    require('./modules/pipelines/config/stages/resizeAsg/resizeAsgStage.module.js'),
    require('./modules/pipelines/config/stages/script/scriptStage.module.js'),
    require('./modules/pipelines/config/stages/shrinkCluster/shrinkClusterStage.module.js'),
    require('./modules/pipelines/config/stages/wait/waitStage.module.js'),
    require('./modules/pipelines/config/stages/determineTargetReference/determineTargetReference.module.js'),
    require('./modules/authentication/authentication.module.js'),
    require('./modules/search/search.module.js'),
    require('./modules/notifications/notifications.module.js'),
    require('./modules/notifications/types/email/email.notification.type.module.js'),
    require('./modules/notifications/types/hipchat/hipchat.notification.type.module.js'),
    require('./modules/notifications/types/sms/sms.notification.type.module.js'),
    require('./modules/preconditions/preconditions.module.js'),
    require('./modules/preconditions/types/clusterSize/clusterSize.precondition.type.module.js'),
    require('./modules/tasks/tasks.module.js'),
    require('./modules/tasks/monitor/taskMonitor.module.js'),
    require('./modules/validation/validation.module.js'),
    require('./modules/loadBalancers/loadBalancers.module.js'),
    require('./modules/config/config.module.js'),
    require('./modules/whatsNew/whatsNew.directive.js'),
    require('./modules/netflix/blesk/blesk.module.js'),
    require('./modules/fastProperties/fastProperties.module.js'),
    require('./modules/account/accountLabelColor.directive.js'),
    require('./modules/core/history/recentHistory.service.js'),
])
  .run(function($state, $rootScope, $log, $exceptionHandler, cacheInitializer, $modalStack, pageTitleService, settings, recentHistoryService) {
    // This can go away when the next version of ui-router is available (0.2.11+)
    // for now, it's needed because ui-sref-active does not work on parent states
    // and we have to use ng-class. It's gross.
    //
    cacheInitializer.initialize();
    $rootScope.subscribeTo = function(observable) {
      this.subscribed = {
        data: undefined
      };

      observable.subscribe(function(data) {
        this.subscribed.data = data;
      }.bind(this), function(err) {
        $exceptionHandler(err, 'Failed to load data into the view.');
      });
    };

    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $modalStack.dismissAll();
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams
      });
      pageTitleService.handleRoutingStart();
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams,
        error: error
      });
      $state.go('home.404');
      pageTitleService.handleRoutingError();
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams
      });
      pageTitleService.handleRoutingSuccess(toState.data);
      if (toState.data && toState.data.history) {
        recentHistoryService.addItem(toState.data.history.type, toState.name, toParams, toState.data.history.keyParams);
      }
    });

    $rootScope.feature = settings.feature;
  })
  .config(function($animateProvider) {
    $animateProvider.classNameFilter(/animated/);

  })
  .config(function ($logProvider, statesProvider ) {
    statesProvider.setStates();
    $logProvider.debugEnabled(true);
  })
  .config(function($modalProvider) {
    $modalProvider.options.backdrop = 'static';
    $modalProvider.options.keyboard = false;
  })
  .config(function($httpProvider){
    $httpProvider.interceptors.push('ajaxErrorInterceptor');
    $httpProvider.defaults.headers.patch = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  })
  .config(require('./modules/core/uiSelect.decorator.js'))
  //.config(function ($compileProvider) {
  //  $compileProvider.debugInfoEnabled(false);
  //})
  .config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'select2';
    uiSelectConfig.appendToBody = true;
  })
  .config(function($tooltipProvider) {
    $tooltipProvider.options({
      appendToBody: true
    });
    $tooltipProvider.setTriggers({
      'mouseenter focus': 'mouseleave blur'
    });
  })
  .config(function(RestangularProvider, settings) {
    RestangularProvider.setBaseUrl(settings.gateUrl);
  })
  .config(function($provide) {
    $provide.decorator('$exceptionHandler', function ($delegate, $analytics) {
      return function (exception, cause) {
        try {
          var action = 'msg: ' + exception.message + ' url: ' + window.location;
          var label = exception.stack;

          $analytics.eventTrack(action, {category: 'JavaScript Error', label: label, noninteraction: true});
          $delegate(exception, cause);
        } catch(e) {
          // eat it to prevent an endless exception loop from happening
        }
      };
    });
  })
  .config(function(hotkeysProvider) {
    hotkeysProvider.template =
                    `<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys">
                      <h4 class="cfp-hotkeys-title" ng-if="!header">{{ title }}</h4>
                      <div ng-bind-html="header" ng-if="header"></div>
                      <div style="display:flex; flex-direction:row; align-items: flex-start; justify-content: center">
                        <div>
                           <table>
                             <tbody>
                              <tr>
                                <td class="cfp-hotkeys-keys">
                                  <span class="cfp-hotkeys-key">/</span>
                                </td>
                                <td>Global Search</td>
                              </tr>
                              <tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\', combo: \'+shift+\'}">
                                <td class="cfp-hotkeys-keys">
                                  <span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>
                                </td>
                                <td class="cfp-hotkeys-text">{{ hotkey.description }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <table>
                            <tbody>
                              <tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\', combo: \'+alt+\'}">
                                <td class="cfp-hotkeys-keys">
                                  <span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>
                                </td>
                                <td class="cfp-hotkeys-text">{{ hotkey.description }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div ng-bind-html="footer" ng-if="footer"></div>
                      <div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">×</div>
                    </div></div>`;
  })
  .run(function($templateCache) {
    $templateCache.put('template/popover/popover.html',
        '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n' +
        '  <div class="arrow"></div>\n' +
        '\n' +
        '  <div class="popover-inner">\n' +
        '      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n' +
        '      <div class="popover-content" ng-bind-html="content"></div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
  }).run(function($state, hotkeys) {
    let globalHotkeys = [
      {
        combo: 'ctrl+shift+a',
        description: "Applications",
        callback: () => $state.go('home.applications'),
      },
      {
        combo: 'ctrl+shift+i',
        description: "Infrastructure",
        callback: () => $state.go('home.infrastructure'),
      },
      {
        combo: 'ctrl+shift+d',
        description: 'Data',
        callback: () => $state.go('home.data'),
      },

    ];

    globalHotkeys.forEach((hotkeyConfig) => hotkeys.add(hotkeyConfig));
  })
;

