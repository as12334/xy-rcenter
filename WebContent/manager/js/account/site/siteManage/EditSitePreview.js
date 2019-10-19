/**
 * Created by tom on 15-11-19.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "#editSitePreviewForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();

        },

        onPageLoad: function () {
            this._super();
        },

        goSiteTemplate: function (e, option) {
            var url = root + '/vSysSiteManage/siteTemplate.html';
            var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;
            window.top.topPage.ajax({
                type: "POST",
                data: {'search.step': 3},
                url: url,
                success: function (data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data)
                        }
                    });
                },
                error: function (data) {
                    window.top.topPage.showConfirmMessage(window.top.message.common['build.failed']);
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 站点基本信息
         * @param e
         * @param option
         */
        goSiteBasic: function (e, option) {
            var url = root + '/vSysSiteManage/siteBasic.html';
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: "POST",
                data: data,
                url: url,
                success: function (data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data)
                        }
                    })
                },
                error: function (data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        submit: function (e, option) {
            var url = root + '/vSysSiteManage/submit.html';
            /*var data = window.top.topPage.getCurrentFormData(e);
            var _this = this;*/
            window.top.topPage.ajax({
                type: "POST",
                data: {'search.step': 5, 'gb.token': $("[name='gb.token']").val()},
                url: url,
                success: function (data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data)
                        }
                    })
                },
                error: function (data) {
                    window.top.topPage.showErrorMessage("建站失败!");
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 图片预览
         * @param e
         * @param opt
         */
        imageSilde: function (e, opt) {
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
            window.top.topPage.imageSilde(e, opt);
        }
    });
});