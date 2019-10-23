/**
 * 域名管理
 */
define(['common/BaseListPage', 'bootstrapswitch'], function (BaseListPage) {

    return BaseListPage.extend({
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        init: function () {
            this.formSelector = "#domainForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();
            var _this=this;
            $(_this.formSelector).on("change","#searchType", function () {
                var val=$(this).val();
                $("#searchInput",_this.formSelector).attr("name",val);
            });
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
                        msg = window.top.message.content['sysdomain.showConfirmMessage.on'];
                    } else {
                        msg = window.top.message.content['sysdomain.showConfirmMessage.off'];
                    }
                    window.top.topPage.showConfirmMessage(msg, function (bol) {
                        if (bol) {
                            //ajax
                            var _show = status.toString();
                            var _hide = (!status).toString();
                            var $parent_tr = $($this).parents('tr');
                            _show = _this.status[_show];
                            _hide = _this.status[_hide];
                            window.top.topPage.ajax({
                                type: "POST",
                                url: root + "/account/domain/changeStatus.html",
                                data: {'result.isEnable': status, 'result.id': $(event.currentTarget).val()},
                                dataType: 'json',
                                eventTarget: {currentTarget: event.currentTarget},
                                success: function (data) {
                                    $this.bootstrapSwitch('state', status, true);
                                    if (data.state) {
                                        $this.bootstrapSwitch('state', status, true);
                                        $(_show, $parent_tr).removeClass('hide');
                                        $(_hide, $parent_tr).addClass('hide');
                                    }
                                },
                                error: function (xhr) {
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
        }
    });
});