'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('redditlistApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should receive a status of 200 from API call', function() {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('http://www.reddit.com/new.json')
        .respond(200, {kind: 'listing', data: {children: [{data: {id: 'dupe', title: 'xyz'}}, {data: {id: 'unique', title: 'abcd'}}, {data: {id: 'dupe', title: 'xyz'}}] } });

      $httpBackend.expectGET('http://www.reddit.com/new.json');

      scope.getData();
      $httpBackend.flush();
    });

    expect(scope.status).toEqual(200);
  });

  it('should receive an object from the API', function() {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('http://www.reddit.com/new.json')
        .respond(200, {kind: 'listing', data: {children: [{data: {id: 'dupe', title: 'xyz'}}, {data: {id: 'unique', title: 'abcd'}}, {data: {id: 'dupe', title: 'xyz'}}] } });

      $httpBackend.expectGET('http://www.reddit.com/new.json');

      scope.getData();
      $httpBackend.flush();
    });
    expect(typeof scope.list).toEqual('object');
  });

  it('should attach a list of things to the scope', function() {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('http://www.reddit.com/new.json')
        .respond(200, {kind: 'listing', data: {children: [{data: {id: 'dupe', title: 'xyz'}}, {data: {id: 'unique', title: 'abcd'}}, {data: {id: 'dupe', title: 'xyz'}}] } });

      $httpBackend.expectGET('http://www.reddit.com/new.json');

      scope.getData();
      $httpBackend.flush();
    });
    expect(scope.list.children.length > 0).toBeTruthy();
  });

  it('should filter duplicates', function() {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('http://www.reddit.com/new.json')
        .respond(200, {kind: 'listing', data: {children: [{data: {id: 'dupe', title: 'xyz', created: 1419359044}}, {data: {id: 'unique', title: 'abcd', created: 1419359042}}, {data: {id: 'dupe', title: 'xyz', created: 1419359044}}] } });

      $httpBackend.expectGET('http://www.reddit.com/new.json');

      scope.getData();
      $httpBackend.flush();
    });
    expect(scope.list).toEqual({children: [ {data: {id: 'dupe', title: 'xyz', created: new Date(1419359044000).toLocaleDateString() + ' at ' + new Date(1419359044000).toLocaleTimeString()}}, {data: {id: 'unique', title: 'abcd', created: new Date(1419359042000).toLocaleDateString() + ' at ' + new Date(1419359042000).toLocaleTimeString()}} ]});
  });

  it('should sort alphabetically by title', function() {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('http://www.reddit.com/new.json')
        .respond(200, {kind: 'listing', data: {children: [{data: {id: 'dupe', title: 'xyz', created: 1419359044}}, {data: {id: 'unique', title: 'abcd', created: 1419359042}} ] }});

      $httpBackend.expectGET('http://www.reddit.com/new.json');

      scope.getData();
      $httpBackend.flush();
    });

    scope.optionDropdown = 'title';
    scope.sortResults();
    expect(scope.list.children[0].data.title.toLowerCase()).toBeLessThan( scope.list.children[1].data.title.toLowerCase());
  });

});
