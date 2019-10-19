define(['common/BaseListPage'], function (BaseListPage) {

    return BaseListPage.extend({
        init: function (formSelector) {
            this.formSelector = "#editSiteTemplateForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();
        },

        onPageLoad: function () {
            this._super();

            var _this = this;
            $(this.formSelector).off("click", ".sys_tab_wrap li");
            $(this.formSelector).on("click", ".sys_tab_wrap li", function (e) {
                $(_this.formSelector).find(".sys_tab_wrap li").removeClass("active");
                $(e.currentTarget).addClass("active");
                var url = root + $(e.currentTarget).children().attr("url");
                window.top.topPage.ajax({
                    loading: true,
                    url: url,
                    data: _this.getCurrentFormData(e),
                    headers: {
                        "Soul-Requested-With": "XMLHttpRequest"
                    },
                    type: "post",
                    success: function (data) {
                       // var $result = $(".search-list-container", _this.formSelector);
                        $("#mainFrame").children("div").each(function () {
                            if($(this).css("display")=="block"){
                                var _this=$(this).find("form .search-list-container");
                                _this.html(data)
                            }
                        });
                      //  $result.html(data);
                        _this.onPageLoad();
                        $(_this.formSelector).attr("action", url);
                    },
                    error: function (data, state, msg) {
                        window.top.topPage.showErrorMessage(data.responseText);
                    }
                });
            })

        },

        /**
         * 选择使用模板
         * @param e
         * @param option
         */
        chooseTemplate:function(e,option) {
            var jsonRel = eval("(" + $(e.currentTarget).data('rel') + ")");
            var $tmp;
            if (jsonRel.themeType == '1') {
                $tmp = $("[name='pcThemes.code']");
                if (!!$tmp.val()) {
                    $("span.hint-badge").remove();
                }
                $tmp.val(jsonRel.code);
                $("[name='pcThemes.picPath']").val(jsonRel.picPath);
                $("[name='pcThemes.id']").val(jsonRel.themeid);
                $("[name='pcThemes.feeType']").val(jsonRel.feeType);
            } else {
                $tmp = $("[name='mobilesThemes.code']");
                if (!!$tmp.val()) {
                    $("span.hint-badge").remove();
                }
                $tmp.val(jsonRel.code);
                $("[name='mobilesThemes.picPath']").val(jsonRel.picPath);
                $("[name='mobilesThemes.id']").val(jsonRel.themeid);
                $("[name='mobilesThemes.feeType']").val(jsonRel.feeType);
            }
            $(e.currentTarget).parents("div.change-logo").children(":first").append("<span class='hint-badge' style='color: #1EAB41'>已选</span>");
            $(e.currentTarget).unlock();
        },
        /**
         * 选择模板--上一步
         * @param e
         * @param option
         */
        goSiteNetScheme:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetQuota.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data);
                            var key = $("#editSiteNetSchemeOpenForm").find("[name='sysUserGameRelationsOpen.groupId']").val();
                            if(key!=null && key!=""){
                                var url = root + '/vSysSiteManage/gameOpen.html';
                                window.top.topPage.ajax({
                                    type: "POST",
                                    data: {"search.id":key},
                                    url: url,
                                    success: function (data) {
                                        $("#gameGroupOpen").html(data);
                                    },
                                    error: function (data) {
                                        $(e.currentTarget).unlock();
                                    }
                                });
                            }

                        }
                    })
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        goSitePreview:function(e,option) {
            var url = root+'/vSysSiteManage/sitePreview.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data)
                        }
                    })
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        imageSilde:function(e,opt)
        {
            var ary = [];
            var previewId = opt.previewId;
            ary.push($("#preview_"+previewId).attr("src"));
            var max = $("img.preview").length;
            if((parseInt(previewId)+1)<max){
                for(var i=(parseInt(previewId)+1);i<max;i++){
                    ary.push($("#preview_"+i).attr("src"));
                }
                for(var i=0;i<previewId;i++){
                    ary.push($("#preview_"+i).attr("src"));
                }
            }else{
                for(var i=0;i<max;i++){
                    ary.push($("#preview_"+i).attr("src"));
                }
            }

            e.imgs = ary;
            window.top.topPage.imageSilde(e,opt);
        },

        /**
         * 保存或更新前验证
         * @param e   事件对象
         * @return 验证是否通过
         */
        validateForm: function(e) {
            var $form = $(window.top.topPage.getCurrentForm(e));
            return !$form.valid || $form.valid();
        }
    });
});