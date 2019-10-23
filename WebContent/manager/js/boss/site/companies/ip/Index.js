define(['common/BaseListPage','bootstrap-dialog','bootstrapswitch'], function(BaseListPage,BootstrapDialog,Bootstrapswitch) {
    return BaseListPage.extend({
        bootstrapswitch:Bootstrapswitch,
        bootstrapDialog: BootstrapDialog,

        init: function () {
            var _this = this;
            this.formSelector = "#shareHolderMainFrameIp";
            this._super();
            this.unInitSwitch($("[name='my-checkbox']",_this.formSelector))
                .bootstrapSwitch();
        },

        onPageLoad: function () {
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            var _this = this;
            this._super();
            var type=parseInt($("#type",this.formSelector).val())+1;
            $("#li_top_"+type,_this.formSelector).addClass("active");
            $(_this.formSelector).on("hidden.bs.modal",'#myModal', function (e) {
                var _e = {
                    currentTarget: e.currentTarget,
                    page: _this,
                };
                _this.query(_e);
            });

            /**
             * 有标签页时调用
             */
            _this.initShowTab();
            /**
             * 有详细展开时调用
             */
            _this.initShowDetail();
        },
        confirmMessage: function (e,option) {
            var _this=this;
            window.top.topPage.ajax({
                url: root+"/siteConfineIp/selectIds.html",
                dataType:'json',
                data:_this.getSelectIds(e,option),
                success: function (data) {
                    if(data){
                        _this.getDeleteMsg(e,option,window.top.message.setting['siteConfine.ip.delete.usingMsg']);
                    }else{
                        _this.getDeleteMsg(e,option,window.top.message.common['delete.deleteConfirm']);
                    }
                }
            });
        },
        getDeleteMsg:function(e,option,message){
            var _this=this;
            window.top.topPage.bootstrapDialog.show({
                type: BootstrapDialog.TYPE_PRIMARY,
                title: window.top.message.common['msg'],
                message:message,
                buttons: [{
                    label: window.top.message.common['del'],
                    action: function (dialog) {
                        window.top.topPage.doAjax(e, option);
                        dialog.close();
                    }
                }, {
                    label: window.top.message.common['cancel'],
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
            return false;
        },
        //首次添加需弹出提示框
        oneDialog: function (e) {
            var _this=this;
            var listSize=$("#listSize",_this.formSelector).val();
            var type=$("#type",_this.formSelector).val();
            var active=$("#active",_this.formSelector).val();
            if(listSize==0&&(type=='3'||type=='2')&&active=='false'&&e.returnValue){
                $("#showButton",_this.formSelector).click();
            }else{
                var _e = {
                    currentTarget: e.currentTarget,
                    page: _this,
                };
                _this.query(_e);
            }
        },
        //关闭弹窗
        closeModal: function () {
            var _this = this;
            $('#myModal',_this.formSelector).modal('hide');

        }
    });
});