var db = null;

angular.module('starter.controllers', ['ngCordova', 'ionic'])

    //Menu
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $stateParams, $state, $cordovaSQLite, $ionicLoading) {

        $scope.topics = [];
        $scope.items = [];
        $scope.data = {};

        $scope.menu_button = 1;

        $ionicLoading.show({
            template: "<i class='ion ion-load-a'>Loading, please wait...</i>",
            animation: 'fade-in',
            noBackdrop: true
        });

        setTimeout(function () {
            $ionicLoading.hide();
            var query = "SELECT * FROM topic ORDER BY id DESC";
            $cordovaSQLite.execute(db, query, []).then(function (res) {
                var topic_list =[];

                for (var i = 0; i < res.rows.length; i++) {
                    topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
                $scope.topics = topic_list;
            });
        }, 10000);

        //Onload:
        $scope.$watch("model", function (value) {

            /*var query = "SELECT * FROM topic";
             $cordovaSQLite.execute(db, query).then(function (res) {
             $scope.topics = [];
             for (var i = 0; i < res.rows.length; i++) {
             $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
             }
             alert("$watch");
             }, function (err) {
             console.error(err);
             });*/

            /*$scope.menu_button_click();
             setTimeout(function () {

             }, 100);*/
        }, true);

        /*$scope.select_item = function () {
         var query = "SELECT * FROM item ORDER BY id DESC";
         $cordovaSQLite.execute(db, query).then(function (res) {
         $scope.items = [];
         for (var i = 0; i < res.rows.length; i++) {
         $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
         }
         alert($scope.items);
         });
         };*/
        //Menu button:
        $scope.menu_button_click = function () {
            if ($scope.menu_button == 1) {
                $scope.select_topic();
                $scope.menu_button = 0;
            }
        };

        //Select all topic from data:
        $scope.select_topic = function () {

            var query = "SELECT * FROM topic ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.topics = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
            }, function (err) {
                console.error(err);
            });
        };

        /*$scope.select_items = function (id_topic) {
         var query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY ID DESC";
         $cordovaSQLite.execute(db, query).then(function (res) {
         $scope.items = [];
         for (var i = 0; i < res.rows.length; i++) {
         $scope.items.push({id: res.rows.item(i).id, id_topic: id_topic, content: res.rows.item(i).content});
         }
         }
         }, function (err) {
         console.error(err);
         });
         };*/

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
            $scope.title = $scope.data.topic_name;
            var query = "INSERT INTO topic (topic_name) VALUES (?)";
            $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
                $scope.have_title = true;
                $state.go("app.topic", {id_topic: res.insertId});
            }, function (err) {
                alert(err);
            });
            $scope.select_topic();
            $scope.close_new_topic();
            $scope.menu_button = 0;
        };

        //Rename topic:
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
            var query = "DELETE FROM topic WHERE id = ?";
            $cordovaSQLite.execute(db, query, [id_topic]).then(function (res) {
                $scope.select_topic();
            }, function (err) {
                alert(err);
            });
        };
    })

    .controller('HomeCtrl', function ($scope, $ionicModal, $cordovaSQLite, $state) {

        $scope.$watch("model", function (value) {

            var query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.topics = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
                alert("$watch");
            }, function (err) {
                console.error(err);
            });


        }, true);
        //Create modal (popup)
        /*$ionicModal.fromTemplateUrl('templates/login.html', {
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
         };*/

        //Insert new topic.
        /*$scope.insert_topic = function () {

         var query = "INSERT INTO topic (topic_name) VALUES (?)";
         $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
         $scope.modal.hide();
         var query = "SELECT * FROM topic";
         $cordovaSQLite.execute(db, query).then(function (res) {
         $scope.topics = [];
         for (var i = 0; i < res.rows.length; i++) {
         $scope.topics.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
         }
         }, function (err) {
         console.error(err);
         });
         */
        /*$scope.topics.push({id: res.insertId, topic_name: $scope.data.topic_name});
         alert("Create new topic success.");
         $state.go("app");*/
        /*
         }, function (err) {
         console.error(err);
         });
         };*/
    })

    .controller('TopicCtrl', function ($scope, $stateParams, $state, $cordovaSQLite, $ionicPopup) {

        var id_topic = $stateParams.id_topic;
        $scope.data.id_topic = id_topic;
        $scope.$watch("model", function () {

            if ($scope.have_title == true) {
            } else {
                var query = "SELECT topic_name FROM topic WHERE id = " + id_topic;
                $cordovaSQLite.execute(db, query).then(function (res) {
                    $scope.title = res.rows.item(0).topic_name;
                });
            }

            query = "SELECT * FROM item WHERE id_topic = " + $scope.data.id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                }
            });
        }, true);

        //Select all item in topic:
        $scope.select_item_in_topic = function () {
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                }
            }, function (err) {
                alert("Lỗi 246: " + JSON.stringify(err));
            });
        };

        //Add item to topic:
        $scope.add_item_to_topic = function () {
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
                if ($scope.data.item_content) {
                    var query = "INSERT INTO item (id_topic, content) VALUES (?, ?)";
                    $cordovaSQLite.execute(db, query, [id_topic, $scope.data.item_content]).then(function (res) {
                        $scope.select_item_in_topic();
                        $scope.items.unshift({id: res.insertId, id_topic: id_topic, content: $scope.data.item_content});
//                    alert("Add " + $scope.data.item_content + " to " + id_topic + " success!")
                    }, function (err) {
                        console.error(err);
                    });
                }
                else {
                    //
                }
                myPopup.close();
            });
        };

        $scope.edit_item = function (id, content) {
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.content" placeholder="New!!!" ng-value="ee">',
                title: 'Change item',
                subTitle: 'Edit?',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.content) {
                                e.preventDefault();
                            } else {
                                return $scope.data.content;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                var query = "UPDATE item SET content = ? WHERE id = ?";
                $cordovaSQLite.execute(db, query, [$scope.data.content, id]).then(function (res) {
                    $scope.select_item_in_topic();
                }, function (err) {
                    alert(err);
                });
                myPopup.close();
            });
        };

        $scope.delete_item = function (id_item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete this item?',
                template: 'Are you sure you want to delete this item?'
            });
            confirmPopup.then(function (res) {
                if (res) {
//                    alert("ok, id: " + id_item);
                    var query = "DELETE FROM item WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [id_item]).then(function (res) {
                        $scope.select_item_in_topic();

                    }, function (err) {
                        alert("Có lỗi 336: " + JSON.stringify(err));
                    });
                } else {
                    //console.log('You are not sure');
                }
            });

        };

        $scope.play = function () {

            $scope.data.id_topic = $stateParams.id_topic;
            var query = "SELECT * FROM item WHERE id_topic = " + $stateParams.id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, id_topic: $stateParams.id_topic, content: res.rows.item(i).content});
