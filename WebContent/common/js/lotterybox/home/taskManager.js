/**
 * Created by ke on 15-6-26.
 */
define(['common/BasePage','moment'], function (BasePage, Moment) {
    return BasePage.extend({
        tones:null,
        timeInterval:null,
        dateTimeFromat:"",

        init: function () {
            var _this = this;
            _this._super();
            _this.syncUserTime();
            _this.showTask();
            _this.unTaskList();
            _this.playerNumTimer();
            _this.countTaskNum();
        },

        bindEvent: function () {
            this._super();
        },
        /**
         * 显示/关闭消息下拉框
         */
        showTask: function () {
            $('.tasks').children('a').click(function () {
                var href = $(this).attr("data-href");
                if ($(this).attr("aria-expanded") != 'true') {
                    if (href.indexOf("?_t") > -1) {
                        var arr = href.split("?");
                        href = arr[0] + "?_t=" + new Date().getTime();
                    } else {
                        href = href + "?_t=" + new Date().getTime();
                    }
                    $(this).parent().find('dl').load(href);
                }
            });
        },
        unTaskList: function () {
            var _this = this;
            _this.queryTones();
            var tones = window.top.tones;
            if ($("#unTaskList").text().length > 0) {
                var unTaskList = $.parseJSON($("#unTaskList").text());
                _this.playAudio(tones, unTaskList, 0);
            }
        },
        playAudio: function (tones, unTaskList, pindex) {
            var _this = this;
            var found = false;
            for (var i = pindex; i < unTaskList.length; i++) {
                var task = unTaskList[i];
                for (var index = 0; index < tones.length; index++) {
                    var tone = tones[index];
                    if (task.toneType == tone.paramCode) {
                        popUp.audioplayer("task_" + tone.paramCode, tone.paramValue, false, function () {
                            _this.playAudio(tones, unTaskList, i + 1);
                        });
                        found = true;
                        break;
                    }

                }
                if (found) {
                    break;
                }
            }

        },
        /**
         * 定时计算任务数量　声音提醒 共用方法
         */
        timingCountTask: function () {
            var _this = this;
            // window.top.topPage.ajax({
            //     url: root + "/vTaskReminder/index/timingCountTask.html",
            //     dataType: "json",
            //     type: "POST",
            //     success: function (data) {
            //         var taskCount = data.taskCount;
            //         $("#unReadTaskCount").text(taskCount);
            //         var tasks = data.tasks;
            //         var voices = data.taskVoice;
            //         if (tasks && voices) {
            //             //存款
            //             if (tasks.sysDeposit > 0 || tasks.comDeposit) {
            //                 popUp.playVoice('', 'deposit');
            //             }
            //             //玩家取款
            //             if (tasks.playerWithdraw > 0) {
            //                 popUp.playVoice('', 'draw');
            //             }
            //             //优惠审核
            //             if (tasks.favorable > 0) {
            //                 popUp.playVoice('', 'audit');
            //             }
            //         }
            //
            //     },
            //     error: function (event, xhr, settings) {
            //         console.log(xhr);
            //     }
            // })
        },
        countTaskNum: function () {
            var _this = this;
            var taskNumberLastTime = window.top.topPage.taskNumberLastTime;
            var time = new Date().getTime();
            if (taskNumberLastTime && (time - taskNumberLastTime) < 60 * 1000) {
                console.log("任务数量更新：还未到刷新时间,上一次刷新时间:" + taskNumberLastTime);
                //任务调度器　已存在不重复添加
                var taskNumTimer = window.top.topPage.taskNumTimer;
                if (taskNumTimer) {
                    return;
                }
            } else {
                _this.timingCountTask();
                window.top.topPage.taskNumberLastTime = time;
            }

            //1分钟定时查询一次
            var taskNumTimer = setTimeout(function () {
                _this.countTaskNum();
            }, 60 * 1000);
            window.top.topPage.taskNumTimer = taskNumTimer;
        },
        queryTones: function () {
            var _this = this;
            if (!window.top.tones) {
                window.top.topPage.ajax({
                    url: root + '/index/queryTones.html',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        window.top.tones = data;
                    }
                })
            } else {
                return window.top.tones;
            }
        },
        playerNumTimer: function () {
            var _this = this;
            var playerNumberLastTime = window.top.topPage.playerNumberLastTime;
            var time = new Date().getTime();
            if (playerNumberLastTime && (time - playerNumberLastTime) < 60 * 1000) {
                console.log("在线玩家数：还未到刷新时间,上一次刷新时间" + playerNumberLastTime);
                var playerNumberTimer = window.top.topPage.playerNumberTimer;
                if (playerNumberTimer) {
                    return;
                }
            } else {
                window.top.topPage.playerNumberLastTime = new Date().getTime();
                // window.top.topPage.ajax({
                //     url: root + "/merchant/account/playerOnline/playerNum.html",
                //     dataType: "json",
                //     success: function (data) {
                //         $("#onlinePlayerNum").text(data.onlinePlayerNum);
                //         $("#activePlayerNum").text(data.activePlayerNum);
                //     },
                //     error: function (event, xhr, settings) {
                //         console.log(xhr);
                //     }
                // });
            }
            var playerNumberTimer = setTimeout(function () {
                _this.playerNumTimer();
            }, 60 * 1000);
            window.top.topPage.playerNumberTimer = playerNumberTimer;
        },
        /**
         * 与服务器同步用用户时间，修正误差
         */
        syncUserTime:function(){
            var _this=this;
            window.top.topPage.ajax({
                url:root + '/index/getUserTimeZoneDate.html',
                dataType:"json",
                success:function(data){
                    _this.dateTimeFromat=data.dateTimeFromat;
                    $(".clock-show").text(data.dateTime);
                    $(".clock-show").attr("time",data.time);
                    $(".clock-show").css("display","inline");
                    //$(".nav-shadow .clock-show label").text(data.dateTime);
                    window.setTimeout(function() {
                        _this.syncUserTime();
                    }, 360000);
                    if(_this.timeInterval!=null) {
                        window.clearInterval(_this.timeInterval);
                    }
                    _this.timeInterval=window.setInterval(function () {
                        if (_this.dateTimeFromat != undefined) {
                            var date = new Date();
                            date.setTime(parseInt($(".clock-show").attr("time"))+1000);
                            $(".clock-show").attr("time",date.getTime());
                            var themoment = new Moment(date);
                            themoment.utcOffset(data.timeZone, false);
                            window.top.utcOffSet = data.timeZone;
                            $(".clock-show").text(themoment.format(_this.dateTimeFromat));
                        }
                    },1000);
                }
            });
        }
    });
});