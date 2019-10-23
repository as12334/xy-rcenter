define(['common/BaseListPage'], function (BaseListPage) {
    return BaseListPage.extend({

        init: function (title) {
            this.formSelector = "#mainFrame #mhSiteViewForm";
            this._super(this.formSelector);

        },

        onPageLoad: function () {
            var _this = this;
            this._super();
            _this.initSwitch();
        },

        bindEvent: function () {
            this._super();
            this.copyText('[name="copy"]');
            var _this = this;
            $(this.formSelector).on("click", "#editMode", function (e) {
                if ($('#showModeContent').css("display") == 'none') {
                    $('#showModeContent').css("display", "inline-block");
                    $(this).text("取消修改");
                    return false;
                } else {
                    $("#showModeContent").hide();
                    $(this).text("修改");
                }
                return false;
            });
        },
        //站点维护按钮--回调
        siteSaveCallbak: function (e) {
            if (e.returnValue) {
                $("#site_basic_a").click();//刷新站点信息页面
                $(".CancelMaintenance").removeClass("disabled"); //保存维护成功、恢复取消维护按钮
            }
        },
        //停用按钮--回调
        siteDisabledCallbak: function (e) {
            if (e.returnValue) {
                $("#site_basic_a").click();//刷新站点信息页面
                $(".siteOpen").removeClass("disabled");
                $(".siteClose").addClass("disabled");
                $(".siteClose").unlock();
            }
        },
        getSelectIdsArray: function (e, option) {
            var checkedItems = [], counter = 0;
            $("table tbody input[type=checkbox]", this.getCurrentForm(e)).not("[name=my-checkbox]").each(function (node, obj) {
                if (obj.checked) {
                    checkedItems[counter] = obj.value;
                    counter++;
                }
            });

            return checkedItems;
        },

        getSelectIds: function (e, option) {
            return {ids: this.getSelectIdsArray(e, option).join(",")};
        },

        /**
         * 搜索查询
         * @param event
         * @param option
         */
        searchQuery: function (event, option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if (!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading: true,
                    url: root + $("div.panel ul li.active a").attr("data-href"),
                    headers: {
                        "Soul-Requested-With": "XMLHttpRequest"
                    },
                    type: "post",
                    data: this.getCurrentFormData(event),
                    success: function (data) {
                        $("div.search-list-container").html(data);
                        $("div.tab-pane div.function-menu-show").removeClass('show').addClass('hide');
                        event.page.onPageLoad();
                        $(event.currentTarget).unlock()
                    },
                    error: function (data, state, msg) {
                        window.top.topPage.showErrorMessage(data.responseText);
                        $(event.currentTarget).unlock();
                    }
                });
            } else {
                $(event.currentTarget).unlock();
            }
        },

        /**
         *
         * @param event
         * @param option
         */
        payChannelQuery: function (event, option) {
            var data = {
                'search.type': $(event.currentTarget).parents("th.inline").find("[name='search.type']").val(),
                'search.status': $(event.currentTarget).parents("th.inline").find("[name='search.status']").val()
            };
            window.top.topPage.ajax({
                    loading: true,
                    url: window.top.topPage.getCurrentFormAction(event),
                    headers: {
                        "Soul-Requested-With": "XMLHttpRequest"
                    },
                    type: "post",
                    data: data,
                    success: function (data) {
                        $("div.search-list-container").html(data);
                        event.page.onPageLoad();
                        $(event.currentTarget).unlock()
                    },
                    error: function (data, state, msg) {
                        window.top.topPage.showErrorMessage(data.responseText);
                        $(event.currentTarget).unlock();
                    }
                }
            );
        },

        /**
         * 查询更多
         * @param e
         * @param opt
         */
        showContact: function (e, opt) {
            $("div.search-list-container").html(opt.data);
            e.page.onPageLoad();
        },
        recallback: function (event, option) {
            var data = option.data;
            if (data.state) {
                page.showPopover(event, {
                    "callback": function () {
                        $("#site_basic_a").click();
                    }
                }, 'success', '操作成功', true);

            } else {
                var msg = option.data.msg;
                if (msg == null || msg == "") {
                    msg = "操作失败";
                }
                page.showPopover(event, {}, 'danger', msg, true);
            }
        },
        accountCallback: function (e, opt) {
            var _this = this;
            if (opt.data.state) {
                page.showPopover(e, {
                    "callback": function (event, option) {
                        console.log(opt.data.url);
                        window.top.topPage.doDialog({page: _this}, {
                            text: window.top.message.common['msg'],
                            target: root + "/siteSubAccount/showUrl.html?username=" + opt.data.username + "&host=" + opt.data.host + "&secret=" + opt.data.secret
                        });
                    }, "placement": "left"
                }, 'success', '操作成功', true);
            } else {
                var msg = opt.data.msg;
                if (msg == null || msg == "") {
                    msg = "操作失败";
                }

                page.showPopover(e, {
                    "callback": function () {
                    }, "placement": "left"
                }, 'danger', msg, true);
            }
        },
        siteBlockUp: function (e) {
            var that = this;
            $.ajax({
                url: root + "/vSysSiteManage/siteBlockUp.html",
                data: {
                    'result.siteId': $("[name='getSiteId']").val()
                },
                type: "POST",
                dataType: "JSON",
                success: function (data) {
                    if (data != null) {
                        window.top.page.showPopover(e, {}, 'success', data.msg, true);
                        $("#site_basic_a").click();

                        $(".siteOpen").removeClass("disabled");
                        $(".siteClose").addClass("disabled");
                        $(".siteClose").unlock();
                    }
                }
            })
        },
        siteOpen: function (e) {
            var that = this;
            $.ajax({
                url: root + "/vSysSiteManage/siteOpen.html",
                data: {
                    'result.siteId': $("[name='getSiteId']").val()
                },
                type: "POST",
                dataType: "JSON",
                success: function (data) {
                    if (data != null) {
                        window.top.page.showPopover(e, {}, 'success', data.msg, true);
                        $("#site_basic_a").click();

                        $(".siteOpen").addClass("disabled");
                        $(".siteClose").removeClass("disabled");
                        $(".CancelMaintenance").addClass("disabled");
                        $(".siteOpen").unlock();
                    }
                }
            })
        },

        updateMode: function (e) {
            var _this = this;
            var btnOption = eval("(" + $(e.currentTarget).data('rel') + ")");
            e.currentTarget = $("#showModeContent div.btn-group", _this.formSelector)[0];
            window.top.topPage.ajax({
                loading: true,
                url: root + "/site/detail/updateMode.html",
                type: "post",
                data: {
                    "result.id": btnOption.rid,
                    "result.mode": $('[name="result.mode"]', _this.formSelector).val()
                },
                dataType: "JSON",
                success: function (data) {
                    $("ul li a:eq(0)", ".domainTab", _this.formSelector).click();
                    window.top.page.showPopover(e, {}, 'success', data.msg, true);

                }
            })
        },

        /**
         * 初始化开关
         */
        initSwitch: function () {
            var _this = this;
            var status = $("[name='result.status']", _this.formSelector).val();
            var $switch = $("input[name='my-checkbox']", _this.formSelector);
            _this.unInitSwitch($switch)
                .bootstrapSwitch()
                .on('switchChange.bootstrapSwitch', function (event, status) {
                    var $this = $(this);
                    $this.bootstrapSwitch('indeterminate', true);
                    /*提示信息*/
                    var msg = "";
                    if (status) {
                        msg = window.top.message.content['subaccount.showConfirmMessage.on'];
                    } else {
                        msg = window.top.message.content['subaccount.showConfirmMessage.off'];
                    }
                    window.top.topPage.showConfirmMessage(msg, function (bol) {
                        if (bol) {
                            var id = $(event.currentTarget).val();
                            var code = $(event.currentTarget).attr("data-code");
                            var url;
                            if (code == "verification") {
                                url = root + "/site/merchantSiteDetail/updateSysParamStatus.html";
                            } else if (code == "demo") {
                                url = root + "/site/merchantSiteDetail/updateDemoSysParamStatus.html";
                            } else if (code == 'checkRealName') {
                                url = root + "/site/merchantSiteDetail/updateCheckRealNameStatus.html";
                            } else if (code == 'api') {
                                url = root + "/site/merchantSiteDetail/updateApiStatus.html";
                            } else if (code == 'checkMobile') {
                                url = root + "/site/merchantSiteDetail/updateCheckMobileStatus.html";
                            } else if (code == 'checkWeixin') {
                                url = root + "/site/merchantSiteDetail/updateCheckWeixinStatus.html";
                            }else if (code == 'payee_bank_alipay') {
                                url = root + "/site/merchantSiteDetail/updatePayeeBankAlipayStatus.html";
                            }else if (code == 'payee_bank_weixin') {
                                url = root + "/site/merchantSiteDetail/updatePayeeBankWeixinStatus.html";
                            }else if (code == 'apiTransferSite'){
                                url = root + "/site/merchantSiteDetail/updateApiTransferSiteStatus.html";
                            }
                            window.top.topPage.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    'result.paramValue': status,
                                    'result.siteId': $("input[name='getSiteId']", _this.formSelector).val()
                                },
                                dataType: 'json',
                                async: false,
                                success: function (data) {
                                    page.showPopover(event,{},data.state?'success':'danger',data.msg,true);
                                    if (data.state){
                                        $this.bootstrapSwitch('state', status, true);
                                    }else {
                                        /*取消不确定状态*/
                                        $this.bootstrapSwitch('indeterminate', false);
                                        /*第三个参数为true 不会进入change事件*/
                                        $this.bootstrapSwitch('state', !status, true);
                                    }

                                },
                                error: function (xhr, errorText, data) {
                                    /*取消不确定状态*/
                                    $this.bootstrapSwitch('indeterminate', false);
                                    /*第三个参数为true 不会进入change事件*/
                                    $this.bootstrapSwitch('state', !status, true);
                                }
                            });
                        } else {
                            /*取消不确定状态*/
                            $this.bootstrapSwitch('indeterminate', false);
                            /*第三个参数为true 不会进入change事件*/
                            $this.bootstrapSwitch('state', !status, true);
                        }
                    });
                });
        },


        //返水
        billRakebackSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/fund/billRakeback/goBillRakeback.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        //工资
        billSalarySubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/fund/wages/goBillSalary.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },
        //分红
        billDividenSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/fund/billDividenReport/goBillDividen.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        //退水
        billRetreatSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/fund/retreat/goBillRetreat.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        //游戏报表
        reportGameSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/report/operate/goReportGame.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        //运营报表
        reportOperateSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/site/merchantSiteDetail/goReportOperate.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        //经营报表
        reportBusinessSubmit: function (e, option) {
            var _this = this;
            var date = $("#searchDate", _this.formSelector).val();
            window.top.topPage.ajax({
                url: root + "/merchant/report/business/goReportBusiness.html",
                data: {siteId: option.site_id, date: date},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },


        //初始化黑名单
        initSiteConfineArea: function (e, option) {
            var _this = this;
            window.top.topPage.ajax({
                url: root + "/site/merchantSiteDetail/initSiteConfineArea.html",
                data: {siteId: option.site_id},
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        },

        discParam: function (e, option) {
            var _this = this;
            var paramValue = $('input[name="search.paramValue"]').val();
            window.top.topPage.ajax({
                url: root + "/site/merchantSiteDetail/discParam.html",
                data: {
                    'result.siteId': $("input[name='getSiteId']", _this.formSelector).val(),
                    'result.paramValue': paramValue,
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    var state = data.state;
                    var msg = data.msg;
                    if (state) {
                        e.page.showPopover(e, option, 'success', msg, true);
                    } else {
                        e.page.showPopover(e, option, 'danger', msg, true);
                    }
                }
            })
        }

    });
});