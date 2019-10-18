define(['common/BasePage', 'common/Pagination', 'validate', 'validateExtend'], function (BasePage, Pagination) {

    return BasePage.extend({
        funMoreMenu: ".wrapper .function-menu-show",
        pagination: null,
        checkUsernameClass: '.check-usernames',//验证多账号查询
        checkAmountClass: '.check-amount',//校验金额
        checkSiteIdClass: '.query-site-id',//验证站点id
        checkRegisterIpClass: '.check-register-ip',//检查注册IP
        usernameRegex: /^[a-zA-Z0-9_,]{1,16}$/,
        moneyRegex: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/,
        registerIpRegex: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/,

        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = this.formSelector || formSelector || "." + window.topPage.cuid + " form";
            this.pagination = new Pagination(this.formSelector);
            this._super(this.formSelector);
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            //自定义下拉选择事件
            this.pagination.processOrderColumnTag(this);
            $(this.formSelector + " .search-wrapper [selectDiv]").attr("callback", "selectListChange");
            this.bindFormValidation();
            this.checkNoRecords();
            this.toolBarCheck({currentTarget: $(this.formSelector)[0]});
            this.moreData();
            this.initSelectLottery(this.formSelector);
            this.initDIYTopMenu(this.formSelector);
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            //绑定所有table的列头选择事件
            $(this.formSelector).on("click", "table thead input[type=checkbox]", function (e) {
                e.page = _this;
                $("tbody input[type=checkbox]", _this.getFirstParentByTag(e, "table")).each(function (node, obj) {
                    var $this = $(obj);
                    if (e.currentTarget.checked && !$this.prop("disabled")) {
                        $this.parents('tr').addClass('open');
                    }
                    else {
                        $this.parents('tr').removeClass('open');
                    }
                    if (!$this.prop("disabled")) {
                        obj.checked = e.currentTarget.checked;
                    }
                });
                _this.toolBarCheck(e);

            });
            //绑定所有table的列头选择事件
            $(this.formSelector).on("click", "table tbody input[type=checkbox]", function (e) {
                e.page = _this;
                var $this = $(this);
                if ($this.prop("checked")) {
                    $this.parents('tr').addClass('open');
                }
                else {
                    $this.parents('tr').removeClass('open');
                }
                if ($this.prop("checked")) {
                    $this.attr("checked", "checked")
                }
                else {
                    $this.removeAttr("checked")
                }
                var $theadCheckBox = $('table thead input[type=checkbox]', _this.getCurrentForm(e));
                var allRows = $("table tbody input[type=checkbox]", _this.getCurrentForm(e)).length;
                var allCheckedRows = $("tbody input[type=checkbox]:checked", _this.getCurrentForm(e)).length;
                var allDisabledRows = $("tbody input[type=checkbox]:disabled", _this.getCurrentForm(e)).length;
                if (e.currentTarget.checked &&
                    allRows - allCheckedRows - allDisabledRows == 0) {
                    $theadCheckBox.prop('checked', true);
                } else {
                    $theadCheckBox.prop('checked', false);
                }
                _this.toolBarCheck(e);
            });
            //自定义字段列表事件
            $(this.formSelector).on("change", "[name='selectFields.id']", function (e) {
                e.page = _this;
                _this.query(e);
            });
            //绑定自动能够已过滤下拉事件
            $(this.formSelector).on("click", ".filter-conditions dt a", function (e) {
                $(".filter-conditions ", this.formSelector).addClass("hide");
                $(".filter-conditions ", this.formSelector).children("dd").remove();
                _this.query(e);
            });
            $(this.formSelector).on("keyup", ".list-search-input-text", function (e) {
                var oldStr = this.value;
                var newStr = oldStr.replace(/^\s+|\s+$/g, '');
                if (oldStr != newStr) {
                    this.value = newStr;
                }
            });

        },

        /**
         * 初始化自定义顶部菜单、搜索、重置按钮
         */
        initDIYTopMenu: function () {
            var _this = this;
            $('#diyTopMenuUl li', _this.formSelector).off().on('click', function (e, opt) {
                e.page = _this;
                _this.queryCache(e, opt);
            });

            //首次加载进入方法，默认清空缓存
            if ($('#diyTopMenuUl', _this.formSelector).attr('loaded') == "false") {
                if (_this.getTopDIYMenuActive().length == 0) {
                    $('#diyTopMenuUl li:first', _this.formSelector).addClass('active');
                }
                $('#subPageCache', document).empty();
                _this.queryCache({currentTarget: _this.getTopDIYMenuActive(), page: _this}, {});
            }

            $('#topMenuReset', _this.formSelector).off().on('click', function (event, option) {
                var callback = $(this).attr("callback");
                if (callback && callback.trim() != '') {
                    event.page = _this;
                    window.top.topPage.doPageFunction(event, $(this).attr("callback"), option);
                } else {
                    _this.resetCondition(event, option);
                }
            });

            $('#topMenuQuery', _this.formSelector).off().on('click', function (event, option) {
                var precall = true;
                var precallMethod = $(this).attr("precall");
                if (precallMethod && precallMethod.trim() !== '') {
                    event.page = _this;
                    precall = window.top.topPage.doPageFunction(event, precallMethod, option);
                }
                if (precall && precall === true) {
                    _this.clickTopMenuTab(event, option);
                }
            });
        },

        clickTopMenuTab: function (e, opt) {
            var _this = this;
            $('#diyTopMenuUl li[class=active]', _this.formSelector).trigger('click');
            if (e) $(e.currentTarget).unlock();
        },


        getTopDIYMenuActive: function () {
            return $('#diyTopMenuUl li[class="active"]', this.formSelector);
        },

        /**
         * 初始化彩种选择框
         */
        initSelectLottery: function (selector) {
            var _this = this;
            //兼容多标签页缓存
            _this.overwriteInputEvent(selector);
            var selectLottery = $('#selectLotteryDiv', selector);
            if (selectLottery.length > 0 && selectLottery.data('init') == false) {
                //解绑事件
                selectLottery.unbind('click');
                selectLottery.data('init', true);
                //初始化条目数
                _this.changeSelectLotteryLength(selector);
                //初始化选择彩种名
                _this.changeSelectLotteryText(selector);
                //冒泡相关
                $(selector).on('click', function () {
                    $('.type-search-game', selector).hide();
                });
                $(selectLottery).on('click', '.type-search-game', function (event) {
                    event.stopPropagation();
                });
                //彩种选择表单显示/隐藏
                $(selectLottery).on('click', '.select-lottery-toggle', function (event, option) {
                    $(this).toggleClass('open');
                    $('.type-search-game', selector).toggle();
                    event.stopPropagation();
                });
                //全选/清空
                $(selectLottery).on('click', 'button.choose-btn', function (event, option) {
                    var type = $(this).data('type');
                    var inputs = $('#lotteryTable input[type="checkbox"]', selector);
                    if (type == 'all') {
                        inputs.prop('checked', 'checked').change();
                    } else if (type == 'clear') {
                        inputs.prop('checked', '').change();
                    }
                    _this.changeSelectLotteryLength(selector);
                    $(event.currentTarget).blur();
                    $(event.currentTarget).unlock();
                });
                //分组选择
                $(selectLottery).on('click', '.lottery-type-group', function (event, option) {
                    var inputs = $('#lotteryTable input[type="checkbox"][data-type="' + $(this).data('type') + '"]', selector);
                    if (inputs.is(':checked')) {
                        inputs.prop('checked', '').change();
                    } else {
                        inputs.prop('checked', 'checked').change();
                    }
                    _this.changeSelectLotteryLength(selector);
                });

                $(selectLottery).on('change', '#lotteryTable input[type="checkbox"]', function (e, opt) {
                    _this.changeSelectLotteryText(selector);
                });
            }
        },

        //显示选择彩种名
        changeSelectLotteryText: function (selector) {
            var split = '、';
            var lottery = $('#lotteryTable input[type="checkbox"]', selector);
            var checkLottery = $('#lotteryTable input[type="checkbox"]:checked', selector);
            var textNode = $('.showLotteryText .gameRankDisplay', selector);
            var text = '';
            if (checkLottery.length == 0) {
                text = '未筛选彩种';
            } else if (lottery.length == checkLottery.length) {
                text = '全部';
            } else {
                $('#lotteryTable td.lottery-type-group', selector).each(function (i, e) {
                    var type = $(this).data('type');
                    var group = $('#lotteryTable input[type="checkbox"][data-type="' + type + '"]', selector);
                    var checked = 0;
                    lottery.each(function (i2, e2) {
                        if ($(this).data('type') == type && $(this).is(':checked')) {
                            checked += 1;
                        }
                    });
                    if (checked == group.length) {
                        text += '<b>' + $(this).data('typename') + '</b>' + split;
                    } else if (checked < group.length && checked > 0) {
                        lottery.each(function (i2, e2) {
                            if ($(this).data('type') == type && $(this).is(':checked')) {
                                text += $(this).data('codename') + split;
                            }
                        });
                    }
                });
            }
            if (text && text.substring(text.length - 1, text.length) == split) {
                text = text.substring(0, text.length - 1);
            }
            textNode.html(text);
        },

        //显示选择条目数
        changeSelectLotteryLength: function (selector) {
            var checkLength = $('#lotteryTable input[type="checkbox"]:checked', selector).length;
            var lengthNode = $('.choose-num', selector);
            if (checkLength == 0) {
                lengthNode.text('请选择');
            } else {
                lengthNode.text('已选' + checkLength + '项');
            }
        },

        /**
         * 自定义下拉选择事件
         * @param e
         */
        selectListChange: function (e) {
            if (e.key.indexOf("search") == 0) {
                if (e.key == "search.payeeBank") {
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").addClass("hide");
                    $(this.formSelector + " .show").children().removeClass("hide");
                } else {
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").removeClass("hide");
                    $(this.formSelector + " .show").children().addClass("hide");
                    $(this.formSelector + " .show").children().attr("value", "");
                    $(this.formSelector + " .show input").val("");
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").attr("name", e.key).val('');
                }
            } else {
                $(".show input[name='search.payeeBank']").val(e.key)
            }
            $(this.formSelector + " .search-wrapper .form-control[type=text]").attr("placeholder", e.value);

        },
        /**
         * 绑定表单验证规则
         * @private
         */
        bindFormValidation: function () {
            var $form = $(this.formSelector);
            var rule = this.getValidateRule($form);
            if (rule) {
                if ($.data($form[0], "validator")) {
                    $.data($form[0], "validator", null);
                }
                $form.validate(rule);
            }
        },
        /**
         * 详情关闭/打开
         * @param e
         */
        initShowDetail: function () {
            $(this.formSelector).on("mousedown", ".view", function (e) {
                var $target = $(e.currentTarget);
                var isLoad = $target.attr("data-load");//是否加载标识
                var id = $target.attr("data-id");

                if (isLoad != '1') {
                    var href = $target.attr("data-href");
                    $('#' + id).load(href, {"search.id": id});
                    $target.attr("data-load", "1");
                }
                $target.parent("td").parent("tr").next(".bg-color").toggle();
                $target.parents("tr").toggleClass("shut");

                $target.unlock();
            });

        },
        /**
         * 检查ToolBar的显示状态
         * @param e
         */
        toolBarCheck: function (e) {
            this._isShowTotalRow();
            var $funMoreMenu = $(this.funMoreMenu, this.getCurrentForm(e));
            if (e == undefined) {
                $funMoreMenu.css("display", "").removeClass('show').addClass('hide');
                return;
            }

            if (!this.getSelectIdsArray(e).length) {
                $funMoreMenu.css("display", "").removeClass('show').addClass('hide');
            }
            else {
                $funMoreMenu.css("display", "").removeClass('hide').addClass('show');
            }
        },

        /**
         * 操作回调，event.returnValue==true时才执行 query方法，
         * 其他的操作回调，请参考这里，不要任何时候都执行刷新操作
         * @param event
         * @param option
         */
        callBackQuery: function (event, option) {
            if (event.returnValue == true) {
                this.query(event, option);
            }
        },

        /**
         * 执行查询
         * @param event         事件对象
         */
        query: function (event, option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if (this.getTopDIYMenuActive().length > 0) {
                this.queryCache(event, option);
                return;
            }
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
                        var $result = $(".search-list-container", $form);
                        $result.html(data);
                        event.page.onPageLoad();
                        event.page.toolBarCheck(event);
                        $(event.currentTarget).unlock()
                    },
                    error: function (data, state, msg) {
                        //超时导致后台返回,安全密码验证不做任何处理
                        if (data.status != undefined && data.status != null && data.status != '' && data.status == 601) {
                            return;
                        }
                        window.top.topPage.showErrorMessage(data.responseText);
                        $(event.currentTarget).unlock();
                    }
                });
            } else {
                $(event.currentTarget).unlock();
            }
        },

        /**
         * 自定义标签页执行查询
         * @param event         事件对象
         */
        queryCache: function (event, option) {
            var _this = this;
            var $form = $(_this.formSelector);
            var callback = $('#diyTopMenuUl', _this.formSelector).attr('callback');
            var ajaxData = {};
            if (event && event.currentTarget) {
                //顶部标签切换预处理数据
                if ($(event.currentTarget).parent().hasClass('top_menu_ul')) {
                    var oldUid = window.top.topPage.getUrlId(_this.getTopDIYMenuActive().data('url'));
                    var newUid = window.top.topPage.getUrlId($(event.currentTarget).data('url'));
                    if (newUid != oldUid) {
                        $(event.currentTarget).unlock();
                        var subPageCache = $('#subPageCache');
                        $('iframe.' + oldUid, subPageCache).remove();
                        var _mainFrame = $('#mainFrame');
                        $form.off().unbind();//不需将事件存入，防止重复绑定
                        var cacheContent = _mainFrame.children("div").html();
                        //创建缓存
                        var iframe = document.createElement("iframe");
                        iframe.setAttribute("class", oldUid);
                        //iframe加载完成时再将缓存内容插入
                        if (iframe.attachEvent) {
                            iframe.attachEvent("onload", function () {
                                $("body", iframe.contentWindow.document).html(cacheContent);
                                // console.log("%s caching finished.", oldUid);
                            });
                        } else {
                            iframe.onload = function () {
                                $("body", iframe.contentWindow.document).html(cacheContent);
                                // console.log("%s caching finished.", oldUid);
                            };
                        }

                        subPageCache.append(iframe);
                        var cacheIFrame = $('iframe.' + newUid, subPageCache);
                        if (cacheIFrame && cacheIFrame.length == 1) {
                            //从缓存中加载内容
                            _mainFrame.children('div').html($('body', cacheIFrame[0].contentDocument).html());
                            if (callback && callback != '' && callback != undefined) {
                                setTimeout(function () {
                                    window.top.topPage.doPageFunction(event, callback, option);
                                }, 200);
                            }
                            return;
                        } else {
                            //激活标签
                            $('#diyTopMenuUl li', _this.formSelector).removeClass('active');
                            $(event.currentTarget).addClass('active');
                        }
                    } else {
                        //仅当前页查询携带参数
                        ajaxData = _this.getCurrentFormData(event);
                    }
                }
            }

            var dataUrl = _this.getTopDIYMenuActive().data('url');
            if (!$form.valid || $form.valid() && dataUrl) {
                var url = window.top.root + dataUrl;
                var headers = {};
                var isLoaded = $('#diyTopMenuUl', _this.formSelector);
                var isSoul = _this.getTopDIYMenuActive().attr('data-soul');
                //首次加载的菜单不需要请求头，需要取回默认时间；二次加载以后都会添加请求头。
                if (isSoul == 'true') {
                    headers = {
                        "Soul-Requested-With": "XMLHttpRequest"
                    }
                }
                //第三方链接、分页按钮、下拉框回调应使用查询参数
                if (event && $.isEmptyObject(ajaxData) &&
                    (
                        $(event.currentTarget).parent('li').parent('ul').hasClass('dropdown-menu')
                        || $(event.currentTarget).parent('li').parent('ul').hasClass('pagination')
                        || $(event.currentTarget).attr('name') === 'paging.pageSize'
                        || $('input[name="linkSearchHasReturn"]', _this.formSelector).val() === 'true'
                    )
                ) {
                    ajaxData = _this.getCurrentFormData(event);
                }
                window.top.topPage.ajax({
                    loading: true,
                    url: url,
                    headers: headers,
                    type: 'POST',
                    data: ajaxData,
                    success: function (data) {
                        var $result = $(".search-list-container", $form);
                        $result.html(data);
                        $form.attr('action', url);
                        $form.attr('uid', window.top.topPage.getUrlId(url));
                        if (callback && callback != '' && callback != undefined) {
                            window.top.topPage.doPageFunction(event, callback, option);
                        }
                        isLoaded.attr('loaded', 'true');
                        //第一次加载之后的请求均为soulAjax请求
                        $(event.currentTarget).attr('data-soul', 'true');
                        _this.clearLinkSearch(_this.formSelector);
                        if (event) {
                            event.page.onPageLoad();
                            $(event.currentTarget).unlock();
                        }
                    },
                    error: function (data, state, msg) {
                        //超时导致后台返回,安全密码验证不做任何处理
                        if (data.status !== undefined && data.status != null && data.status !== '' && data.status == 601) {
                            return;
                        }
                        window.top.topPage.showErrorMessage(data.responseText);
                        if (event) $(event.currentTarget).unlock();
                    }
                });
            } else {
                if (event) $(event.currentTarget).unlock();
            }
        },

        /**
         * 清除将链接参数
         * @param formSelector
         */
        clearLinkSearch: function (formSelector) {
            $('input.link-search-params', formSelector).val('');
        },

        //region 列表操作
        /**
         * 获取当前事件Form的列表选中的Id数组对象，针对Form Post提交
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        getSelectIds: function (e, option) {
            return {ids: this.getSelectIdsArray(e, option).join(",")};
        },
        /**
         * 获取当前事件Form的列表选中的Id数组
         * @param e             事件对象
         * @param option        Button标签的参数
         */
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
         * 点击取消选定全部记录
         * @param e
         */
        cancelSelectAll: function (e) {
            e.page = this;
            $('thead input[type=checkbox]').prop('checked', false);
            $('tbody input[type=checkbox]', this.getCurrentForm(e)).each(function (node, obj) {
                if (!$(obj).prop('disabled')) {
                    $(obj).prop('checked', false);
                }
            });
            $('thead .bd-none').addClass('hide');
            /*隐藏公共区域*/
            $(this.funMoreMenu).addClass("hide");
            $('tbody tr', this.getCurrentForm(e)).removeClass("open");
            this.toolBarCheck(e);
            $(e.currentTarget).unlock();
        },
        /**
         * 每行选定后背景色
         * @param ele
         * @param selected
         * @private
         */
        _isShowTotalRow: function () {
            var checkedRows = $("table tbody tr", this.formSelector).find("td:first").find("input[type=checkbox]:checked:not([name=my-checkbox])");
            $('#page_selected_total_record', this.formSelector).text(checkedRows.length);
            if (checkedRows.length > 1) {
                $('thead .bd-none').removeClass('hide');
            } else {
                $('thead .bd-none').addClass('hide');
                var checkedRows = $("tbody tr").removeClass("open");
            }
        },
        //endregion
        //region  自定义列表
        /**
         * 绑定更多自定义列表事件
         */
        moreData: function () {
            $(".more-data").off("click", this._moreData).on("click", this._moreData);
            $(".more-data-wrapper").off("mouseleave", this._moreDataOut).on("mouseleave", this._moreDataOut);
        },
        /**
         * 处理更多数据的鼠标离开事件
         * @param e
         * @private
         */
        _moreDataOut: function (e) {
            if ($(e.currentTarget).hasClass("more-data")) {

            }
            //$(".more-data").attr("slide", "0");
            //$(".more-wrapper").removeClass("show-data");
        },
        /**
         * 更多自定义列表
         * @param e
         * @private
         */
        _moreData: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var slide = $target.attr("slide");//查看或关闭标识
            if (slide != '1') {
                var href = $target.attr("data-href");
                $target.next().load(href, function () {
                    $target.attr("slide", "1");
                    $(".more-wrapper").addClass("show-data");
                });
            } else {
                $target.attr("slide", "0");
                $(".more-wrapper").removeClass("show-data");
            }
            $target.unlock();

        },
        /**
         * 刷新加载数据
         */
        loadMoreData: function () {
            var $target = $(".more-data");
            var href = $target.attr("data-href");
            $target.next().load(href, function () {
                $target.addClass("show-data");
            });
        },
        //endregion
        //region 自定义过滤
        /**
         * 显示选择的条件
         * @param e
         * @param option
         */
        showFiltersCallBack: function (e, option) {
            var _this = this;
            if (e.returnValue) {
                var arr = e.returnValue.result.content;
                var this_event = e;
                if (arr.length > 0) {
                    $(".filter-conditions dd").remove();
                    $(".filter-conditions").removeClass("hide");
                }

                for (var i = 0; i < arr.length; i++) {
                    var text = arr[i].text || '';
                    var strTmp = '<dd>' + arr[i].propertyName + arr[i].operatorName + '：' + text + '<a href="javascript:void(0)">×</a>' +
                        '<input type="hidden" name="query.criterions[' + i + '].property" value="' + arr[i].property + '" />';


                    if (arr[i].value == 'IS_NOT_NULL') {
                        strTmp += '<input type="hidden" name="query.criterions[' + i + '].operator" value="IS_NOT_NULL" />';
                    } else if (arr[i].value == 'IS_NULL') {
                        strTmp += '<input type="hidden" name="query.criterions[' + i + '].operator" value="IS_NULL" />';
                    } else {
                        strTmp += '<input type="hidden" name="query.criterions[' + i + '].operator" value="' + arr[i].operator + '" />';
                        var arrTemp = arr[i].value.split(",");
                        for (var j = 0; j < arrTemp.length; j++) {
                            strTmp += '<input type="hidden" name="query.criterions[' + i + '].value" value="' + arrTemp[j] + '" />';
                        }
                    }

                    strTmp += '</dd>';
                    $(".filter-conditions").append($(strTmp));
                }
                $(".filter-conditions dd a").bind("click", function (e1) {
                    $(e1.currentTarget.parentNode).remove();
                    e1.page = _this;
                    _this.query(e1, option);
                    if (!$(".filter-conditions dd").length) {
                        $(".filter-conditions ", this.formSelector).addClass("hide");
                    }
                });
                _this.query(e, option);
            }
        },
        /**
         * 获取页面上的选择的列和自定义过滤条件
         * @returns {{filters: (*|jQuery), ids: *}}
         */
        getFilters: function () {
            var btnOption = eval("(" + $(this.parentTarget).data('rel') + ")");
            return {
                filters: $(".filter-conditions dd"),
                ids: this.getSelectIds({currentTarget: this.parentTarget, page: this}, btnOption)
            };
        },

        /**
         * 搜索校验 precall
         * @param e
         * @param option
         * @returns {boolean}
         */
        checksearch: function (e, option) {
            $(".filter-conditions").find("dd").remove();
            $(".filter-conditions").addClass("hide");
            $(".search-params-div").find("dd").remove();
            var searchlist = $("#searchlist").val();
            if (!searchlist) {
                window.top.topPage.showWarningMessage(message.player['choose.search.list']);
                return false;
            }
            /*var searchtext = $("#searchtext").val();
             if (!searchtext) {
             window.top.topPage.showWarningMessage(message.player['input.search.text']);
             return false;
             }*/
            return true;
        },
        jsonToParams: function () {
            var data = $("#conditionJson").val();
            if (data) {
                var arr = eval("(" + data + ")");
                var old = $(".filter-conditions").find("dd").length;
                var strTmp = "";

                for (var i = 0; i < arr.length; i++) {
                    var idx = parseInt(old + i);
                    strTmp += '<dd><input type="hidden" name="query.criterions[' + idx + '].property" value="' + arr[i].property + '" />' +
                        '<input type="hidden" name="query.criterions[' + idx + '].operator" value="' + arr[i].operator + '" />';
                    var val = arr[i].value;
                    if (val != "") {
                        var vals = val.split(",");
                        for (var x = 0; x < vals.length; x++) {
                            var realVal = vals[x];
                            strTmp = strTmp + '<input type="hidden" name="query.criterions[' + idx + '].value" value="' + realVal + '" />';
                        }
                    } else {
                        strTmp = strTmp + '<input type="hidden" name="query.criterions[' + idx + '].value" value="" />';
                    }
                    strTmp = strTmp + "</dd>";
                }
                $(".search-params-div").html($(strTmp));
            }

        },
        validExportCount: function (e, opt) {
            var timestamp = Date.parse(new Date());
            window.top.ExportTimestamp = timestamp;
            var targetUrl = opt.target;
            if (targetUrl.indexOf("?") > -1) {
                targetUrl += "&exportTimestamp=" + timestamp;
            } else {
                targetUrl += "?exportTimestamp=" + timestamp;
            }
            opt.target = targetUrl;
            $(e.currentTarget).attr("disabled", true);
            var totalCount = $("[name='paging.totalCount']").val();
            if (totalCount) {
                totalCount = parseInt(totalCount);
                if (totalCount == 0) {
                    page.showPopover(e, {}, "warning", "查询无数据...", true);
                    $(e.currentTarget).unlock();
                    $(e.currentTarget).attr("disabled", false);
                    return false;
                }
                /*if(totalCount>100000){
                 page.showPopover(e,{},"warning","您当前筛选结果过大，最多导出10万条数据，请重新筛选后再导出！",true);
                 $(e.currentTarget).unlock();
                 $(e.currentTarget).attr("disabled",false);
                 return false;
                 }*/
                //当所有导出都改为export.html时，这个方法可以去除
                this.jsonToParams();
                return true;
            }

            $(e.currentTarget).unlock();
            return false;
        },
        gotoExportHistory: function (e, opt) {
            var _this = this;
            var totalCount = $("[name='paging.totalCount']").val();
            var msg = "正在导出" + totalCount + "条记录，可在导出历史中下载!";
            if (opt.data.state) {
                $(".search-params-div").html("");
                $(e.currentTarget).attr("disabled", true);
                page.showPopover(e, {}, "success", msg, false);
                setTimeout(function () {
                    e.popoverObj.popover("destroy");
                    _this.query(e);
                }, 2000);
            } else {
                $(e.currentTarget).attr("disabled", false);
                page.showPopover(e, {}, "danger", '导出失败', true);
            }
        },


        /**
         * 检查查询参数
         * @param e
         * @param opt
         */
        checkQueryParams: function (e, opt) {
            var _this = this;
            var checkUsername = true;
            var checkSiteId = true;
            var checkAmount = true;
            var checkRegisterIp = true;
            if ($(_this.checkUsernameClass, _this.formSelector).length > 0) {
                checkUsername = _this.checkUsernames($(_this.checkUsernameClass, _this.formSelector));
            }
            if ($(_this.checkSiteIdClass, _this.formSelector).length > 0) {
                checkSiteId = _this.checkSiteId($(_this.checkSiteIdClass, _this.formSelector));
            }
            if ($(_this.checkAmountClass, _this.formSelector).length > 0) {
                checkAmount = _this.checkAmount($(_this.checkAmountClass, _this.formSelector));
            }
            if ($(_this.checkRegisterIpClass, _this.formSelector).length > 0) {
                checkRegisterIp = _this.checkRegisterIp($(_this.checkRegisterIpClass, _this.formSelector));
            }
            $(e.currentTarget).unlock();
            return checkUsername && checkSiteId && checkAmount && checkRegisterIp;
        },

        /**
         * 检查多用户名
         * 1.格式
         * 2.分隔符
         * @param node
         */
        checkUsernames: function (node) {
            var _this = this;
            var errorMsg = '';
            var checkSuccess = true;
            var usernames = $(node).val();
            var _e = {currentTarget: $(node), page: page};
            if (usernames != '' && usernames != null && usernames != undefined) {
                if (usernames.indexOf('，') != -1) {
                    checkSuccess = false;
                    errorMsg = '多账号查询请用半角逗号隔开';
                } else if (usernames.indexOf(',') != -1) {
                    var nameArray = usernames.split(',');
                    for (var i = 0; i < nameArray.length; i++) {
                        if (!_this.usernameRegex.test(nameArray[i])) {
                            checkSuccess = false;
                            errorMsg += '[' + nameArray[i] + ']';
                        }
                    }
                    if (!checkSuccess) {
                        errorMsg = errorMsg + ':账号格式不正确，请重新输入';
                    }
                } else if (!_this.usernameRegex.test(usernames)) {
                    checkSuccess = false;
                    errorMsg = '账号格式不正确，请重新输入';
                }
            }
            if (!checkSuccess) {
                page.showPopover(_e, {}, 'warning', errorMsg, true);
            }

            return checkSuccess;
        },

        /**
         * 检查金额
         */
        checkAmount: function (node) {
            var _this = this;
            var errorMsg = '';
            var checkSuccess = true;
            var amount = $(node).val();
            var _e = {currentTarget: $(node), page: page};
            if (amount != '' && amount != null && amount != undefined) {
                if (!_this.moneyRegex.test(amount)) {
                    checkSuccess = false;
                    errorMsg = '金额格式不正确，请重新输入';
                } else if (amount <= 0 || amount > 99999999) {
                    checkSuccess = false;
                    errorMsg = '金额必须小于等于99999999!';
                }
            } else {
                checkSuccess = false;
                errorMsg = '默认金额不能为空，请重新输入';
            }
            if (!checkSuccess) {
                page.showPopover(_e, {}, 'warning', errorMsg, true);
            }
            return checkSuccess;
        },

        checkRegisterIp: function (node) {
            var _this = this;
            var errorMsg = '';
            var checkSuccess = true;
            var registerIp = $(node).val();
            var _e = {currentTarget: $(node), page: page};
            if (registerIp != '' && registerIp != null && registerIp != undefined) {
                if (!_this.registerIpRegex.test(registerIp)) {
                    checkSuccess = false;
                    errorMsg = 'IP格式不正确，请重新输入';
                }
            }
            if (!checkSuccess) {
                page.showPopover(_e, {}, 'warning', errorMsg, true);
            }
            return checkSuccess;
        },
        /**
         * 检查站点id参数
         * 同步请求，需确认返回值
         * @param node
         * @returns {boolean}
         */
        checkSiteId: function (node) {
            var checkSuccess = true;
            var _e = {currentTarget: $(node), page: page};
            var siteId = $(node).val();
            var errorMsg = '';
            if (siteId == '' || siteId == null || siteId == undefined) {
                if (node.attr('checkEmpty') == 'false') {
                    checkSuccess = true;
                    console.log('checkEmpty=false，站点为空允许查询')
                } else {
                    errorMsg = '请先输入站点ID';
                    checkSuccess = false;
                }
            } else if (!(/^[0-9]{1,5}$/.test(siteId))) {
                errorMsg = '站点ID不正确';
                checkSuccess = false;
            } else {
                window.top.topPage.ajax({
                    url: window.top.root + '/remote/checkSite.html',
                    type: 'POST',
                    data: {'siteId': siteId},
                    dataType: 'JSON',
                    async: false,
                    success: function (data) {
                        checkSuccess = data;
                        if (!checkSuccess) {
                            page.showPopover(_e, {}, 'warning', '站点不存在', true);
                        }
                    },
                    error: function (xhr) {
                        checkSuccess = false;
                        console.log('站点检查服务异常:' + xhr.status);
                    }
                });
            }
            if (!checkSuccess) {
                page.showPopover(_e, {}, 'warning', errorMsg, true);
            }
            return checkSuccess;
        },

        resetCondition: function (e, opt) {
            var _this = this;
            $("#clearQueryParam").trigger('click');
            $("input[name='search.username']").val("");
            $("input[name='search.userName']").val("");
            $("input[name='search.playerName']").val("");
            $("input[name='search.agenterName']").val("");

            $("input[name='search.expect']").val("");
            $("input[name='search.billNo']").val("");
            $("input[name='search.ipStr']").val("");
            $("input[name='search.checkName']").val("");
            $("input[name='search.minMoney']").val("");
            $("input[name='search.maxMoney']").val("");

            $("input[name='search.origins']").eq(0).attr('checked', true);
            $("input[name='search.origin']").eq(0).attr('checked', true);

            $("button[data-type='clear']").trigger('click');
            $("input[name='search.startTime']").val("");
            $("input[name='search.endTime']").val("");
            $("input[name='search.queryStartDate']").val("");
            $("input[name='search.queryEndDate']").val("");
            $("input[name='search.checkTimeStart']").val("");
            $("input[name='search.checkTimeEnd']").val("");
            $("input[name='search.createTimeBegin']").val("");
            $("input[name='search.createTimeEnd']").val("");

            //系统日志
            $("input[name='search.operatorBegin']").val("");
            $("input[name='search.operatorEnd']").val("");
            $("input[name='search.operator']").val("");
            $('input[name="search.moduleType"]').val('');
            $('input[name="search.operateType"]').val('');
            $('input[name="search.operatorUserType"]').val('');
            $('input[name="keys"]').val('');
            $('input[name="search.siteId"][data-reset="true"]').val('');
            var moduleType = $('div[selectdiv="search.moduleType"]');
            var keys = $('div[selectdiv="keys"]');
            var operateType = $('div[selectdiv="search.operateType"]');
            var operatorUserType = $('div[selectdiv="search.operatorUserType"]');
            //只需要 trigger 其中一个就行
            if (moduleType.length > 0) {
                $('.dropdown-menu a:first', moduleType).trigger('click');
            } else if (keys.length > 0) {
                $('.dropdown-menu a:first', keys).trigger('click');
            } else if (operateType.length > 0) {
                $('.dropdown-menu a:first', operateType).trigger('click');
            } else if (operatorUserType.length > 0) {
                $('.dropdown-menu a:first', operatorUserType).trigger('click');
            }

            $('input[name="search.superiorName"]').val("");
            $("input[name='search.lastLoginTimeBegin']").val("");
            $("input[name='search.lastLoginTimeEnd']").val("");
            $("input[name='search.payoutStartDate']").val("");
            $("input[name='search.payoutEndDate']").val("");
            $("input[name='search.queryDate']").val("");
            $("input[name='search.searchFrom']").val("");
            $("input[name='search.searchType']").val("");
            $("input[name='search.siteId']").val("");
            $("input[name='search.id']").val("");
            $(".rankText").text('请选择');
            $(".tranTypeNum").text('请选择');

            if (e) {
                _this.cancelSelectAll(e);//清除多选操作
                $(e.currentTarget).unlock();
            }

        },
        //endregion

    });
});