//                    $scope.data.items_array.push({id: res.rows.item(i).id, id_topic: $stateParams.id_topic, content: res.rows.item(i).content});
                }
                $scope.data.max = res.rows.length;
                $state.go("app.play");
            }, function (err) {
                console.error(err);
            });
        };

        $scope.no_item = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'No item!',
                template: 'Please add item and try again.'
            });
            /*alertPopup.then(function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
             });*/
        }
    })

    .controller('BrowseCtrl', function ($scope, $cordovaSQLite, $stateParams) {

        alert($stateParams.id_topic);
        /*$scope.insert_topic_browse = function () {
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
         };*/
    })
    .controller('PlayCtrl', function ($scope, $stateParams, $cordovaSQLite, $state) {

        var id_topic = $scope.data.id_topic;
        var max = $scope.data.max;

        $scope.play_random = function () {
            var number_random = Math.floor(Math.random() * (max - 0)) + 0;
            var query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items = [];
                $scope.item_random = [];
                $scope.item_random.push({id: res.rows.item(number_random).id, id_topic: id_topic, content: res.rows.item(number_random).content});
                $scope.data.max = res.rows.length;

            }, function (err) {
                console.error(err);
            });
        };

        $scope.stop_topic = function () {
            $state.go("app.topic", {id_topic: id_topic});
        }
    });