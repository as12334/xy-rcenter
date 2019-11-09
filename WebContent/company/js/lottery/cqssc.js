define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#edidOddForm";
            this._super();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;


        },
        onPageLoad: function () {
            this._super();
            var _this = this;
        },




        saveValid: function (e) {
            var _this=this;
            // if(!this.validateForm(e)){
            //     return false;
            // }
            window.top.topPage.ajax({
                url: root+"/vSiteUser/saveManagerUser.html",
                async:false,
                dataType:'json',
                data:_this.getCurrentFormData(e),
                success: function (data) {
                    alert(data.msg);
                    $(".navListBox .onBtn").click();
                },
                error: function (e) {
                }
            });
        },
    })
});