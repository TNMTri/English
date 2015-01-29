var db = null;

angular.module('starter.controllers', ['ngCordova', 'ionic'])

    //menu
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $stateParams, $state, $cordovaSQLite) {

        $scope.topics = [];
        $scope.data = {};

        //Create modal (popup)
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Open new topic modal
        $scope.show_new_topic = function () {
            $scope.modal.show();
        };

        //Close new topic modal
        $scope.close_new_topic = function () {
            $scope.modal.hide();
        };

        //Insert new topic.
        $scope.insert_topic = function () {
            alert("insert nè");
            var query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topicName]).then(function (res) {
                alert("INSERT ID -> " + res.insertId);
                $scope.close_new_topic();
            }, function (err) {
                console.error(err);
            });
        };

        /*$scope.showPopup = function () {
         $scope.data = {};
         // An elaborate, custom popup
         var myPopup = $ionicPopup.show({
         title: 'Rename Topic',
         subTitle: 'Please enter topic name',
         scope: $scope,
         buttons: [
         { text: 'Cancel' },
         {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function (e) {
         if (!$scope.data.topic_new_name) {
         e.preventDefault();
         } else {
         return $scope.data.topic_new_name;
         }
         }
         }
         ]
         });
         myPopup.then(function (res) {
         console.log($scope.topics);
         $scope.topics.forEach(function (topic) {
         if (topic.id.equal($stateParams.id)) {
         console.log("có nha, có nha");
         }
         //console.log('Tapped!', res);
         })
         });
         };*/
    })

    .controller('PlaylistsCtrl', function ($scope, $ionicModal, $cordovaSQLite, $rootScope) {
        //Create modal (popup)
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Open new topic modal
        $scope.show_new_topic = function () {
            $scope.modal.show();
        };

        //Close new topic modal
        $scope.close_new_topic = function () {
            $scope.modal.hide();
        };

        //Insert new topic.
        $scope.insert_topic = function () {
            alert("insert nè");
            var query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
                alert("INSERT ID -> " + res.insertId);
                $scope.modal.hide();
                $scope.topics.push({id: res.insertId, topic_name: $scope.data.topic_name});
            }, function (err) {
                console.error(err);
            });
        };
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams, $state, $cordovaSQLite) {

        /*console.log("ID cua topic: " + $stateParams.id);
         var id_topic = $stateParams.id_topic;*/

        $scope.items = [];
        /*$scope.topics.forEach(function (topic) {
         if (topic.id == $stateParams.id_topic) {
         $scope.topic.push(topic);
         }
         });*/

        $scope.edit_topic = function () {
            alert("edit name topic :D");
        };

        $scope.delete_topic = function () {
            $scope.topics.forEach(function (topic) {
                if (topic.id == $stateParams.id) {
                    var x = $scope.topics.indexOf($stateParams.id);
                    console.log("param " + $stateParams.id);
                    $scope.topics.splice(x, 1);
                    $state.go('app.playlists');
                }
                //new delete
                var query = "DELETE FROM topic WHERE ID = ?";
                $cordovaSQLite.execute(db, query, [$stateParams.id]).then(function (res) {
                    alert("delete success");
                    $state.go('app.playlists');
                }, function (err) {
                    alert(err);
                });
            });
        };

        var id_topic = $stateParams.id_topic;

        $scope.play_topic = function () {
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    //console.log("SELECTED -> " + res.rows.item(0).topic_name);
                    $scope.items = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        //alert(res.rows.item(i).topic_name);
                        $scope.items.push({id: res.rows.item(i).id, content: res.rows.item(i).content});
                    }
                } else {
                    alert("No results found, please insert.");
                }
            }, function (err) {
                console.error(err);
            });
        };

        //insert new item in this list
        $scope.new_item = function () {
            /*alert($scope.data.topicName);*/
            var query = "INSERT INTO item (id_topic, content) VALUES (?, ?)";
            $cordovaSQLite.execute(db, query, [$stateParams.id_topic, $scope.data.topicName]).then(function (res) {
                alert("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };

        //delete item in topic0
        $scope.delete_item = function (id_item) {
            var query = "DELETE FROM item WHERE id = " + id_item;
            $cordovaSQLite.execute(db, query).then(function (res) {
                alert("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };
    })

    .controller('BrowseCtrl', function ($scope, $cordovaSQLite) {
        $scope.insert_topic_browse = function () {
            console.log("Insert nha!!!");
            alert($scope.data.topicName);
            var query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topicName]).then(function (res) {
                alert("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };

        $scope.select_topic_browse = function () {
            console.log("Select nha nha!!!");
            var query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    console.log("SELECTED -> " + res.rows.item(0).topic_name);
                    $scope.topics = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        //alert(res.rows.item(i).topic_name);
                        $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                    }
                } else {
                    console.log("No results found");
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.delete_topic_browse = function () {
            alert("vô");
            db = $cordovaSQLite.deleteDB("my.db");
            $cordovaSQLite.deleteDB("my.db");
        }
    })

    .controller('PlayCtrl', function ($scope, $stateParams, $cordovaSQLite) {

        var id_topic = $stateParams.id_topic;

        $scope.play_topic = function () {
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    //console.log("SELECTED -> " + res.rows.item(0).topic_name);
                    $scope.items = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        //alert(res.rows.item(i).topic_name);
                        $scope.items.push({id: res.rows.item(i).id, content: res.rows.item(i).content});
                    }
                } else {
                    alert("No results found, please insert.");
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.stop_topic = function () {
            //stop, back to playlist with id
        }
    });