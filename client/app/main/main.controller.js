// 'use strict';

angular.module('redditlistApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {

    //call Reddit API
    $scope.getData = function() {
      $http.get('http://www.reddit.com/new.json').success(function(data, status) {
        $scope.status = status;
        $scope.list = data.data;
        $scope.modifyData();
      });
    };

    //Format data to send to DOM
    $scope.modifyData = function() {
      var dupeHash = {};
      var removeDupes = function(element) {
        if (!dupeHash[element.data.id]) {
          dupeHash[element.data.id] = true;
          return element;
        }
      };

      $scope.list.children = $scope.list.children.filter(removeDupes);

      $scope.list.children.forEach(function(post) {
        if (post.data.title.length > 55) {
          post.data.title = post.data.title.substr(0, 55) + '...';
        }
        post.data.created = new Date(post.data.created*1000).toLocaleDateString() + ' at ' + new Date(post.data.created*1000).toLocaleTimeString();
      });

    };

    $scope.getData();

    $interval($scope.getData(), 60000);

    //allow user to upvote something -- NOTE: Just for fun/sorting.  Not hooked up to Reddit API
    $scope.upVoteThing = function(entry) {
      entry.data.ups++;
    };

    //populate options menu
    $scope.selected = [
      {
        value: 'title',
        text: 'title'
      },
      {
        value: 'relevance',
        text: 'relevance'
      },
      {
        value: 'date',
        text: 'date'
      },
    ];

    $scope.optionDropdown = $scope.optionDropdown || null;

    //sort by title, upvotes (relevance), date (most recent first)
    $scope.sortResults = function () {
      if ($scope.optionDropdown === 'title') {
        $scope.list.children.sort(function(a, b) {
          var titleA=a.data.title.toLowerCase(), titleB=b.data.title.toLowerCase();
          if (titleA < titleB) {//sort string ascending
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          return 0; //default return value (no sorting)
        });
      }

      if ($scope.optionDropdown === 'relevance') {
        $scope.list.children.sort(function(a, b) {
          if (a.data.ups > b.data.ups) {
            return -1;
          }
          if (a.data.ups < b.data.ups) {
            return 1;
          }
          return 0; //default return value (no sorting)
        });
      }

      if ($scope.optionDropdown === 'date') {
        $scope.list.children.sort(function(a, b) {
          if (a.data.created > b.data.created) {
            return -1;
          }
          if (a.data.created < b.data.created) {
            return 1;
          }
          return 0; //default return value (no sorting)
        });
      }
    };

  });
