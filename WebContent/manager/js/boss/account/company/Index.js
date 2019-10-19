define(['common/BaseListPage','bootstrapswitch'], function (BaseListPage) {
    return BaseListPage.extend({
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        init: function (formSelector) {
            var _this = this;
            this.formSelector = "#mainFrame #companyForm";
            this._super(this.formSelector);
            _this.changeAddButton();
        },
        bindEvent: function () {
            var _this = this;
            this._super();
            $(document).ready(function(){
                $('#mySelectSh').change(function(){
                    var user = $(this).val();
                    if (user != '' && user != undefined && user != null) {
                        $('#merchantForm #saveButtonSh').show();
                    } else {
                        $('#merchantForm #saveButtonSh').hide();
                    }
                })
            })
        },
        onPageLoad: function () {
            this._super();
            var _this = this;
            _this.initSwitch();
        },

        /**
         * 初始化开关
         */
        initSwitch: function () {
            var _this = this;
            /*所有开关页面*/
            var $switch = $(_this.formSelector + " input[name='my-checkbox']");
            /*
             * 开关改变状态事件
             * */
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
                            //ajax
                            var _show = status.toString();
                            var _hide = (!status).toString();
                            var $parent_tr = $($this).parents('tr');
                            _show = _this.status[_show];
                            _hide = _this.status[_hide];
                            var id = $(event.currentTarget).val();
                            window.top.topPage.ajax({
                                type: "POST",
                                url: root + "/boss/account/merchant/updateStatus.html",
                                data: {'result.id': $(event.currentTarget).val()},
                                dataType: 'json',
                                eventTarget:{currentTarget: event.currentTarget},
                                success: function (data) {
                                    $this.bootstrapSwitch('state', status, true);
                                    if (data.state) {
                                        if (status=='1'){
                                            //$('#player-stauts-detail span',_this.formSelector).text("正常");
                                            $('.idx'+id).find('span').removeClass('label-danger').addClass('label-success').text("正常");
                                            //sta.val(1);
                                        }
                                        if (status!='1'){
                                            //$('#player-stauts-detail span',_this.formSelector).text("停用");
                                            $('.idx'+id).find('span').removeClass('label-success').addClass('label-danger').text("停用");

                                            //sta.val(2);
                                        }
                                        $(_show, $parent_tr).removeClass('hide');
                                        $(_hide, $parent_tr).addClass('hide');
                                        _this.query(event);
                                    }
                                },
                                error: function (request) {
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
        showAuthenticationKeyUrl: function (e, opt) {
            var _this = this;
            if (opt.data.state) {
                var username = opt.data.username;
                var host = opt.data.host;
                var secret = opt.data.secret;
                var url = root + "/boss/account/merchant/showAuthenticationKeyUrl.html?username=" + username + "&host=" + host + "&secret=" + secret;
                var showEvent = {page: _this};
                var showBtnOption = {text: window.top.message.common['msg'], target: url};
                page.showPopover(e, {
                    "callback": function (event, option) {
                        console.log(opt.data.url);
                        window.top.topPage.doDialog(showEvent, showBtnOption);
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
            $(e.currentTarget).unlock();
        },

        /**
         * 新增
         * @param e
         */
        createMerchant: function (e, btnOption) {
            var ownerId = $('#mySelectSh').val();
            btnOption.opType="dialog";
            btnOption.target=root+"/boss/account/merchant/create.html?result.ownerId="+ownerId;
            window.top.topPage.doDialog(e, btnOption);
        },

        resetCondition: function (e,opt) {
            $('input[name="search.createTimeBegin"]').val('');
            $('input[name="search.createTimeEnd"]').val('');
            $('input[name="search.username"]').val('');
            $(e.currentTarget).unlock();
        },

        changeAddButton: function (e,opt) {
            var user = $('#merchantForm #mySelectSh').val();
            if (user != '' && user != undefined && user != null) {
                $('#merchantForm #saveButtonSh').show();
            } else {
                $('#merchantForm #saveButtonSh').hide();
            }
        },

    });
});