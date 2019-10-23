define(['common/BaseEditPage','jqFileInput','css!themesCss/fileinput/fileinput'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#siteMerChantEdit1";
            this._super(this.formSelector);
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            this.initFileUpload();
        },
        initFileUpload: function () {
            this.unInitFileInput($('.file'))
                .fileinput({
                    showUpload: false,
                    maxFileCount: 1,
                    maxFileSize: 1024,
                    mainClass: "input-group",
                    removeLabel: '删除',
                    browseLabel: '浏览',
                    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                    msgInvalidFileExtension: '仅支持jpg,jpeg,png,gif等类型的图片',
                    msgValidationError: '图片上传失败',
                    msgSizeTooLarge: '您上传的图片大于1M，无法上传，请重新选择.'
                }).bind("filecleared", function (e) {
                e.fileInput.$container.prev().show();
                e.fileInput.$container.next().val(e.fileInput.$container.next().next().val());
                e.fileInput.$container.parent().next().children().attr("src", "");
            }).bind("fileloaded", function (e) {
                e.fileInput.$container.prev().hide();
                e.fileInput.$container.next().val("hasUploaded");
                e.fileInput.$container.parent().removeClass("error");
            });
        },

        preSave:function(event , option ){
            event.objId = 'logo';
            event.catePath = 'site';
            var flag = this.uploadAllFiles( event, option);
            if(!flag){
                return false;
            }
            var _this = this;
            /*未通过 表单验证*/
            if (!_this.validateForm(event)) {
                return false;
            }
            if ($('.file-error-message:visible').length > 0) {
                return false;
            }
            return true;
        },

        myValidateForm: function (e, opt) {
            if (!this.validateForm(e)) {
                $(e.currentTarget).unlock();
                return false;
            }
            this.preSave(e ,opt);
        },

    })

});
