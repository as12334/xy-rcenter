define(['common/BaseListPage', 'bootstrap-dialog','bootstrapswitch'], function(BaseListPage,BootstrapDialog) {
    return BaseListPage.extend({
        bootstrapDialog: BootstrapDialog,
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        init: function () {
            this.formSelector = "#mainFrame #bossSiteManagerForm";
            this._super(this.formSelector);

        },

        onPageLoad: function () {
            this._super();
            var _this=this;
            $(_this.formSelector).on("keyup","input[name='search.domain']", function () {
                var domain = $(this).val();
                domain = domain.replace("http://","");
                var index = domain.indexOf("/");
                if(index>-1){
                    domain = domain.substring(0,index);
                }
                $(this).val(domain);
            });
            $(_this.formSelector).on("keyup","input", function () {
                var domain = $(this).val();
                domain = domain.replace(/\s+/g,'');
                $(this).val(domain);
            })
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            $(this.formSelector).on("click",".remark",function (e) {
                var remark=$(e.currentTarget).next("div[style='display: none']").text();
                BootstrapDialog.show({
                    title: '备注',
                    message: remark,
                    draggable: true
                });

            });
        },
    });
});