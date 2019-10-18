/**
 * Created by snekey on 15-8-13.
 */
define(['common/BaseListPage','bootstrapswitch'], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            this._super();
        },

        bindEvent: function () {
            this._super();

        },
        onPageLoad: function () {
            this._super();
        },
        initScheduler: function (e , option) {
            var $scheduler = $("input[name='search.scheduler']");
            var scheduler = select.getValue($scheduler);
            var text = "全部调度器初始化确认?初始化将覆盖原有的内容.";
            if(scheduler != ''){
                text = "调度器：["+select.getSelected($scheduler).text()+"]初始化确认?初始化将覆盖原有的内容."
            }
            window.top.topPage.showConfirmMessage(text, function (confirm) {
                if (confirm) {
                    window.top.topPage.ajax({
                        url: root + "/taskSchedule/initTaskSchedule.html",
                        dataType: 'json',
                        data: {"scheduler": scheduler},
                        success: function (data) {
                            if(data.state){
                                page.showPopover(e,option,"success",data.msg,true);
                            }else{
                                page.showPopover(e,option,"danger",data.msg,true);
                            }
                            $(e.currentTarget).unlock();
                        },
                        error: function (data) {
                            if (data.status != 601){
                                page.showPopover(e,option,"danger","操作异常",true);
                            }
                            $(e.currentTarget).unlock();
                        }
                    });
                } else {
                    $(e.currentTarget).unlock()
                }
            });
        },
        /**
         * 操作回调，event.returnValue==true时才执行 query方法，
         * 其他的操作回调，请参考这里，不要任何时候都执行刷新操作
         * @param event
         * @param option
         */
        callBackQuery:function(event,option)
        {
            if(!$("div[role='tooltip']").hasClass('danger')){
                this.query(event,option);
            }
        }
    })
});
