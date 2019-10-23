define(['common/BaseListPage', 'bootstrapswitch'], function (BaseListPage) {
    var _this = this;
    return BaseListPage.extend({
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = "#viewDomainFormAgent";
            this._super(this.formSelector);

        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            var _this = this;
            _this.initSwitch();
            $(".tab-content > .tab-pane").css("display", "block");
            $("div.tab-center").css("display", "block");

        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;

            $(this.formSelector).on("click", "table tbody input[type=checkbox]", function (e) {
                var $funMoreMenu = $(".function-menu-show", window.top.topPage.getCurrentForm(e));
                if (!_this.getSelectIdsArray(e).length) {
                    $funMoreMenu.css("display", "").removeClass('show').addClass('hide');
                }
                else {
                    $funMoreMenu.css("display", "").removeClass('hide').addClass('show');
                }
            });
            $("a", "#two-detail").on("click", function () {
                var $href = $(this).attr("data-href");
                var afentUrl = $(this).data("form"); //代理的url
                window.top.topPage.ajax({
                    url: root + $href,
                    type: "get",
                    data: {'isPart': 'part'},
                    success: function (data) {
                        $("form").attr("action", afentUrl);
                        $("div.search-list-container").html(data);
                        page.onPageLoad();
                        $("div.tab-center").css("display", "block");
                        _this.initSwitch();
                    }
                });
                $(this).siblings("a").removeClass("current");
                $(this).addClass("current");
            });
            $(_this.formSelector).on("keyup","input[name='search.domain']", function () {
                var domain = $(this).val();
                domain = domain.replace("http://","");
                var index = domain.indexOf("/");
                if(index>-1){
                    domain = domain.substring(0,index);
                }
                $(this).val(domain);
            });
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

        /**
         * 执行查询
         * @param event         事件对象
         */
        query: function (event, option) {
                var _this = this;
                var $form = $(window.top.topPage.getCurrentForm(event));
                if (!$form.valid || $form.valid()) {
                    window.top.topPage.ajax({
                        loading: true,
                        url: window.top.topPage.getCurrentFormAction(event),
                        headers: {
                            "Soul-Requested-With": "XMLHttpRequest"
                        },
                        type: "post",
                        data: this.getCurrentFormData(event),
                        success: function (data) {
                            $("div.search-list-container",_this.formSelector).html(data);
                            _this.onPageLoad();
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
                                success: function (data) {
                                    $this.bootstrapSwitch('state', status, true);
                                    if (data.state) {
                                        $this.bootstrapSwitch('state', status, true);
                                        $(_show, $parent_tr).removeClass('hide');
                                        $(_hide, $parent_tr).addClass('hide');
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
        }
    });
});