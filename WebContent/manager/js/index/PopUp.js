define(['lb/components/PopUp'], function (PopUp) {

    return PopUp.extend({
        tones: null,
        init: function () {
            this._super();
        },
        popUpCallBack: function (data) {
            console.info("订阅类型为MCENTER-popUp-Notice的订阅点收到消息，成功调用回调函数，参数值为" + data);
        },

        /**
         * 采集器报警弹窗
         * @param data
         * @constructor
         */
        bossLotteryResultGather: function (data) {
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), dateFormat.daySecond);
            window.top.popUp.popUpMessage(date,'attack','开奖结果','/boss/lottery/result/list.html','采集彩种:' + msgBody.codeName + '&nbsp;采集期数:'+ msgBody.expect + '&nbsp;' + msgBody.message);
        },

        /**
         * 开奖结果校验弹窗
         * @param data
         * @constructor
         */
        bossLotteryResultValid: function (data) {
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), dateFormat.daySecond);
            window.top.popUp.popUpMessage(date,'attack','开奖结果','/boss/lottery/result/list.html', msgBody.message);
        },
        /**
         * 彩票失败报警弹窗
         * @param data
         * @constructor
         */
        bossLotteryError: function (data) {
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), dateFormat.daySecond);
            window.top.popUp.popUpMessage(date,'attack',msgBody.title,'/boss/lottery/lotteryError/list.html', '彩种:' + msgBody.code + '&nbsp;期数:' + msgBody.expect + msgBody.message);
        },
        /**
         * 初始化报警弹窗
         * @param data
         * @constructor
         */
        bossLotteryResultInit:function(data){
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), dateFormat.daySecond);
            window.top.popUp.popUpMessage(date,'order','开奖结果','/boss/lottery/result/list.html','初始化时间:' + msgBody.initDate + '&nbsp;' + msgBody.message);
        },
        shareholderLotteryResultReminder: function (data) {
            var msgBody = $.parseJSON(data).msgBody;
            console.log("shareholder:"+msgBody);
        },
        merchantLotteryResultReminder: function (data) {
            var msgBody = $.parseJSON(data).msgBody;
            console.log("merchant:"+msgBody);
        },
        distributorLotteryResultReminder: function (data) {
            var msgBody = $.parseJSON(data).msgBody;
            console.log("distributor:"+msgBody);
        },
        popUpMessage:function(date,voiceType,tableName,url,text){
            var content = '<a nav-target="mainFrame" add-table="addTable" tab-name="'+tableName+'" name="tellerReminder" href="'+url+'">' + date + '&nbsp;' + text + '</a>';
            popUp.pop(content, date, "warning");
            window.top.popUp.playVoice(date, voiceType);
            $("a[name=tellerReminder]").click(function (e) {
                e.preventDefault();
                window.top.topPage._doNavigate(e);
                $(e.currentTarget).parent().parent().parent().remove()
            });
        },
        /**
         * 采集器报警弹窗
         * @param data
         * @constructor
         */
        gatherWarnningpopUpCallBack: function (data) {
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), window.top.dateFormat.daySecond);
            var content;
            content = msgBody.content;
            popUp.pop(content+"</br><a style='color: #cc5167;text-decoration:underline;' href='/gather/gatherHistory/list.html?name=alarmMessage' nav-target='mainFrame' add-table='addTable' >报警历史</a>", date, "success");
            $("a[name=tellerReminder]").click(function (e) {
                $(e.currentTarget).parent().parent().parent().remove();
            });
            if ($("#timer .hd").attr("data-value") == 'refresh') {
                $(".companySearcnSpan").click();
            }
            // popUp.unReadNotice(data);
            window.top.popUp.playVoice(data, "gather");
            $("#unReadTaskCount").text(parseInt($("#unReadTaskCount").text()) + 1);
        },
        /**
         * 新订单报警弹窗
         * @param data
         */
        newBillPopUpCallBack: function(data){
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), window.top.dateFormat.daySecond);
            var billNo = msgBody.billNo;
            var user = msgBody.user;
            popUp.pop("玩家："+user+"，下注成功，订单号：<a href='/member/bet/search.html?search.billNo="+billNo+"' nav-target='mainFrame' add-table='addTable' tab-name='注单查询'>"+billNo+"</a>", date, "success");
            $("a[name=tellerReminder]").click(function (e) {
                $(e.currentTarget).parent().parent().parent().remove();
            });
            if ($("#timer .hd").attr("data-value") == 'refresh') {
                $(".companySearcnSpan").click();
            }
            // popUp.unReadNotice(data);
            window.top.popUp.playVoice(data, "bill");
            $("#unReadTaskCount").text(parseInt($("#unReadTaskCount").text()) + 1);
        },


        queryTones: function () {
            //每次都去那最新的
            /*if (!window.top.tones) {*/
                window.top.topPage.ajax({
                    url: root + '/index/queryTones.html',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        window.top.tones = data;
                    }
                })
            /*}else {
                return window.top.tones;
            }*/
        },

        playVoice: function (data, type) {
            window.top.popUp.queryTones();
            var tones = window.top.tones;
            setTimeout(function () {
                for (var index = 0; index < tones.length; index++) {
                    var tone = tones[index];
                    if (type == tone.paramCode) {
                        console.log("active = "+tone.active);
                        console.log("进来了...");
                        if (!tone.active) {
                            console.log(type + "的声音偏好设置被关闭")
                        } else{
                            console.log("声音："+tone.paramValue)
                            window.top.popUp.audioplayer(type, tone.paramValue);
                        }
                    }
                }
            }, 1000);
        },


        /**
         *
         * @param id 播放器ID
         * @param file 音频文件
         * @param loop 是否循环
         * @param callback 播放结束回调
         */
        audioplayer: function (id, file, loop, callback) {
            // var audioplayer = document.getElementById(id);
            // if (audioplayer != null) {
            //     if (!!window.ActiveXObject || "ActiveXObject" in window) {// IE
            //         var embed = document.embedPlay;
            //     } else {
            //         audioplayer.play();
            //         if (callback != undefined) {
            //             //如何判断声音播放结束
            //             //update by jerry
            //             setTimeout(function () {
            //                 callback();
            //             }, 3000);
            //         }
            //     }
            //
            //     return;
            //     //document.body.removeChild(audioplayer);
            // }

            if (typeof(file) != 'undefined') {
                if (!!window.ActiveXObject || "ActiveXObject" in window) {// IE

                    var player = document.createElement('embed');
                    $(player).addClass("hide");
                    player.id = id;
                    player.src = resRoot + '/' + file;
                    //player.setAttribute('autostart', 'true');
                    if (loop) {
                        player.setAttribute('loop', 'infinite');
                    }
                    $("#auto_alert").append(player);
                    var embed = document.embedPlay;
                    if (callback != undefined) {
                        //如何判断声音播放结束
                        setTimeout(function () {
                            callback();
                        }, 3000);

                    }
                } else {
                    // Other FF Chome Safari Opera
                    var player = document.createElement('audio');
                    $(player).addClass("hide");
                    player.id = id;
                    //player.setAttribute('autoplay','autoplay');
                    if (loop) {
                        player.setAttribute('loop', 'loop');
                    }
                    $("#auto_alert").append(player);

                    var mp3 = document.createElement('source');
                    mp3.src = resRoot + '/' + file;
                    mp3.type = 'audio/mpeg';
                    player.appendChild(mp3);
                    player.play();
                    if (callback != undefined) {
                        var is_playFinish = setInterval(function () {
                            if (player.ended) {
                                callback();
                                window.clearInterval(is_playFinish);
                            }
                        }, 10);
                    }
                }
            }
        },
        /**
         *存款弹窗 刷新页面，声音
         * @param data
         */
        merchantDepositAndWithdraw: function (data) {
            //弹窗
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.date), dateFormat.daySecond);
            var tabName;
            var url;
            var type;
            if(msgBody.code =="system_deposit"){
                tabName ="系统存款审核";
                url ="/finance/artificialDeposit/queryArtificialDepositList.html";
                type = "sysDeposit";
            }else if(msgBody.code =="online_pay"){
                tabName ="线上支付审核";
                url ="/billDeposit/online/queryBillOnlineList.html";
                type = "onlinePay";
            }else if(msgBody.code =="company_income"){
                tabName ="公司入款审核";
                url ="/billDeposit/company/queryBillCompanyList.html";
                type = "deposit";
            }else if(msgBody.code =="system_withdraw"){
                tabName ="系统取款审核";
                url ="/finance/artificialWithdraw/queryWithdrawSystemList.html";
                type = "sysDraw";
            }else if(msgBody.code =="player_withdraw"){
                tabName ="玩家取款审核";
                url ="/finance/playerWithdraw/queryWithdrawPlayerList.html";
                type = "draw";
            }
            var content = '<a nav-target="mainFrame" add-table="addTable" tab-name="'+tabName+'" name="tellerReminder" href="'+url+'">' + msgBody.message + '</a>';
            popUp.pop(content, date, "success");
            //刷新页面
            window.top.popUp.merchantDepositCallBack(msgBody.code);
            //声音
            window.top.popUp.playVoice(data, type);
        },
        /**
         * 系统公告消息弹窗/声音
         * @param data
         */
        systemAnnouncement: function (data) {
            var msgBody = $.parseJSON(data).msgBody;
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.createTime), dateFormat.daySecond);
            var url = "/merchant/system/systemAnnouncement/view.html?search.id="+msgBody.id+"&search.queryLanguage=zh_CN";
            var content = '<a nav-target="mainFrame" add-table="addTable" tab-name="公告消息" name="tellerReminder" href="'+url+'">公告:'+msgBody.zh_CN+'</a>';
            popUp.pop(content, date, "success");
            window.top.popUp.queryTones();
            var tones = window.top.tones;
            setTimeout(function () {
                for (var index = 0; index < tones.length; index++) {
                    var tone = tones[index];
                    if (tone.paramCode == "notice") {
                        window.top.popUp.audioplayer("notice", tone.paramValue);
                    }
                }
            }, 1000);
        },
        /**
         * 系统消息弹窗/声音
         */
        systemMessage: function (data) {
            var msgBody = $.parseJSON(data).msgBody;
            var date = window.top.topPage.formatToMyDateTime(new Date(msgBody.createTime), dateFormat.daySecond);
            var url = "/merchant/system/systemMessage/view.html?search.id="+msgBody.id;
            var content = '<a nav-target="mainFrame" add-table="addTable" tab-name="公告消息" name="tellerReminder" href="'+url+'">消息:'+msgBody.title+'</a>';
            popUp.pop(content, date, "success");
            window.top.popUp.queryTones();
            var tones = window.top.tones;
            setTimeout(function () {
                for (var index = 0; index < tones.length; index++) {
                    var tone = tones[index];
                    if (tone.paramCode == "notice") {
                        window.top.popUp.audioplayer("notice", tone.paramValue);
                    }
                }
            }, 1000);
        },

        /**
         * 刷新页面
         */
        merchantDepositCallBack: function (code) {
            var form;
            if(code =="system_deposit"){
                form = "#artificialDepositForm";
            }else if(code =="online_pay"){
                form = "#onlineDepositForm";
            }else if(code =="company_income"){
                form = "#companyDepositForm";
            }else if(code =="system_withdraw"){
                form = "#systemWithdrawForm";
            }else if(code =="player_withdraw"){
                form = "#playerWithdrawListForm";
            }
            if ($(form+" .timer .hd").attr("data-value") == 'refresh') {
                if (code == 'company_income') {
                    $(".companyDepositSearcnSpan").click();
                } else if (code == 'online_pay') {
                    $(".onlineDepositSearcnSpan").click();
                } else if (code == 'system_deposit') {
                    $(".systemDepositSearcnSpan").click();
                }else if(code =="system_withdraw"){
                    $(".systemWithdrawSearcnSpan").click();
                }else if(code =="player_withdraw"){
                    $(".playerWithdrawSearcnSpan").click();
                }
            }
        },


    });
});