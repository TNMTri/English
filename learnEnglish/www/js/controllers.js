var db = null;

angular.module('starter.controllers', ['ngCordova', 'ionic'])

    //menu
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $stateParams, $state, $cordovaSQLite) {

        $scope.topics = [];
        $scope.items = [];
        $scope.data = {};

        $scope.show = function () {
            alert("Show!!!");
            var query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.topics = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.select_topic = function () {
            var query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.topics = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.init = function () {
            $scope.select_topic();
        };

        $scope.$watch("model", function (value) {
            $scope.select_topic();
            alert("watch success");
        }, true);

        $scope.select_items = function (id_topic) {
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, id_topic: id_topic, content: res.rows.item(i).content});
                }
            }, function (err) {
                console.error(err);
            });
        };

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
                $scope.close_new_topic();
            }, function (err) {
                alertr(err);
            });
            //Select
            $scope.close_new_topic();
            //Select
            var query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.topics = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.edit_topic_name = function (id_topic) {
            $scope.data = {};
            //Custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.topic_new_name">',
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
                var query = "UPDATE topic SET topic_name = ? WHERE id = ?";
                $cordovaSQLite.execute(db, query, [$scope.data.topic_new_name, id_topic]).then(function (res) {
                    $scope.select_topic();
                }, function (err) {
                    console.error(err);
                });
                myPopup.close();
            });
        };

        $scope.delete_topic = function (id_topic) {
            var query = "DELETE FROM topic WHERE ID = ?";
            $cordovaSQLite.execute(db, query, [id_topic]).then(function (res) {
                alert("Delete success!!!");
                $scope.select_topic();
            }, function (err) {
                alert(err);
            });
        };

        $scope.showPopup = function () {

        };
    })

    .controller('PlaylistsCtrl', function ($scope, $ionicModal, $cordovaSQLite, $state) {
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

            var query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
                $scope.modal.hide();
                $scope.topics.push({id: res.insertId, topic_name: $scope.data.topic_name});
                alert("Create new topic success.");
                $state.go("app");
            }, function (err) {
                console.error(err);
            });
        };
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams, $state, $cordovaSQLite, $ionicPopup) {

        $scope.items = [];

        var query = "SELECT * FROM item WHERE id_topic = " + $stateParams.id_topic;
        $cordovaSQLite.execute(db, query).then(function (res) {
            $scope.items = [];
            for (var i = 0; i < res.rows.length; i++) {
                $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
            }
        });

        $scope.select_item = function () {
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                }
            });
        };

        $scope.delete_topic = function () {
            $scope.topics.forEach(function (topic) {
                /*if (topic.id == $stateParams.id) {
                 var x = $scope.topics.indexOf($stateParams.id);
                 console.log("param " + $stateParams.id);
                 $scope.topics.splice(x, 1);
                 $state.go('app.playlists');
                 }*/
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
            //alert("play, id: " + $stateParams.id_topic);
            var query = "SELECT * FROM item WHERE id_topic = " + $stateParams.id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                /*for (var i = 0; i < res.rows.length; i++) {
                 $scope.items.push({id: res.rows.item(i).id, id_topic: $stateParams.id_topic, content: res.rows.item(i).content});
                 }*/
                var num = Math.floor(Math.random() * (res.rows.length - 0)) + 0;
                $scope.items.push({id: res.rows.item(num).id, id_topic: $stateParams.id_topic, content: res.rows.item(num).content});
            }, function (err) {
                console.error(err);
            });
        };

        $scope.add_item_to_topic = function (id_topic) {

            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.item_content">',
                title: 'New Item',
                subTitle: 'Add new item to topic',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Add</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.item_content) {
                                e.preventDefault();
                            } else {
                                return $scope.data.item_content;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                var query = "INSERT INTO item (id_topic, content) VALUES (?, ?)";
                $cordovaSQLite.execute(db, query, [id_topic, $scope.data.item_content]).then(function (res) {
                    /*var query = "SELECT * FROM item WHERE id_topic = " + id_topic;
                     $cordovaSQLite.execute(db, query).then(function (res) {
                     $scope.items = [];
                     for (var i = 0; i < res.rows.length; i++) {
                     $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                     }
                     });*/
                    $scope.select_item();
                }, function (err) {
                    console.error(err);
                });
                myPopup.close();
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
        alert("vào play");
        alert($stateParams.id_topic);

        $scope.play_topic = function () {
            var query = "SELECT * FROM item ORDER BY random() WHERE id_topic = " + $stateParams.id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    //console.log("SELECTED -> " + res.rows.item(0).topic_name);
                    $scope.items = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        //alert(res.rows.item(i).topic_name);
                        $scope.items.push({id: res.rows.item(i).id, id_topic: $stateParams.id_topic, content: res.rows.item(i).content});
                    }
                } else {
                    alert("No item, please insert and try again.");
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.stop_topic = function () {
            //stop, back to playlist with id
        }
    });