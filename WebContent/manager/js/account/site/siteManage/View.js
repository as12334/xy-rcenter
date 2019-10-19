define(['common/BaseEditPage', 'zeroClipboard'], function (BaseEditPage, ZeroClipboard) {
    return BaseEditPage.extend({

        init: function (title) {
            this.formSelector = "#bulidSiteSuccessForm";
            this._super(this.formSelector);

        },

        onPageLoad: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();
            this.copyText('[name="copy"]');
        }
    });
});