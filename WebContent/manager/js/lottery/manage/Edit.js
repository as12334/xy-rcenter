define(['common/BaseEditPage', 'UE.I18N.'+window.top.language], function (BaseEditPage) {
    var that;
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#lotteryEditForm";
            this._super();
            var _this = this;
        },
        bindEvent:function(){
            that = this;
            this._super();

        },
        onPageLoad:function(){
            this._super();
        },
        selectAll:function (e) {
            $("input[name=siteLottery]").each(function(){
                $(this).prop("checked",true);
            })
            $(e.currentTarget).unlock();
        },
        selectNoAll:function (e) {
            $("input[name=siteLottery]").each(function(){
                $(this).prop("checked",false);
            })
            $(e.currentTarget).unlock();
        }
    })
});