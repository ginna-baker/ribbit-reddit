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

  it('should receive a status of 200 from Reddit API', function() {
    $scope.getData();
    expect($scope.status).toEqual(200);
  });

  it('should receive content from the Reddit API', function() {
    $scope.getData();
    expect (typeof $scope.list).toBeDefined();
  });

  it('should receive an object from the Reddit API', function() {
    $scope.getData();
    expect(typeof $scope.list).toEqual(Object);
  });

  it('should attach a list of things to the scope', function() {
    $scope.getData();
    expect($scope.list.children.length).toExceed(10);
  });

  it('should return a posting date/time within 12 hours of current date/time', function () {
    $scope.getData();
    expect(Date(now) - 43200000).toBeLessThan($scope.list.children.created);
    expect($scope.list.children.created).toBeLessThan(Date(now) + 43200000);
  });

  it('should sort alphabetically by title', function() {
    $scope.getData();
    $scope.optionDropdown === "title";
    expect($scope.list.children[7].data.title.toLowerCase()).toBeLessThan( scope.list.children[19].data.title.toLowerCase());
    expect($scope.list.children[15].data.title.toLowerCase()).toBeLessThan($scope.list.children[22].data.title.toLowerCase());
  });

});
