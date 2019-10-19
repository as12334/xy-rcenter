define(['common/BaseEditPage', 'jqFileInput', 'UE.I18N.' + window.top.language, 'css!themesCss/fileinput/fileinput'], function (BaseEditPage) {

    return BaseEditPage.extend({
        maxRange: 30,
        ue: null,
        init: function (formSelector) {
            this.formSelector = "#addSysSiteForm";
            this._super(this.formSelector);

            /*默认选中国
            * */
            var commond =  $("#editSiteBasicCN")
            if(commond.next().attr("class") === "selected"){

            }else{
                if(commond.data("value") === "CN"){
                    var $this = commond.next();
                    var $index =  $this.data("index");
                    var $value =  $this.data("value");
                    $this.toggleClass("selected");
                    var $a = $this.parents("div.col-sm-5").find("a.pic");
                    $this.parent().find("input[data-index="+$index+"]").val($value);
                    $a.text($a.text()?parseInt($a.text())+1:1);
                    $this.parents("dd").find("input[name$='Num']").val($a.text());
                    if ($this.parent().children("a").length==parseInt($a.text())) {
                        $this.parents("div.col-sm-5").find("[name='selectAll']").prop("checked",true);
                    }
                }
            }


        },
        bindEvent: function () {
            this._super();
            var _this = this;
            /**
             * 返回上级
             */
            $(this.formSelector).on("click",".returnSuperior",function (e) {
                var lastTimeSearch=$("a [name='lastTimeSearch']",_this.formSelector).val();
                if(lastTimeSearch!=undefined){
                    var data_url=$("#tab-scroll .active a").attr("data-url");
                    var arr=data_url.split("#");
                    data_url=arr[0].split("?")[0]+"?lastTimeSearch="+lastTimeSearch+"#"+arr[1];
                    $("#tab-scroll .active a").attr("data-url",data_url);
                }

            });



        },

        onPageLoad: function () {
            this._super();
            this.initFileUpload();
            this.initUEditor();
        },

        /**
         * 筛选条件第一列的下拉框点击事件
         */
        selectChange:function(event,option){
            window.top.topPage.ajax({
                url:root+"/vSysSiteManage/getDateByTimeZone.html",
                dataType:'JSON',
                data:{"timeZone":$("[name='result.timezone']").val()},
                success: function(data) {
                    $("#tz").text(data.time);
                },
                error: function() {
                    $(event.currentTarget).unlock();
                }
            });
            $(event.currentTarget).unlock();
        },


        /**
         * 跳转到列表页
         */
        saveCallbak:function(){
            $("#editTest").attr('href','/boss/account/shareholder/shareholderList.html');
            $("#editTest").click();
        },

        /**
         * 跳转到列表页
         */
        saveCallbakMch:function(){
            $("#editTestMch").attr('href','/boss/account/merchant/merchantList.html');
            $("#editTestMch").click();
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
                    msgSizeTooLarge: '您上传的图片大于1M，无法上传，请重新选择.',
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

        /**
         * 图片上传
         * @param e
         * @param opt
         * @returns {boolean}
         */
        uploadFile: function (e, opt) {
            e.objId = 'logo';
            e.catePath = 'site';
            $(e.currentTarget).unlock();
            var flag = this.uploadAllFiles(e, opt);
            if (!flag) {
                $(e.currentTarget).unlock();
                return false;
            }
            if (!this.validateForm(e)) {
                return false;
            }
            if ($('.file-error-message:visible').length > 0) {
                return false;
            }
            return true;
        },

    });
});