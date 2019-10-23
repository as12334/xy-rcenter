
define(['common/BaseEditPage', 'bootstrapswitch'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editDomainForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            var _this = this;
        },
        saveDomain:function(e){
            var that = this;
            //设为默认
            $("input[name='result.isDefault']").val($("#isDefault",that.formSelector).is(":checked"));
            if (!this.validateForm(e)) {
                return false;
            }
            return true;
        } ,
    });
});