define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "#siteShareHolderEdit";
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
