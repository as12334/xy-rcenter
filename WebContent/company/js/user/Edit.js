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

        },

        onPageLoad: function () {

        }
    })
});