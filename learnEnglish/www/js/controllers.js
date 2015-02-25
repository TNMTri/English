var db = null;
var query = "";
angular.module('starter.controllers', ['ngCordova', 'ionic'])

    //Menu
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $stateParams, $state, $cordovaSQLite, $ionicLoading, $ionicPlatform) {

        $scope.topics = [];
        $scope.items = [];
        $scope.data = {};

        $ionicLoading.show({
            template: "<i class='ion ion-loading-c'></i> Loading, please wait...",
            animation: 'fade-in',
            noBackdrop: true
        });

        setTimeout(function () {
            $ionicLoading.hide();
            query = "SELECT * FROM topic ORDER BY id DESC";
            $cordovaSQLite.execute(db, query, []).then(function (res) {
                var topic_list = [];
                for (var i = 0; i < res.rows.length; i++) {
                    topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
                $scope.topics = topic_list;
            });
        }, 10000);

        //Select all topic from data:
        $scope.select_topic = function () {

            query = "SELECT * FROM topic ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                var topic_list = [];
                for (var i = 0; i < res.rows.length; i++) {
                    topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
                $scope.topics = topic_list;
            }, function (err) {
                console.error(err);
            });
        };

        //Create modal (popup)
        $ionicModal.fromTemplateUrl('templates/new_topic.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Open new topic modal
        $scope.show_new_topic = function () {
            $scope.data.topic_name = "";
            $scope.modal.show();
        };

        //Close new topic modal
        $scope.close_new_topic = function () {
            $scope.modal.hide();
        };

        //Insert new topic.
        $scope.insert_topic = function () {
            if ($scope.data.topic_name.length > 0) {
                query = "INSERT INTO topic (topic_name) VALUES (?)";
                $cordovaSQLite.execute(db, query, [$scope.data.topic_name]).then(function (res) {
                    $ionicLoading.show({template: 'Creat new topic success!', noBackdrop: true, duration: 1000});
                    $scope.insert_topic_flag = true;
                    $scope.data.topic_name_show_header = $scope.data.topic_name;
                    $scope.select_topic();
                    $scope.close_new_topic();
                    $state.go("app.topic", {id_topic: res.insertId});
                }, function (err) {
                    alert(err);
                });
            } else {
                $ionicLoading.show({
                    template: "<i class='ion ion-alert-circled'></i> Topic name can't empty.",
                    animation: 'fade-in',
                    noBackdrop: true
                });
                setTimeout(function () {
                    $ionicLoading.hide();
                }, 2000)
            }
        };

        //Rename topic:
        $scope.edit_topic_name = function (id_topic, topic_name) {
            $scope.data.topic_name = topic_name;

            //Custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.topic_name" autofocus="true">',
                title: 'Rename Topic',
                subTitle: 'Please enter topic name',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.topic_name) {
                                e.preventDefault();
                            } else {
                                return $scope.data.topic_name;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                query = "UPDATE topic SET topic_name = ? WHERE id = ?";
                $cordovaSQLite.execute(db, query, [$scope.data.topic_name, id_topic]).then(function (res) {
                    $scope.topic_name = "tên đã đổi";
                    $scope.select_topic();
                }, function (err) {
                    console.error(err);
                });
                myPopup.close();
            });
        };

        $scope.delete_topic = function (id_topic) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete this topic?',
                template: 'Are you sure you want to delete this topic?'
            });
            confirmPopup.then(function (result) {
                if (result) {
                    query = "DELETE FROM topic WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [id_topic]).then(function (res) {
                        query = "SELECT * FROM topic ORDER BY id DESC";
                        $cordovaSQLite.execute(db, query).then(function (res) {
                            var topic_list = [];
                            for (var i = 0; i < res.rows.length; i++) {
                                topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                            }
                            $scope.topics = [];
                            setTimeout(function () {
                                $scope.topics = topic_list;
                            }, 50);
                            if (id_topic == $scope.data.id_topic_to_delete) {
                                $state.go('app.playlists');
                            }
                        }, function (err) {
                            alert("147: " + JSON.stringify(err));
                        });
                    }, function (err) {
                        alert("Có lỗi 150: " + JSON.stringify(err));
                    });

                    $ionicLoading.show({
                        template: "<i class='ion ion-loading-b'></i> Deleting...",
                        animation: 'fade-in',
                        noBackdrop: true
                    });

                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 2000);
                } else {
//                    console.log('You are not sure. :v');
                }
            });
        };
    })

    .controller('HomeCtrl', function ($scope, $ionicModal, $cordovaSQLite, $state) {

        $scope.$watch("model", function (value) {

            query = "SELECT * FROM topic";
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
    })

    .controller('TopicCtrl', function ($scope, $stateParams, $state, $cordovaSQLite, $ionicPopup, $ionicLoading) {

        var id_topic = $stateParams.id_topic;
        $scope.id_topic = id_topic;
        $scope.data.id_topic_to_delete = id_topic;

        $scope.$watch("model", function () {

            query = "SELECT topic_name FROM topic WHERE id = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.data.topic_name_show_header = res.rows.item(0).topic_name;
            });

            query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                var list_items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    list_items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                }
                $scope.items = list_items;
            });
        }, true);

        //Select all item in topic:
        $scope.select_item_in_topic = function () {
            query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                var list_item = [];
                for (var i = 0; i < res.rows.length; i++) {
                    list_item.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                }
                $scope.items = list_item;
            }, function (err) {
                alert("Lỗi 246: " + JSON.stringify(err));
            });
        };

        //Add item to topic:
        $scope.add_item_to_topic = function () {
            $scope.data.item_content = "";
            var myPopup = $ionicPopup.show({
                template: '<textarea  type="text" ng-model="data.item_content" autofocus="true" rows="5"></textarea>',
                title: 'New Item',
                subTitle: 'Add new item to topic.',
                scope: $scope,
                buttons: [
                    {   text: 'Cancel',
                        type: 'button',
                        onTap: function (e) {
                            myPopup.close();
                        }
                    },
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
                    query = "INSERT INTO item (id_topic, content) VALUES (?, ?)";
                    $cordovaSQLite.execute(db, query, [id_topic, $scope.data.item_content]).then(function (res) {
                        $scope.items.unshift({id: res.insertId, id_topic: id_topic, content: $scope.data.item_content});
                        $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 1000});
                    }, function (err) {
                        console.error(err);
                    });
                }
                else {
                    //Can't null.
                }
                myPopup.close();
            });
        };

        $scope.edit_item = function (id, content) {
            $scope.data.item_content = content;
            var myPopup = $ionicPopup.show({
                template: '<textarea type="text" ng-model="data.item_content" autofocus="true" rows="5">' + content + '</textarea>',
                title: 'Change Item',
                subTitle: 'Edit?',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.item_content) {
                                //e.preventDefault();
                                $scope.alert = "Can't empty. 259"
                            } else {
                                return $scope.data.item_content;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if ($scope.data.item_content) {
                    query = "UPDATE item SET content = ? WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [$scope.data.item_content, id]).then(function (res) {
                        $scope.items.forEach(function (item) {
                            if (item.id == id) {
                                item.content = $scope.data.item_content;
                            }
                        });
                        $scope.data.item_content = "";
                        $scope.alert = "";
//                        $state.go($state.$current, null, { reload: true });
                        myPopup.close();
                    }, function (err) {
                        alert(err);
                    });
                } else {
                    alert("Can't empty.  284");
                }
            });
        };

        $scope.delete_item = function (id_item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete this item?',
                template: 'Are you sure you want to delete this item?'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    query = "DELETE FROM item WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [id_item]).then(function (res) {
                        query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
                        $cordovaSQLite.execute(db, query).then(function (res) {
                            var list_item = [];
                            for (var i = 0; i < res.rows.length; i++) {
                                list_item.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
                            }
                            $scope.items = [];
                            setTimeout(function () {
                                $scope.items = list_item;
                            }, 50);
                        }, function (err) {
                            alert("Lỗi 311: " + JSON.stringify(err));
                        });
                    }, function (err) {
                        alert("Có lỗi 292: " + JSON.stringify(err));
                    });

                    $ionicLoading.show({
                        template: "<i class='ion ion-loading-b'></i> Deleting...",
                        animation: 'fade-in',
                        noBackdrop: true
                    });

                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 2000);
                } else {
//                    console.log('You are not sure. :v');
                }
            });
        };

        $scope.no_item = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'No item!',
                template: 'Please add item and try again.'
            });
        };

        $scope.play = function () {

            $scope.items_play = [];
            $scope.data.id_topic = $stateParams.id_topic;
            query = "SELECT * FROM item WHERE id_topic = " + $stateParams.id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                var list_items = [];
                for (var i = 0; i < res.rows.length; i++) {
                    list_items.push({id: res.rows.item(i).id, id_topic: $stateParams.id_topic, content: res.rows.item(i).content});
                }
//              alert(res.rows.length);
                $scope.items = list_items;
                $scope.data.max = res.rows.length;
                $state.go("app.play");
            }, function (err) {
                console.error(err);
            });
        }
    })

    .controller('PlayCtrl', function ($scope, $stateParams, $cordovaSQLite, $state, $ionicLoading, $ionicPopup) {

        var id_topic = $scope.data.id_topic;
        var max = $scope.data.max;

        $ionicLoading.show({
            template: "<h4><i class='ion ion-android-hand'> Tap or swipe to learn more...</i></h4>",
            animation: 'fade-in',
            noBackdrop: true
        });

        setTimeout(function () {
            $ionicLoading.hide();
            $scope.play_random();
        }, 3000);

        $scope.play_random = function () {


            $scope.items_play = [];
            max = $scope.data.max;
            id_topic = $scope.data.id_topic;

            var number_random = Math.floor(Math.random() * (max - 0)) + 0;

            query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.items_play.push({id: res.rows.item(number_random).id, id_topic: id_topic, content: res.rows.item(number_random).content});
                $scope.max = res.rows.length;

            }, function (err) {
                console.error(err);
            });
        };

        $scope.stop_topic = function () {
            $scope.items = [];
            $state.go("app.topic", {id_topic: id_topic});
        };

        $scope.previous_topic = function () {
            //Get previous topic id:
            query = "SELECT * FROM topic WHERE id < " + id_topic + " ORDER BY id DESC limit 1";
            $cordovaSQLite.execute(db, query).then(function (res) {
                //Nếu có topic trước đó:
                if (res.rows.length) {

                    $scope.data.id_topic = res.rows.item(0).id;
                    id_topic = res.rows.item(0).id;
                    $scope.data.topic_name_show_header = res.rows.item(0).topic_name;

                    var name = res.rows.item(0).topic_name;

                    //Select items in previous topic:
                    $scope.data.id_topic = id_topic;
                    query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
                    $cordovaSQLite.execute(db, query).then(function (res) {

                        if (res.rows.length > 0) {

                            $ionicLoading.show({
                                template: "<h4><i class='ion ion-coffee'> Go previous topic: " + name + "</i></h4>",
                                animation: 'fade-in',
                                noBackdrop: true
                            });

                            $scope.data.max = res.rows.length;
                            $scope.play_random();

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 3000);

                        } else if (res.rows.length === 0) {
                            $scope.previous_topic();
                        }
                    }, function (err) {
                        alert(err);
                    });
                    //Nếu không:
                } else {
                    alertPopup = $ionicPopup.alert({
                        title: 'No topic to previous.'
                    });
                }
            }, function (err) {
                alert("Lỗi 386: " + JSON.stringify(err));
            });
        };

        $scope.next_topic = function () {

            //Get next topic id:
            query = "SELECT * FROM topic WHERE id > " + id_topic + " ORDER BY id ASC limit 1";
            $cordovaSQLite.execute(db, query).then(function (res) {
                //Nếu có topic sau đó:
                if (res.rows.length) {

                    $scope.data.id_topic = res.rows.item(0).id;
                    id_topic = res.rows.item(0).id;
                    $scope.data.topic_name_show_header = res.rows.item(0).topic_name;

                    var name = res.rows.item(0).topic_name;

                    //Select items in previous topic:
                    $scope.data.id_topic = id_topic;
                    query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
                    $cordovaSQLite.execute(db, query).then(function (res) {
                        if (res.rows.length > 0) {

                            $ionicLoading.show({
                                template: "<h4><i class='ion ion-icecream'> Go next topic: " + name + "</i></h4>",
                                animation: 'fade-in',
                                noBackdrop: true
                            });

                            $scope.data.max = res.rows.length;
                            $scope.play_random();

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 3000);
                        } else if (res.rows.length == 0) {
                            $scope.next_topic();
                        }
                    }, function (err) {
                        alert(err);
                    });
                    //Nếu không:
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'No topic to next.'
                    });
                }
            }, function (err) {
                alert("Lỗi 452: " + JSON.stringify(err));
            });
        }
    });