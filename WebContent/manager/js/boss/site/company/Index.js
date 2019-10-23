define(['common/BaseListPage', 'bootstrap-dialog','bootstrapswitch'], function(BaseListPage,BootstrapDialog) {
    return BaseListPage.extend({
        bootstrapDialog: BootstrapDialog,
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        init: function () {
            this.formSelector = "#mhSiteManagerForm";
            this._super(this.formSelector);

        },

        onPageLoad: function () {
            this._super();
            var _this = this;
            _this.initSwitch();
            $(_this.formSelector).on("keyup", "input[name='search.domain']", function () {
                var domain = $(this).val();
                domain = domain.replace("http://", "");
                var index = domain.indexOf("/");
                if (index > -1) {
                    domain = domain.substring(0, index);
                }
                $(this).val(domain);
            });
            $(_this.formSelector).on("keyup", "input", function () {
                var domain = $(this).val();
                domain = domain.replace(/\s+/g, '');
                $(this).val(domain);
            })
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            var _this = this;
            this._super();
            $(_this.formSelector).on("click",".remark",function (e) {
                var remark=$(e.currentTarget).next("div[style='display: none']").text();
                BootstrapDialog.show({
                    title: '备注',
                    message: remark,
                    draggable: true
                });

            });
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            var _this = this;
            this._super();
            $(_this.formSelector).on("click",".remark",function (e) {
                var remark=$(e.currentTarget).next("div[style='display: none']").text();
                BootstrapDialog.show({
                    title: '备注',
                    message: remark,
                    draggable: true
                });

            });
        },
        //站点维护按钮--回调
        siteSaveCallbak: function (e) {
            if (e.returnValue) {
                $("#site_basic_a").click();//刷新站点信息页面
                $(".CancelMaintenance").removeClass("disabled"); //保存维护成功、恢复取消维护按钮
            }
        },
        /**
         * 初始化开关
         */
        initSwitch: function () {
            var _this = this;
            /*所有开关页面*/
            var sta=$("[name='current-status']",_this.formSelector);
            var status = $("[name='result.status']",_this.formSelector).val();
            var $switch = $(_this.formSelector + " input[name='my-checkbox']");
            var div =$("[id='player-stauts-detail']",_this.formSelector);
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
                                url: root + "/site/siteMerChant/updateMhSiteStatus.html",
                                data: {'result.id': $(event.currentTarget).val()},
                                dataType: 'json',
                                async:false,
                                eventTarget:{currentTarget: event.currentTarget},
                                success: function (data) {
                                    $this.bootstrapSwitch('state', status, true);
                                    if (data.state) {
                                        if (status=='1'){
                                            $('.idx'+id).find('span').removeClass('label-danger').addClass('label-success').text("正常");
                                            //sta.val(1);
                                        }
                                        if (status!='1'){
                                            $('.idx'+id).find('span').removeClass('label-success').addClass('label-danger').text("停用");
                                            //sta.val(2);
                                        }
                                        $(_show, $parent_tr).removeClass('hide');
                                        $(_hide, $parent_tr).addClass('hide');
                                    }

                                },
                                error: function (request) {
                                    /*取消不确定状态*/
                                    $this.bootstrapSwitch('indeterminate', false);
                                    /*第三个参数为true 不会进入change事件*/
                                    $this.bootstrapSwitch('state', !status, true);
                                }
                            });
                        }else {
                            /*取消不确定状态*/
                            $this.bootstrapSwitch('indeterminate', false);
                            /*第三个参数为true 不会进入change事件*/
                            $this.bootstrapSwitch('state', !status, true);
                        }
                    });
                });
        },
    });
});