'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.account.service', [
  require('exports?"restangular"!imports?_=lodash!restangular'),
  require('../../utils/lodash.js'),
  require('../cache/infrastructureCaches.js'),
  require('../../config/settings.js'),
])
  .factory('accountService', function(settings, _, Restangular, $q, infrastructureCaches) {

    function getPreferredZonesByAccount(providerName='aws') {
      return $q.when(settings.providers[providerName].preferredZonesByAccount);
    }

    function getAvailabilityZonesForAccountAndRegion(providerName, accountName, regionName) {
	console.log('-------------------------------' + providerName + ':' + accountName + ':' + regionName + '------------');
	if (providerName === 'azure') {
		return [regionName];
	}
      return getPreferredZonesByAccount(providerName).then( function(defaults) {
        if (defaults[accountName] && defaults[accountName][regionName]) {
          return {preferredZones: defaults[accountName][regionName]};
        }
        if (!defaults[accountName] && defaults.default && defaults.default[regionName]) {
          return {preferredZones: defaults.default[regionName]};
        }
        return {preferredZones: []};
      })
      .then(function(zonesCollection) {
        return getRegionsForAccount(accountName).then(function(regions){
          zonesCollection.actualZones = _.find(regions, {name: regionName}).availabilityZones;
          return zonesCollection;
        });
      })
      .then(function(zonesCollection) {
        return _.intersection(zonesCollection.preferredZones, zonesCollection.actualZones);
      })
      .catch(function() {
         return settings.providers[providerName].preferredZonesByAccount.default[regionName];
      });
    }

    function listAccounts(provider) {
      if (provider) {
        return listAccounts().then(function(accounts) {
          return _.filter(accounts, { type: provider });
        });
      }
      return Restangular
        .all('credentials')
        .withHttpConfig({cache: infrastructureCaches.credentials})
        .getList();
    }

    function listProviders() {
      return listAccounts().then(function(accounts) {
        return _.uniq(_.pluck(accounts, 'type'));
      });
    }

    function getRegionsKeyedByAccount(provider) {
      var deferred = $q.defer();
      listAccounts(provider).then(function(accounts) {
        $q.all(accounts.reduce(function(acc, account) {
          acc[account.name] = Restangular
            .all('credentials')
            .one(account.name)
            .withHttpConfig({cache: infrastructureCaches.credentials})
            .get();
          return acc;
        }, {})).then(function(result) {
          deferred.resolve(result);
        });
      });
      return deferred.promise;
    }

    function getAccountDetails(accountName) {
      return Restangular.one('credentials', accountName)
        .withHttpConfig({cache: infrastructureCaches.credentials})
        .get();
    }

    function getRegionsForAccount(accountName) {
      return getAccountDetails(accountName).then(function(details) {
        return details ? details.regions : null;
      });
    }

    function challengeDestructiveActions(provider, account) {
      return account &&
        settings.providers[provider] &&
        settings.providers[provider].challengeDestructiveActions &&
        settings.providers[provider].challengeDestructiveActions.indexOf(account) > -1;
    }

    return {
      challengeDestructiveActions: challengeDestructiveActions,
      listAccounts: listAccounts,
      listProviders: listProviders,
      getAccountDetails: getAccountDetails,
      getRegionsForAccount: getRegionsForAccount,
      getRegionsKeyedByAccount: getRegionsKeyedByAccount,
      getPreferredZonesByAccount: getPreferredZonesByAccount,
      getAvailabilityZonesForAccountAndRegion: getAvailabilityZonesForAccountAndRegion
    };
  })
  .name;
