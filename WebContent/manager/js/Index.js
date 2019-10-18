define(['common/BaseListPage','bootstrapswitch'], function (BaseListPage) {
    return BaseListPage.extend({
        status: {
            'true': '._enable',
            'false': '._disabled'
        },
        init: function (formSelector) {
            this._super();
            this.startProps();
        },

        bindEvent: function () {
            this._super();
        },

        onPageLoad: function () {
            this._super();
        },

        startProps:function () {
            var props ={};
            props.url ="http://192.168.0.174:8097/mdcenter/message.comet";
            props.subscribes ="SITE_ANN,NEW_BILL";
            props.successCallBack = function (id) {
                console.log("连接成功");
            };
            props.failureCallBack =function () {
                console.log("连接失败,请联系管理员");
            };
            props.acceptCallBack =function (data) {
                alert(data);
            };
            props.disConCallBack=function () {
            };
            window.top.cometNew.cometConnStart(props);

        },
        bindEvent: function () {
            this._super();
        },


        onPageLoad: function () {
            this._super();
        },
        startprops:function () {

        }
    });
});

