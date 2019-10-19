define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "#editCompanyForm";
            this._super(this.formSelector);
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
        },

        /**
         * 更换用户类型
         * @param e
         * @param option
         */
        changeUserType: function (e, option) {
            var userType = e.key;
            //只有子账号才需分配角色
            if (userType == '01' || userType == '11' || userType == '21' || userType == '221') {
                $("#role").show();
            } else {
                $("#role").hide();
                $("input[name='roleIds']").prop("checked", false);
            }
        }

    })

});