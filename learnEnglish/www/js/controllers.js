var db = null;
var query = "";
angular.module('starter.controllers', ['ngCordova', 'ionic'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $stateParams, $state, $cordovaSQLite, $ionicLoading, $ionicPlatform) {

        $scope.topics = [];
        $scope.items = [];
        $scope.data = {};

        $ionicLoading.show({template: "<i class='ion ion-loading-c'></i> Loading, please wait...", noBackdrop: false});

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

            query = "SELECT * FROM tutorial";
            $cordovaSQLite.execute(db, query, []).then(function (res) {
                if (res.rows.length == 0) {
                    $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (1, 'start_flag', 'false')");
                    $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (2, 'create_topic_flag', 'false')");
                    $cordovaSQLite.execute(db, "INSERT INTO tutorial (id, flag_name, status) VALUES (3, 'create_item_flag', 'false')");
                    $scope.data.tutorial = "true";
                }
                //sau này thêm vị trí flag luôn
                $scope.flag();
            });
        }, 10000);

        $scope.flag = function () {
            //position
            query = "SELECT * FROM tutorial";
            $cordovaSQLite.execute(db, query, []).then(function (res) {
                if (res.rows.length > 0) {
                    var tutorial_list = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        tutorial_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name});
                    }
                    $scope.data.tutorial_list = tutorial_list;

                    $scope.data.start_flag = res.rows.item(0).status;
                    $scope.data.create_topic_flag = res.rows.item(1).status;
                    $scope.data.create_item_flag = res.rows.item(2).status;
//                    alert($scope.data.start_flag + " " + $scope.data.create_topic_flag+ " " + $scope.data.create_item_flag);

                    if ($scope.data.start_flag == 'false') {

                        var confirmPopup = $ionicPopup.confirm({
                            title: '<h4>Welcome to Easy to learn English.</h4>',
                            template: 'First time use this app, do you want to take tutorial?',
                            okText: "Yes!",
                            cancelText: "No, leave me alone."
                            //cssClass: '<link href="css/style.css" rel="stylesheet">'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                //nếu chọn tutorial thì change status từng cái
//                                $ionicLoading.show({
//                                    template: "<div><img src='img/tutorial_1.png'></div></div>",
//                                    noBackdrop: false,
//                                    duration: 5000,
//                                    hideOnStateChange: true
//                                });
                                var alertPopup = $ionicPopup.alert({
                                    title: '<h4>About Easy to learn English (ELTE)</h4>',
                                    template: 'Giới thiệu... Bla bla bla... <br> First, click "+ New Topic" to create topic.',
                                    okText: ':O'
                                });
                                alertPopup.then(function (res) {
                                    query = "UPDATE tutorial SET status = 'true' WHERE id = 1";
                                    $cordovaSQLite.execute(db, query, []).then(function (res) {
                                    }, function (err) {
                                        alert(JSON.stringify(err));
                                    });
                                });
                            } else {
                                //Còn nếu nó không muốn thì set true hết luôn
                                query = "UPDATE tutorial SET status = 'true'";
                                $cordovaSQLite.execute(db, query, []).then(function (res) {
                                    $ionicLoading.show({
                                        template: "<i class='ion ion-happy'></i> Have fun, if you need a help, click 'Guide' in left menu.",
                                        animation: 'fade-in',
                                        noBackdrop: false,
                                        duration: 3000
                                    });
                                }, function (err) {
                                    alert("Error, line 96: " + JSON.stringify(err));
                                });
                            }
                        });
                    } else {
                        //Không show tutorial nữa vì đây không phải lần đầu. =))
                    }
                }
            });
        };

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
                    $ionicLoading.show({template: 'Create new topic success!', noBackdrop: false, duration: 1000});
                    $scope.insert_topic_flag = true;
                    $scope.data.topic_name_show_header = $scope.data.topic_name;
                    $scope.select_topic();
                    $state.go("app.topic", {id_topic: res.insertId});
                    $scope.close_new_topic();
                }, function (err) {
                    alert(err);
                });
            } else {
                $ionicLoading.show({
                    template: "<i class='ion ion-alert-circled'></i> Topic name can't empty.",
                    animation: 'fade-in',
                    duration: 1500
//                    noBackdrop: false
                });
//                setTimeout(function () {
//                    $ionicLoading.hide();
//                }, 1500)
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
                if ($scope.data.topic_name != topic_name) {

                    query = "UPDATE topic SET topic_name = ? WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [$scope.data.topic_name, id_topic]).then(function (res) {
                        $scope.data.topic_name_show_header = $scope.data.topic_name;
                        $scope.topics = [];
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
//                        $scope.select_topic();
                        /*<= chỗ này*/
                    }, function (err) {
                        console.error(err);
                    });

                    $ionicLoading.show({
                        template: "<i class='ion ion-loading-b'></i> Please wait...",
                        animation: 'fade-in',
                        noBackdrop: false
                    });

                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 2000);

                    myPopup.close();
                }
            });
        };

        $scope.delete_topic = function (id_topic) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete this topic?',
                template: 'Are you sure you want to delete this topic?'
            });
            confirmPopup.then(function (result) {
                if (result) {
                    $ionicLoading.show({
                        template: "<i class='ion ion-loading-b'></i> Deleting...",
                        animation: 'fade-in',
                        noBackdrop: false
                    });
                    query = "DELETE FROM topic WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [id_topic]).then(function (res) {
                        query = "DELETE FROM item WHERE id_topic = ?";
                        $cordovaSQLite.execute(db, query, [id_topic]).then(function (res) {
                            $scope.select_topic();
                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 500);
//                            query = "SELECT * FROM topic ORDER BY id DESC";
//                            $cordovaSQLite.execute(db, query).then(function (res) {
//                                var topic_list = [];
//                                for (var i = 0; i < res.rows.length; i++) {
//                                    topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
//                                }
//                                $scope.topics = [];
//                                setTimeout(function () {
//                                    $scope.topics = topic_list;
//                                }, 50);
//                                if (id_topic == $scope.data.id_topic_to_delete) {
//                                    $state.go('app.playlists');
//                                }
//                            }, function (err) {
//                                alert("177: " + JSON.stringify(err));
//                            });
                        }, function (err) {
                            alert("190: " + JSON.stringify(err));
                        });
                    }, function (err) {
                        alert("Có lỗi 193: " + JSON.stringify(err));
                    });

                } else {
//                    console.log('You are not sure. :v');
                }
            });
        };

        $scope.guide = function () {
            query = "UPDATE tutorial SET status = 'false'";
            $cordovaSQLite.execute(db, query, []).then(function (res) {
                $scope.flag();
                $state.go("app");
            }, function (err) {
                alert("Error, line 286: " + JSON.stringify(err));
            });
        };
    })

    .controller('HomeCtrl', function ($scope, $ionicModal, $cordovaSQLite, $state) {

        $scope.$watch("model", function (value) {

            query = "SELECT * FROM topic";
            $cordovaSQLite.execute(db, query).then(function (res) {
                var topic_list = [];

                for (var i = 0; i < res.rows.length; i++) {
                    topic_list.push({id: res.rows.item(i).id, topic_name: res.rows.item(i).topic_name})
                }
                $scope.topics = topic_list;

            }, function (err) {
                console.error(err);
            });
        }, true);
    })

    .controller('TopicCtrl', function ($scope, $stateParams, $state, $cordovaSQLite, $ionicPopup, $ionicLoading) {

        var count_items;

        $ionicLoading.show({
            template: "<i class='ion ion-loading-a'></i> Loading...",
            noBackdrop: false
        });

        var id_topic = $stateParams.id_topic;
        $scope.id_topic = id_topic;
        $scope.data.id_topic_to_delete = id_topic;

        setTimeout(function () {
            query = "SELECT topic_name FROM topic WHERE id = " + id_topic;
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.data.topic_name_show_header = res.rows.item(0).topic_name;
            });
        }, 100);

        query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
        $cordovaSQLite.execute(db, query).then(function (res) {
            var list_items = [];
            for (var i = 0; i < res.rows.length; i++) {
                list_items.push({id: res.rows.item(i).id, id_topic: res.rows.item(i).id_topic, content: res.rows.item(i).content});
            }
            $scope.items = list_items;
            count_items = list_items.length * 20;
        });

        setTimeout(function () {
            $ionicLoading.hide();
        }, count_items);

        if ($scope.data.create_topic_flag == 'false') {
            var alertPopup = $ionicPopup.alert({
                title: '<h4>Create topic success.</h4>',
                template: 'Topic là nơi... <br> Tiếp theo, thêm vào vài câu xem nào?',
                okText: 'OK.'
            });
            alertPopup.then(function (res) {
                query = "UPDATE tutorial SET status = 'true' WHERE id = 2";
                $cordovaSQLite.execute(db, query, []).then(function (res) {
                    $scope.data.creating_item = true;
                    $scope.data.create_item_count = 1;
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            });
        }

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
                alert("Lỗi 259: " + JSON.stringify(err));
            });
        };

        //Add item to topic:
        $scope.add_item_to_topic = function () {
            $scope.data.item_content = "";
            var myPopup = $ionicPopup.show({
                template: '<textarea  type="text" ng-model="data.item_content" autofocus="true" rows="4"></textarea>',
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
                        $ionicLoading.show({ template: 'Item Added!', noBackdrop: false, duration: 1000});
                        if ($scope.data.creating_item = true) {
                            if ($scope.data.create_item_count < 3) {
//                                alert($scope.data.create_item_count);
                                $ionicLoading.show({ template: 'Thêm ' + 3 - parseInt($scope.data.create_item_count) + ' câu nữa nào.', noBackdrop: false, duration: 2000}); //ê rồ: số xuất ra sai
                                $scope.data.create_item_count++;
                            } else if ($scope.data.create_item_count == 3) {
                                var alertPopup = $ionicPopup.alert({
                                    title: '<h4>Les\'t Play</h4>',
                                    template: 'Vậy là bạn đã có một số câu để bắt đầu rồi đấy, ấn vào nút "play" (hình tam giác xanh lá) ở góc phải phía trên để bắt đầu học nào!!!',
                                    okText: 'OK.'
                                });
                                alertPopup.then(function (res) {
                                    query = "UPDATE tutorial SET status = 'true' WHERE id = 2";
                                    $cordovaSQLite.execute(db, query, []).then(function (res) {
                                        $scope.data.creating_item = false;
                                    }, function (err) {
                                        alert(JSON.stringify(err));
                                    });
                                });
                            }
                        }
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
                template: '<textarea type="text" ng-model="data.item_content" autofocus="true" rows="4">' + content + '</textarea>',
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
                                $ionicLoading.show({ template: "Can't empty!", noBackdrop: false, duration: 1000});
//                                $scope.alert = "Can't empty. 323"
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

                    $ionicLoading.show({
                        template: "<i class='ion ion-loading-b'></i> Deleting...",
                        animation: 'fade-in',
                        noBackdrop: false
                    });

                    query = "DELETE FROM item WHERE id = ?";
                    $cordovaSQLite.execute(db, query, [id_item]).then(function (res) {
                        $scope.select_item_in_topic();

                        setTimeout(function () {
                            $ionicLoading.hide();
                        }, 500);
                        /*query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
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
                         });*/
                    }, function (err) {
                        alert("Có lỗi 292: " + JSON.stringify(err));
                    });

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
                query = "SELECT * FROM topic WHERE id < " + id_topic + " ORDER BY id DESC limit 2";
                $cordovaSQLite.execute(db, query).then(function (res) {
                    if (res.rows.length == 2) {
                        $scope.data.previous = true;
                    } else {
                        $scope.data.previous = false;
                    }
                });
                query = "SELECT * FROM topic WHERE id > " + id_topic + " ORDER BY id ASC limit 2";
                $cordovaSQLite.execute(db, query).then(function (res) {
                    if (res.rows.length == 2) {
                        $scope.data.next = true;
                    } else {
                        $scope.data.next = false;
                    }
                });
//                $scope.set_next_and_previous();
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
            noBackdrop: false
        });

        setTimeout(function () {
            $ionicLoading.hide();
            $scope.play_random();
        }, 2000);

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
            query = "SELECT * FROM topic WHERE id < " + id_topic + " ORDER BY id DESC limit 2";
            $cordovaSQLite.execute(db, query).then(function (res) {

                $scope.set_next_and_previous("previous");
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
                                noBackdrop: false
                            });

                            $scope.data.max = res.rows.length;
                            $scope.play_random();

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 1500);

                        } else if (res.rows.length === 0) {
                            $scope.previous_topic();
                        }
                    }, function (err) {
                        alert(err);
                    });
                    //Nếu không:
                } else {
                    $ionicLoading.show({
                        template: "<h4><i class='ion ion-sad'> No topic to previous.</i></h4>",
                        animation: 'fade-in',
                        noBackdrop: false
                    });

                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                }
            }, function (err) {
                alert("Lỗi 386: " + JSON.stringify(err));
            });
        };

        $scope.next_topic = function () {

            //Get next topic id:
            query = "SELECT * FROM topic WHERE id > " + id_topic + " ORDER BY id ASC limit 2";
            $cordovaSQLite.execute(db, query).then(function (res) {

                $scope.set_next_and_previous("next");
                //Nếu có topic sau đó:
                if (res.rows.length) {

                    $scope.data.id_topic = res.rows.item(0).id;
                    id_topic = res.rows.item(0).id;
                    $scope.data.topic_name_show_header = res.rows.item(0).topic_name;

                    var name = res.rows.item(0).topic_name;

                    //Select items in next topic:
                    $scope.data.id_topic = id_topic;
                    query = "SELECT * FROM item WHERE id_topic = " + id_topic + " ORDER BY id DESC";
                    $cordovaSQLite.execute(db, query).then(function (res) {
                        if (res.rows.length > 0) {

                            $ionicLoading.show({
                                template: "<h4><i class='ion ion-icecream'> Go next topic: " + name + "</i></h4>",
                                animation: 'fade-in',
                                noBackdrop: false
                            });

                            $scope.data.max = res.rows.length;
                            $scope.play_random();

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 1500);
                        } else if (res.rows.length == 0) {
                            $scope.next_topic();
                        }
                    }, function (err) {
                        alert(err);
                    });
                } else {
                    $ionicLoading.show({
                        template: "<h4><i class='ion ion-sad'> No topic to next.</i></h4>",
                        animation: 'fade-in',
                        noBackdrop: false
                    });

                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                }
            }, function (err) {
                alert("Lỗi 452: " + JSON.stringify(err));
            });
        };

        $scope.set_next_and_previous = function (status) {
            $scope.data.next = true;
            $scope.data.previous = true;

            query = "SELECT * FROM topic WHERE id > " + id_topic + " ORDER BY id ASC limit 2";
            $cordovaSQLite.execute(db, query).then(function (res) {
//                alert("next: " + res.rows.length);
                if (res.rows.length > 1) {
                    $scope.data.next = true;
                } else {
                    $scope.data.next = false;
                }
            });

            query = "SELECT * FROM topic WHERE id < " + id_topic + " ORDER BY id DESC limit 2";

            $cordovaSQLite.execute(db, query).then(function (res) {
//                alert("previous: " + res.rows.length);
                if (res.rows.length > 1) {
                    $scope.data.previous = true;
                } else {
                    $scope.data.previous = false;
                }
            });

            setTimeout(function () {
                if(status == "next"){
                    $scope.data.previous = true;
                }else{
                    $scope.data.next = true;
                }
            },1000);
        }
    });