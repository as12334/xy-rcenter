define(['common/BaseEditPage', 'bootstrapswitch'], function (BaseEditPage) {

    return BaseEditPage.extend({

        init: function () {
            this.formSelector = "#mainFrame #siteParam";
            this._super(this.formSelector);
            this.basicSettingIndex();
        },

        basicSettingIndex:function (e) {
            var _this = this;
            $("#siteParam .sys_tab_wrap").find("li").removeClass("active");
            $(".top_menu>li:first",_this.formSelector).addClass("active");
            var url = $(".top_menu>li:first",_this.formSelector).attr("url");
            window.top.topPage.ajax({
                url: root + url,
                loading: true,
                success: function (data) {
                    $("#content-div",_this.formSelector).html(data);
                    $("#siteParam",_this.formSelector).attr("action", root + url);
                    _this.bindSiteParamEvent();
                    _this.bindFormValidation();
                    $('.help-popover',_this.formSelector).popover();
                    if(e){
                        $(e.currentTarget).unlock();
                    }
                }
            });
        },

        preferenceIndex:function (e,opt) {
            var _this = this;
            $(".sys_tab_wrap",_this.formSelector).find("li").removeClass("active");
            $("#li_top_2",_this.formSelector).addClass("active");
            window.top.topPage.ajax({
                url: root + "/preference/index.html",
                loading: true,
                success: function (data) {
                    $("#content-div").html(data);
                    e.page.preferenced.init();
                    $("#siteParam").attr("action", root + "/preference/index.html");
                    _this.bindPreferenceEvent();
                    _this.bindFormValidation();
                    if(e){
                        $(e.currentTarget).unlock();
                    }
                    _this.onPageLoad();
                }
            });
        },




        onPageLoad: function () {
            this._super();
            var _this = this;
            $('[data-toggle="popover"]',_this.formSelector).popover({
                trigger: 'hover',
                placement: 'right'
            });
        },

        bindEvent: function () {
            this._super();
            var _this = this;
            $(_this.formSelector).on("input",".domainIdEnable", function () {
                //线路域名没填或格式不对，提交按钮禁用
                _this.domainIdEnable($(this));
            })
        },

        userPlayerImportIndex:function (e,opt) {
            var _this = this;
            $(".sys_tab_wrap",_this.formSelector).find("li").removeClass("active");
            $("#li_top_3",_this.formSelector).addClass("active");

            window.top.topPage.ajax({
                url: root + "/vUserPlayerImport/list.html",
                loading: true,
                success: function (data) {
                    $("#content-div").html(data);
                    e.page.importPlayer.init();
                    $("#siteParam").attr("action", root + "/vUserPlayerImport/list.html");
                    if(e){
                        $(e.currentTarget).unlock();
                    }
                }
            });
        },

        toImportPlayer :function (e,opt) {
            var _this=this;
            _this.userPlayerImportIndex(e,opt);
        },

        bindSiteParamEvent:function () {
            var _this = this;
            $(_this.formSelector).on("click", "#traSave", function () {
                window.top.topPage.ajax({
                    url: root + "/siteSysParam/saveTrafficStatistics.html",
                    data:{"result.trafficStatistics":$("#trafficStatistics",_this.formSelector).val(),"result.id":$("#mstId").val()},
                    dataType: 'json',
                    success: function (data) {
                    }
                });
            });
            $(".yzmSelect",_this.formSelector).click(function(){
                var obj = $(this).children().children();
                var src = obj.attr("src");
                var yzmValue = obj.attr("tt");
                $("#yzm",_this.formSelector).attr("src",src);
                $("#yzmValue",_this.formSelector).val(yzmValue);
            });
            this.unInitSwitch($("[name='my-checkbox']",_this.formSelector))
                .bootstrapSwitch(
                    {
                        onSwitchChange: function (e, state) {
                            var area="nations."+$(this).attr("area");
                            var _target = e.currentTarget;
                            var type = $(_target).attr('mold');
                            if (type != "area" || !state && type == "area") {
                                var msg = "";
                                if (type == "area") {
                                    //
                                    msg = window.top.message.setting['basic.areaMsg'];
                                    msg= msg.replace("#",window.top.message.common[area]);
                                } else if (type == "language") {
                                    //开启
                                    msg = window.top.message.setting['basic.languageMsg.' + state];
                                } else {
                                    if (state) {
                                        msg = window.top.message.setting['basic.currencyMsg.' + state];
                                    } else {
                                        //货币

                                        msg = window.top.message.setting['basic.currencyMsg.' + state];
                                        msg = msg.replace("#", $(_target).attr("playerNum"));
                                    }
                                }
                                if (!$(_target).attr("isChanged")) {
                                    var status = $(_target).attr('status');
                                    if(status!='0'&&type=='language'){
                                        if (state) {
                                            _this.modifyText(_target, "1", state);
                                            return;
                                        }
                                    }
                                    window.top.topPage.showConfirmMessage(msg, function (confirm) {
                                        if (confirm) {
                                            $(_target).attr("isChanged", true);
                                            $(_target).bootstrapSwitch("state", !_target.checked);
                                            if(status=='0'){
                                                if(state){
                                                    _this.modifyText(_target, "1", state);
                                                    $(_target).attr('status','1');

                                                }else{
                                                    $(_target).attr('status','0');

                                                }
                                            }else{
                                                if (state) {
                                                    _this.modifyText(_target, "1", state);
                                                } else {

                                                    _this.modifyText(_target, "2", state);
                                                }
                                            }

                                        }
                                    });
                                }
                                else {
                                    $(_target).removeAttr("isChanged");
                                    return true;
                                }
                                return false;
                            } else {
                                //修改状态文字
                                _this.modifyText(_target, "1", state);
                            }


                        }
                    }
                );
            //这里初始化所有的事件
            //展开
            $(_this.formSelector).on("click", ".more", function () {
                var className = $(this).attr("className");
                $(this).removeClass("more");
                $(this).addClass("stop");
                $("." + className).css("display", "block");
                $(this).addClass("dropup");
                var moreId=$(this).attr("moreId");
                $(moreId).text(window.top.message.setting['basic.stop']);
            });
            //收起
            $(_this.formSelector).on("click", ".stop", function () {
                $(this).addClass("more");
                $(this).removeClass("stop");
                var className = $(this).attr("className");
                $("." + className).css("display", "none");
                $(this).removeClass("dropup");
                var moreId=$(this).attr("moreId");
                $(moreId).text(window.top.message.setting['basic.exhibition'+className]);
            });


            //复制语系
            $(_this.formSelector).on("click",".copy", function () {
                var sourceLocal=$(this).attr("local");
                var sourceContent=$(".siteTitle"+sourceLocal,_this.formSelector).val();
                var targetLocal=$(".current",_this.formSelector).attr("local");
                $(".siteTitle"+targetLocal,_this.formSelector).val(sourceContent);

                var sourceContent=$(".siteKeywords"+sourceLocal,_this.formSelector).val();
                var targetLocal=$(".current",_this.formSelector).attr("local");
                $(".siteKeywords"+targetLocal,_this.formSelector).val(sourceContent);

                var sourceContent=$(".siteDescription"+sourceLocal,_this.formSelector).val();
                var targetLocal=$(".current",_this.formSelector).attr("local");
                $(".siteDescription"+targetLocal,_this.formSelector).val(sourceContent);
            });
        },

        /**
         * 恢复系统默认
         * @param e
         * @param option
         */
        resetPreference: function(e,option) {
            var _this = this;
            window.top.topPage.ajax({
                url:root+'/setting/preference/resetPreference.html',
                success:function(data){
                    page.showPopover(e,{"callback":function () {
                        _this.loadingHtml();
                    }},"success",window.top.message.setting['reset.preference.success'],true);
                    //window.top.topPage.showSuccessMessage(window.top.message.setting['reset.preference.success']);

                },
                error:function(data) {
                    page.showPopover(e,{},"danger",window.top.message.setting['reset.preference.fail'],true);
                    //window.top.topPage.showSuccessMessage(window.top.message.setting['reset.preference.fail']);
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 操作成功后，ajax获取页面html refresh
         */
        loadingHtml:function() {
            var obj = {};
            obj.currentTarget = $("#li_top_2",this.formSelector).find("a")[0];
            this.preferenceIndex(obj)
        },

        /**
         * 回调,重新加载页面
         * @param e
         * @param option
         */
        reload:function(e,option) {
            if(e.returnValue){
                this.loadingHtml();
            }

        },


        uploadFile: function (e, opt) {
            e.objId = 1;
            e.catePath = 'ImportPlayer';
            return this.uploadAllFiles(e, opt);
        },

        doAjax:function(e,btnOption) {
            var _this=this;
            var option={
                cache: false,
                eventTarget: {currentTarget:e.currentTarget},
                url:  window.top.root+"/userPlayerImport/saveImport.html",
                beforeSend: function () {
                    $(".save-import",_this.formSelector).attr("disabled",true);
                },
                error: function(request, state, msg) {
                    $(e.currentTarget).unlock();
                    var message = msg;
                    if(request.responseJSON && request.responseJSON.message){
                        message = request.responseJSON.message;
                    }
                    if (request.status != 601) {
                        window.top.topPage.showErrorMessage(message);
                    }
                    $(e.currentTarget).unlock();
                    $(".save-import",_this.formSelector).attr("disabled",false);
                },
                success: function(data) {
                    $("#content-div",_this.formSelector).html(data);
                    //$("#formDiv").hide();
                    //$("#importForm").append(data);
                    $(e.currentTarget).unlock();
                    $(".save-import",_this.formSelector).attr("disabled",false);
                }
            };
            option.type="POST";
            option.contentType=false;
            option.processData=false;
            option.data=_this.getFormData(e,option);
            option.eventTarget={currentTarget: e.currentTarget};
            option.eventCall=function(e){
                window.top.topPage.ajax(option);
            };
            window.top.topPage.ajax(option);
        },
        showFileMsg: function () {
            var _this=this;
            $("#file-div",_this.formSelector).removeClass("hide");
            var f = document.getElementById("playerFilename").files;
            //上次修改时间
            //alert(f[0].lastModifiedDate);
            //名称
            $("#filename-span",_this.formSelector).html(f[0].name);
            //大小 字节
            $("#filesize-span",_this.formSelector).html(this.bytesToSize(f[0].size));
            //类型
            //alert(f[0].type);
        },
        bytesToSize: function (bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000;
            sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            i = Math.floor(Math.log(bytes) / Math.log(k));
            var size = (bytes / Math.pow(k, i));//toFixed
            size = size.toFixed(1);
            return  size + " " + sizes[i];
            //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        myValidateForm: function (e,opt) {
            var f = document.getElementById("playerFilename").files;
            if(f&&f[0]&&f[0].size&&f[0].size>10240000){
                var obj = {};
                obj.currentTarget = $("#playerFilename",_this.formSelector);
                page.showPopover(obj, {}, "warning", "仅支持10M以内，xlsx格式的文件", true);
                $(e.currentTarget).unlock();
                return false;
            }
            if (!this.validateForm(e)) {
                $(e.currentTarget).unlock();
                return false;
            }
            return true;
        },
        domainIdEnable:function (that) {
            var _this = this;
            var checkNum = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
            var domain=that.val();
            if(domain!=""){
                var last = domain.charAt(domain.length - 1);
                if (last == '\n') {
                    domain = domain.substring(0, domain.length - 1);
                }
                var urls = domain.split(",");
                var isDomain = true;
                var badUrl = "";
                var newDomailUrl = "";
                for(var i=0;i<urls.length;i++){
                    var newStr =urls[i].replace(/^\s+|\s+$/g,'');
                    if(!checkNum.test(newStr)){
                        isDomain = false;
                        badUrl += urls[i] + ",";
                    }
                    newDomailUrl += newStr + ",";
                }
                if(newDomailUrl!=""){
                    newDomailUrl = newDomailUrl.substring(0, newDomailUrl.length - 1);
                    that.val(newDomailUrl);
                }

                if(!isDomain){
                    if(badUrl.length>0){
                        badUrl = badUrl.substring(0,badUrl.length-1);
                        var e = {};
                        e.currentTarget = that;
                        page.showPopover(e, {}, 'warning', "输入的域名[" + badUrl+"]格式不正确", true);
                    }
                    $("._search",_this.formSelector).lock();
                    $("._search",_this.formSelector).addClass("disabled");
                    $("#isCorrect",_this.formSelector).hide();
                }else{
                    $("._search",_this.formSelector).unlock();
                    $("#isCorrect",_this.formSelector).show();
                    $("._search",_this.formSelector).removeClass("disabled");
                }
            }else{
                $("._search",_this.formSelector).lock();
                $("#isCorrect",_this.formSelector).hide();
                $("._search",_this.formSelector).addClass("disabled");
            }
        },
        bindPreferenceEvent:function () {
            var $bootstrapSwitch = $("[name$='active'][type='checkbox']");
            this.unInitSwitch($bootstrapSwitch)
                .bootstrapSwitch({
                        onSwitchChange: function (e, state) {
                            var itemid = $(e.currentTarget).parents('tr').attr('itemid');
                            var _target = e.currentTarget;
                            var $preferenceItem = $(_target).parents("tr:first").children("td:first").text();
                            var msg = "";
                            if (!$(_target).attr("isChanged")) {
                                if (state) {
                                    msg = (window.top.message.setting['preference.open']).replace("{item}",$preferenceItem);
                                } else {
                                    msg = (window.top.message.setting['preference.close']).replace("{item}",$preferenceItem);
                                }
                                window.top.topPage.showConfirmMessage(msg, function (confirm) {
                                    if (confirm) {
                                        window.top.topPage.ajax({
                                            type: "POST",
                                            url: root + "/preference/uploadActive.html",
                                            data: {'result.id': itemid, 'result.active': !_target.checked},
                                            dataType: 'json',
                                            success: function (e) {
                                                $(_target).attr("isChanged", true);
                                                $(_target).bootstrapSwitch("state", !_target.checked);
                                                if (state) {
                                                    $("#"+$(_target).attr("hidId")).val("true");
                                                } else {
                                                    $("#"+$(_target).attr("hidId")).val("false");
                                                }
                                            }
                                        })
                                    }
                                });
                            } else {
                                $(_target).removeAttr("isChanged");
                                return true;
                            }
                            return false;
                        }
                    }
                );

            $("#remind input[type=checkbox]").on("click", function () {
                var paramValue = [];
                var checks = $(this).parent().parent().find("input[type=checkbox]");
                if ($(checks[0]).is(":checked"))
                    paramValue.push("1");
                if ($(checks[1]).is(":checked"))
                    paramValue.push("2");
                $(this).parent().siblings(":last").val(paramValue.join('#'));
            });

            $(".site-switch .dd-list dd").on("mouseover",function(){
                $(this).addClass("shut");
            });

            $(".site-switch .dd-list dd").on("mouseleave",function(){
                $(this).removeClass("shut");
            });
        },
        /*游戏设置-基本参数*/
        getGameBasicFormData :function () {
            return {
                gatherOddsTime: $('[name=gatherOddsTime]').val(),
                todayOddsTime: $('[name=todayOddsTime]').val(),
            };
        },
        /*游戏设置-页面刷新时间*/
        getGamePageTimeFormData :function () {
            return {
                matchesSumTime: $('[name=matchesSumTime]').val(),
                liveTime: $('[name=liveTime]').val(),
                todayTime: $('[name=todayTime]').val(),
                futureTime: $('[name=futureTime]').val(),
            };
        },
        /*游戏设置-赔率有效时间*/
        getGameValidTimeFormData :function () {
            return {
                liveValidTime: $('[name=liveValidTime]').val(),
                todayValidTime: $('[name=todayValidTime]').val(),
                futureValidTime: $('[name=futureValidTime]').val(),
            };
        },
        /*游戏设置-等待最新赔率时间*/
        getGameWaitTimeFormData :function () {
            return {
                liveWaitOddsTime: $('[name=liveWaitOddsTime]').val(),
                todayWaitOddsTime: $('[name=todayWaitOddsTime]').val(),
                futureWaitOddsTime: $('[name=futureWaitOddsTime]').val(),
            };
        },
        checkPCCustomerParams: function (e,opt) {
            var flag = true;
            var customerName = $('#pcName').val();
            var customerUrl = $('#pcUrl').val();
            var msg = '';
            var regexName = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
            var regexUrl = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
            if (!regexUrl.test(customerUrl)){
                var obj = {currentTarget:$('#pcUrl')};
                page.showPopover(obj,{},'warning','请输入正确的url地址',true)
                flag = false;
            }
            if (!regexName.test(customerName)){
                var obj = {currentTarget:$('#pcName')};
                page.showPopover(obj,{},'warning','只能是1-20个字符，中文或英文大小写和数字',true)
                flag = false;
            }
            $(e.currentTarget).unlock();
            return flag;
        },
        checkMobileCustomerParams: function (e,opt) {
            var flag = true;
            var customerName = $('#mobileName').val();
            var customerUrl = $('#mobileUrl').val();
            var msg = '';
            var regexName = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
            var regexUrl = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
            if (!regexUrl.test(customerUrl)){
                var obj = {currentTarget:$('#mobileUrl')};
                page.showPopover(obj,{},'warning','请输入正确的url地址',true)
                flag = false;
            }
            if (!regexName.test(customerName)){
                var obj = {currentTarget:$('#mobileName')};
                page.showPopover(obj,{},'warning','只能是1-20个字符，中文或英文大小写和数字',true)
                flag = false;
            }
            $(e.currentTarget).unlock();
            return flag;
        },
        /**
         * 获取pc客服参数
         * @param e
         * @param opt
         */
        getPCCustomerParams: function (e,opt) {
            var pcId = $('input[name="pcId"]').val();
            var customerName = $('#pcName').val();
            var customerUrl = $('#pcUrl').val();
            return {'search.id': pcId,'customerName': customerName,'customerUrl': customerUrl,'customerCode':'PC'};
        },
        getMobileCustomerParams: function (e,opt) {
            var mobileId = $('input[name="mobileId"]').val();
            var customerName = $('#mobileName').val();
            var customerUrl = $('#mobileUrl').val();
            return {'search.id': mobileId,'customerName': customerName,'customerUrl': customerUrl,'customerCode':'mobile'};
        },

        checkYzmParams: function (e, opt) {
            var flag = true;
            var reg = /^[a-zA-Z1-9]+$/;
            var yzmParams = $('input[name="exclusionsValue"]').val();
            if (!reg.test(yzmParams)){
                flag = false;
                page.showPopover(e,{},'warning','请输入英文字母和数字',true);
            }
            return flag;
        },
        getYzmParams: function (e, opt) {
            var yzmParams = $('input[name="exclusionsValue"]').val();
            var YzmId = $('input[name="YzmId"]').val();
            return {'exclusionsValue':yzmParams,'search.id':YzmId};
        }
    });
});