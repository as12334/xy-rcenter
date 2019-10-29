define(['common/BaseEditPage', 'bootstrapswitch'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editUserForm";
            // this._super(this.formSelector);
            this.bindEvent();
            this.onPageLoad();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            // this._super();
            var _this = this;
            $(_this.formSelector).on("click",".myLayerOk",function () {
                var data_json;
                var shareCredits = $("#shareCredits").text();
                var shareStintOccupy = $("#superStintOccupy").text();
                var a, reg, mesg, value, data = [];
                $("#add-user").find("input").each(function () {
                    if ($(this).attr("type") == "radio" && $(this).attr("checked")) {
                        data.push($(this).attr("name") + ":" + $(this).attr("data-value"));
                    } else if ($(this).attr("type") == "text") {
                        reg = eval($(this).attr("reg"));
                        value = $(this).val();
                        data.push($(this).attr("name") + ":" + value);
                         if ($(this).attr("name") == "result.credits" && parseInt(value) > parseInt(shareCredits)) {
                            _this.myTips({ content: "上级可用餘額：" + shareCredits, obj: $(this), myclick: true });
                            data = false;
                            return false;
                        // } else if ($(this).attr("name") == "result.credits" && parseInt(value) < data_json.maxCredits) {
                        //     _this.myTips({ content: "可“回收”剩餘額度：" + data_json.maxCredits, obj: $(this), myclick: true });
                        //     data = false;
                        //     return false;
                        } else if ($(this).attr("name") == "result.superiorOccupy" && parseInt(value) > parseInt(shareStintOccupy)) {
                            _this.myTips({ content: "上級最高可設占成：" + shareStintOccupy + "%", obj: $(this), myclick: true });
                            data = false;
                            return false;
                        // } else if ($(this).attr("name") == "result.stintOccupy" && value != "-1" && parseInt(value) < data_json.stintOccupyMin) {
                        //     _this.myTips({ content: "下级已分配占成" + data_json.stintOccupyMin + "，可回收占成不可低于" + data_json.stintOccupyMin, obj: $(this), myclick: true });
                        //     data = false;
                        //     return false;
                        } else if ($(this).attr("name") == "result.stintOccupy" && value != "-1" && parseInt(value) > parseInt($("span[name='shareSuperior']").text())) {
                            _this.myTips({ content: "上级最高分配占成" + $("span[name='shareSuperior']").text() + "，限制占成不可高于" + $("span[name='shareSuperior']").text(), obj: $(this), myclick: true });
                            data = false;
                            return false;
                        }
                        else if (reg) {
                            if (!reg.test(value)) {
                                mesg = $(this).attr("mesg");
                                if (mesg) { _this.myTips({ content: mesg, obj: $(this), myclick: true }); }
                                data = false;
                                return false;
                            }
                        }
                    }
                });
                if(data){


                    var value = $("input[name='result.username']").val();
                    $.ajax({
                        loading: true,
                        url: root + "/remote/checkUsername.html",
                        type: "post",
                        dataType:"JSON",
                        data:{"result.username":value,"result.userType":"","result.ownerId":""},

                        success: function (data) {
                            if(!data){
                                _this.myTips({ content: "用戶名已存在！", obj: $(this), myclick: true });
                            }else{
                                var url = '/vSiteUser/saveManagerUser.html'
                                $.ajax({
                                    loading: true,
                                    url: root + url,
                                    type: "post",
                                    dataType:"JSON",
                                    data:$( _this.formSelector).serialize(),

                                    success: function (data) {
                                        alert(data.msg);
                                        if(data.state){
                                            $(".navListBox .onBtn").click();
                                        }
                                    },
                                    error: function (data, state, msg) {
                                        //超时导致后台返回,安全密码验证不做任何处理

                                    }
                                });
                            }
                        },
                        error: function (data, state, msg) {

                        }
                    });
                }

            });



            //用户名验证
            // $(_this.formSelector).on("blur","input[name='result.nickname']",function () {
            //     var value = $(this).val();
            //     $.ajax({
            //         loading: true,
            //         url: root + "/remote/checkUsername.html",
            //         type: "post",
            //         dataType:"JSON",
            //         data:{"result.username":value},
            //
            //         success: function (data) {
            //             if(!data){
            //                 _this.myTips({ content: "用戶名已存在！", obj: $(this), myclick: true });
            //             }
            //         },
            //         error: function (data, state, msg) {
            //             //超时导致后台返回,安全密码验证不做任何处理
            //
            //         }
            //     });
            // });


        },

        onPageLoad: function () {
            var _this = this;

            $(_this.formSelector).on("change","select[name='set_water']",function () {

                $("input[name='water']").val($(this).val());
            });


            $(_this.formSelector).on("change","input[name='stintId']",function () {

                if($(this).val() == 'yes'){
                    $("input[name='result.stintOccupy']").hide();
                    $("input[name='result.stintOccupy']").val("-1");
                }else {
                    $("input[name='result.stintOccupy']").show();
                    $("input[name='result.stintOccupy']").val("0");
                }
            });
            _this.getSubInfo($("select[name='result.ownerId']").val());
        },

        //獲取上級資料
        getSubInfo : function(userId){

            $.ajax({
                loading: true,
                url: root + "/vSiteUser/getSubInfo.html",
                type: "post",
                dataType:"JSON",
                data:{"search.id":userId},
                success: function (data) {
                    $("#shareCredits").text(data.shareCredits);
                    $("#superStintOccupy").val(data.superiorOccupy);
                },
                error: function (data, state, msg) {

                }
            });

            var superCredit = $("select[name='shareName']").find("option:selected").data("credit");
            $("#shareCredits").text(superCredit);

        },
        myTips: function (msg) {
            var content = msg.content;
            var elmOffset = msg.obj.offset();
            var _top = msg.top || 3;
            var _left = msg.left || 10;
            var top = msg.top || elmOffset.top - _top; //控件top坐標
            var left = msg.left || elmOffset.left + msg.obj.width() + _left; //控件left坐標
            var myDiv = "<div id='myxTips' style='left:" + left + "px; top:" + top + "px;'><div id='myxTipsLeft'></div><div id='myxTipsContent'>" + content + "</div></div>";
            $("#myxTips").remove();
            $("body").append(myDiv);
            if (msg.myclick) {
                var count = 0;
                $("body").unbind("click").click(function () {
                    count++;
                    if (count > 1) {
                        $("#myxTips").remove();
                        $("body").unbind("click");
                    }
                });
            }
        },
        saveCallbakUser : function () {
            $(".navListBox .onBtn").click();
        }
    })
});