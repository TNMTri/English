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

            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tutorial (id integer primary key, flag_name text, status boolean)");

            /*$cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (1, 'start_flag', 'true')");
            $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (2, 'create_topic_flag', 'false')");
            $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (3, 'create_item_flag', 'false')");*/

//            $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) SELECT * FROM (SELECT '1', 'start_flag', false) AS tmp WHERE NOT EXISTS (SELECT id FROM tutorial WHERE id = 1) LIMIT 1");
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
                url: "/play",
                views: {
                    'menuContent': {
                        templateUrl: "templates/play.html",
                        controller: 'PlayCtrl'
                    }
                }
            });
        //test page
        /*.state('app.browse', {
         url: "/browse/:id_topic",
         views: {
         'menuContent': {
         templateUrl: "templates/browse.html",
         controller: 'BrowseCtrl'
         }
         }
         });*/
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    });