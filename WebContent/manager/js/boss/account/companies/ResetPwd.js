define(['common/BaseEditPage','bootstrapswitch'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "form[name='resetPwdEditForm']";
            this._super(this.formSelector);
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
        },
    })

});
