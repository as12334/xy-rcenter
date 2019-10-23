//模板页面
define(['common/BaseEditPage'], function(BaseEditPage) {

    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "#merchantSitAreaEditForm";
            this._super(this.formSelector);
            this.resizeDialog();
            this.loadField();

        },
        /**
         * 页面加载和异步加载时需要重新初始化的工作
         */
        onPageLoad: function () {
            /**
             * super中已经集成了
             *      验证、
             *      chosen Select
             * 控件的初始化
             */
            this._super();
            var endTimeVal=$("#endTimeVal").val();
            if(endTimeVal.length<1){
                $("[name='result.endTime']").val($("[name='dateList1']").val());
            }
        },
        /**
         * 当前页面所有事件初始化函数
         */
        bindEvent: function () {
            this._super();
        },
        showLimitType: function (e,opt) {
            var key = e.key;
            var dataval=$("#timeLimit_"+key).val();
            var val=parseInt(key);
            if(val==8){
                $(".endTime").removeClass('hide');
                $(".stop").addClass('hide');
                $("[name='result.endTime']").val("");
                $("#showTime").text("");
            }else{
                $("[name='result.endTime']").val(dataval);
                if(val=="1"){
                    $("#showTime").text("----");
                }else{
                    $("#showTime").text(dataval);
                }

                $(".endTime").addClass('hide');
                $(".stop").removeClass('hide');
            }
            this.resizeDialog();
        },
        loadField: function () {
            var _this = this;
            var timeType=$("#timeType").val();
            if(timeType=="8"){
                $(".endTime").css('display','');
                _this.resizeDialog();
            }
        }
    });
});