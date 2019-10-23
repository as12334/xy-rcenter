define(['common/BaseListPage'], function (BaseListPage) {
    return BaseListPage.extend({

        init: function (title) {
            this.formSelector = "#shSiteViewForm2";
            this._super(this.formSelector);
        },

        onPageLoad: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
        },

    });
});