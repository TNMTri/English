var db = null;

angular.module('starter', ['starter.controllers', 'ionic', 'ngCordova'])

    .run(function ($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            //db = $cordovaSQLite.deleteDB("my.db");
            db = $cordovaSQLite.openDB({ name: "my.db" });
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS topic (id integer primary key, topic_name text)");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS item (id integer primary key, id_topic integer, content text)");

        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            //menu:
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            //home page
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'HomeCtrl'
                    }
                }
            })
            //topic detail
            .state('app.topic', {
                url: "/topic/:id_topic",
                views: {
                    'menuContent': {
                        templateUrl: "templates/topic.html",
                        controller: 'TopicCtrl'
                    }
                }
            })
            //play topic
            .state('app.play', {
                url: "/play/:id_topic",
                views: {
                    'menuContent': {
                        templateUrl: "templates/play.html",
                        controller: 'PlayCtrl'
                    }
                }
            })
            //test page
            .state('app.browse', {
                url: "/browse/:id_topic",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html",
                        controller: 'BrowseCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    });