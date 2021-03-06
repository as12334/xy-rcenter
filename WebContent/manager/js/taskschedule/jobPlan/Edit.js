/**
 * Created by mark on 15-7-14.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            var _this = this;
            this._super();
            $("[name='result.jobTimeType']",_this.formSelector).click(function () {
                var val = "";
                $("[name='result.jobTimeType']",_this.formSelector).each(function (idx, item) {
                    if($(item).prop("checked")){
                        val = $(item).val();
                    }
                })
                //
                //
                if(val == "1"){
                    $("#fixedValue-div").removeClass("hide");
                    $("#periodValue-div").addClass("hide");
                    $(".jobTimeType-perild").addClass("hide");
                }else{
                    $("#fixedValue-div").addClass("hide");
                    $("#periodValue-div").removeClass("hide");
                    $(".jobTimeType-perild").removeClass("hide");
                }
            });

            $("[name='result.jobTimeUnit']",_this.formSelector).click(function () {
                var type = $("[name='result.jobTimeType']:checked",_this.formSelector).val();
                var unit = $("[name='result.jobTimeUnit']:checked",_this.formSelector).val();
                var val = unit;
                if(type=="1"){
                    if(val=="4"){
                        $("#month-select").addClass("hide");
                        $("#day-select").addClass("hide");
                    }else if(val=="5"){
                        $("#month-select").addClass("hide");
                        $("#day-select").removeClass("hide");
                    }else if(val=="7"){
                        $("#month-select").removeClass("hide");
                        $("#day-select").removeClass("hide");
                    }
                }

            });
        },
        onPageLoad: function () {
            var _this = this;
            this._super();
            $('[data-toggle="popover"]', _this.formSelector).popover({
                trigger: 'hover',
                placement: 'top'
            });
        }
    });
});