'use strict';

describe('authenticationProvider: application startup', function() {

  beforeEach(function() {
    loadDeck({
      initializeCache: false,
      generateUrls: true
    })
  });

  beforeEach(inject(function(authenticationService, $timeout, $httpBackend, settings, redirectService, $window, $location, $modal) {
    this.authenticationService = authenticationService;
    this.$timeout = $timeout;
    this.$http = $httpBackend;
    this.settings = settings;
    this.redirectService = redirectService;
    this.$window = $window;
    this.$location = $location;
    this.$modal = $modal;
    this.modal = jasmine.createSpyObj('modal', ['dismiss']);
    spyOn(this.$modal, 'open').and.returnValue(this.modal);

  }));

  describe('authenticateUser', function() {
    it('requests authentication from gate, then sets authentication name field', function() {
      this.$http.whenGET(this.settings.gateUrl + '/auth/info').respond(200, {email: 'joe!'});
      this.$timeout.flush();
      this.$http.flush();

      expect(this.authenticationService.getAuthenticatedUser().name).toBe('joe!');
      expect(this.authenticationService.getAuthenticatedUser().authenticated).toBe(true);
      expect(this.$modal.open.calls.count()).toBe(1);
      expect(this.modal.dismiss.calls.count()).toBe(1);
    });

    it('requests authentication from gate, then redirects on 401', function() {
      var redirectUrl = 'abc';
      spyOn(this.redirectService, 'redirect').and.callFake(function(url) {
        redirectUrl = url;
      });
      this.$http.whenGET(this.settings.gateUrl + '/auth/info').respond(401, null, {'X-AUTH-REDIRECT-URL': '/authUp'});
      this.$timeout.flush();
      this.$http.flush();

      expect(this.authenticationService.getAuthenticatedUser().name).toBe('[anonymous]');
      expect(this.authenticationService.getAuthenticatedUser().authenticated).toBe(false);
      expect(redirectUrl).toBe(this.settings.gateUrl + '/authUp?callback=' + this.$window.location.origin + '&path=' + this.$location.path());
      expect(this.$modal.open.calls.count()).toBe(1);
      expect(this.modal.dismiss.calls.count()).toBe(1);
    });
  });

});