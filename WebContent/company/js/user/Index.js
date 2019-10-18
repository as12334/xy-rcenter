define(['dialogPlus'],function (dialog) {
    return Class.extend({
        init: function () {
            this.formSelector = "#mainFrame";
            // this._super(this.formSelector);
            this.bindEvent();
            this.onPageLoad();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            // this._super();
            var _this = this;
            var param = $("#magAdd").data("usertype");
            $(this.formSelector).on("click", "#magAdd", function () {
                dialog({
                    id: 'topDialog',
                    title: "在線",
                    url: root+ '/vUserManager/createManagerUser.html?search.userType='+param,
                    fixed: true,
                    onreset: function () {
                    },
                    oniframeload: function () {
                        this.reset()
                    }
                }).showModal();
            });
        },

        onPageLoad: function () {

        }
    })
});