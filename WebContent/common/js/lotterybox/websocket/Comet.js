/**
 *
 */

function SiteComet() {

}

SiteComet.prototype = {

    /** 请求参数名：同步 */
    SYNCHRONIZE_KEY: "_S_COMET",
    /** 同步值：创建连接 */
    CONNECTION_VALUE: "C",
    /** 同步值：断开连接 */
    DISCONNECT_VALUE: "D",
    /** 返回参数名：连接ID */
    CONNECTIONID_KEY: "_C_COMET",
    /** 请求参数名：消息订阅类型 */
    SUBSCRIBE_TYPE: "_S_TYPE",
    /** 同步值：消息订阅 */
    SUBSCRIBE_VALUE: "R",
    /** 同步值：消息回传 */
    BACK_VALUE: "B",
    /** 同步值：消息回传key */
    BACK_KEY: "_B_COMET",
    last_active_time: new Date().getTime(),
    accept: function (data) {
        var message;
        if (typeof(data) == "object") {
            message = data;
        } else {
            message = eval("(" + data + ")");
        }
        if (!(message._S_COMET && message._S_COMET == "S")) {//只处理非连接超时消息。
            console.info("收到消息,消息内容为：" + data);
            var subscribeType = message.subscribeType;
            $.each(this.subscribes, function (i, val) {
                if (val.type == subscribeType) {
                    val.callBack.call(val, data);
                    if (val.back) {
                        val.back.call(val, data);
                    }
                    return false;
                }
            })
        }
    },
    /** 连接的语言类型参数名 */
    LOCALE_TYPE: "_LOCALE_TYPE",
    /** 连接的sessionID 参数名**/
    SESSION_KEY: "_SESSION_KEY",
    async: true,
    /** 是否在连接状态 */
    isConnect: false,
    /**订阅列表**/
    subscribes: [],
    /** 连接所需要传递的参数 **/
    userParam: {},
    /**连接成功后的回调函数**/
    successCallBack: function () {
    },
    /**连接失败后的回调函数**/
    failureCallBack: function () {
    },
    /**实例化后是否立即执行连接操作**/
    isImmediatelyConnect: false,
    /**
     * 构造器
     * @param props 参数对象
     */
    initParameter:function(){
        var param = {
            localeType: language.replace("-", "_"), isImmediatelyConnect: true
        };
        var _this = this;
        var popUp = new SitePopUp();
        param.success = function () {
            console.info("connect success..");
            subscribes = [
                {subscribeType: "PCENTER-popUp-Notice", callBack: popUp.callBack},
                {subscribeType: "SYS_ANN", callBack: popUp.callBack},
                {subscribeType: "SITE_ANN", callBack: popUp.callBack},
                {subscribeType: "PCENTER-dialog-Notice", callBack: popUp.callBack},
                {subscribeType: "MSITE-Player-Withdraw-Notice", callBack: popUp.callBack},
                {subscribeType: "MSITE-Player-Announcement-Notice", callBack: popUp.callBack},
                {subscribeType: "MCENTER_READ_COUNT", callBack: popUp.callBack},
                {subscribeType: "MSITE-ONLINERECHARGE", callBack: popUp.callBack},
                {subscribeType: "MSITE_DIGICCY_REFRESH_BALANCE", callBack: popUp.callBack}
            ];
            _this.subscribeMsgs(subscribes);
        };
        param.failure = function () {
            console.info("connect failed..");
            //console.info(window.top.message.index_auto['连接失败']);
        };

        return param;
    },

    init: function (options) {
        var _this = this;

        var props = _this.initParameter();
        _this.websocket = null;
        var wsProtocol = 'https:' == document.location.protocol ? "wss://" : "ws://";
        var wsPort = document.location.port != ""?(":"+document.location.port):"";
        _this.url_websocket = wsProtocol + document.domain + wsPort + wsRoot + "?localeType=" + props.localeType;

        if ('WebSocket' in window) {
            if (props.async != undefined) {
                _this.async = props.async;
            }
            if (props.accept != undefined) {
                _this.accept = props.accept;
            }
            if (props.success != undefined) {
                _this.successCallBack = props.success;
            }
            if (props.failure != undefined) {
                _this.failureCallBack = props.failure;
            }
            if (props.failure != undefined) {
                _this.isImmediatelyConnect = props.isImmediatelyConnect;
            }
            if (props.localeType != undefined) {
                _this.userParam[_this.LOCALE_TYPE] = props.localeType;
            }
            if (props.sessionKey != undefined) {
                _this.userParam[_this.SESSION_KEY] = props.sessionKey;
            }
            _this.userParam[_this.SYNCHRONIZE_KEY] = _this.CONNECTION_VALUE;
            if (_this.isImmediatelyConnect) {
                _this.connection();
            }

            //增加守护线程,防止异常终止
            window.setInterval(function () {
                var intervalTime = 120000;
                if (sessionStorage.is_login == "false" || _this.websocket == null){
                    return;
                }
                if (new Date().getTime() - _this.last_active_time > intervalTime) {
                    if (_this.websocket != null &&　_this.websocket.readyState == _this.websocket.OPEN) {
                        _this.websocket.send("");
                        _this.last_active_time=new Date().getTime();
                    }else {
                        _this.connection();
                    }
                }
            }, 10000);
        }else{
            console.info("websocket is not support")
        }
    },

    /**
     * 判断订阅类型是否已存在于订阅列表中
     * @param subscribeType 订阅类型对象 type 订阅类型（此类型可自定义），callBack 回调函数{type:type,callBack:callBack}
     * @returns {boolean} 返回此订阅类型是否已订阅
     */
    isSubscribed: function (subscribeObj) {
        var flag = false;
        $.each(this.subscribes, function (i, val) {
            if (val.type == subscribeObj.subscribeType && val.callBack.name == subscribeObj.callBack.name) {
                flag = true;
                return false;
            }
        });
        return flag;
    },
    /**
     *  获取订阅列表中所有订阅类型的type值，用逗号隔开
     * @returns {string} 已订阅的所有类型的type值
     */
    getSubscribeTypes: function () {
        var subscribeTypes = "";
        $.each(this.subscribes, function (i, val) {
            subscribeTypes += val.type + ",";
        });
        if (subscribeTypes.length > 0) {
            subscribeTypes = subscribeTypes.substr(0, subscribeTypes.length - 1);
        }
        return subscribeTypes;
    },

    /**
     * 消息订阅
     * @param subscribeObj 订阅类型对象 type 订阅类型（此类型可自定义），callBack 回调函数{type:type,callBack:callBack}
     *
     */
    _genSubscribes: function (subscribeObj) {
        var subscribed = this.isSubscribed(subscribeObj);
        if (!subscribed) {
            var subscribe = {};
            subscribe.type = subscribeObj.subscribeType;
            subscribe.callBack = subscribeObj.callBack;
            subscribe.back = subscribeObj.back;
            this.subscribes.push(subscribe);
        }
    },
    subscribeMsg: function (subscribeType, callBack) {
        var subscribeObj = {subscribeType: subscribeType, callBack: callBack};
        this._genSubscribes(subscribeObj);
        this._subscribeMsg();
    },
    subscribeMsgs: function (subscribeArr) {
        if (subscribeArr != undefined) {
            subscribeArr.push(
                {
                    subscribeType: "ECHO", callBack: function (data) {
                        console.info(data)
                    }
                }
            );
        }
        var _this = this;
        $.each(subscribeArr, function (i, val) {
            _this._genSubscribes(val);
        });
        _this._subscribeMsg();
    },
    _subscribeMsg: function () {
        var _this = this;
        var subscribeTypes = _this.getSubscribeTypes();
        var userParam = {};
        userParam[_this.SYNCHRONIZE_KEY] = _this.SUBSCRIBE_VALUE;
        userParam[_this.SUBSCRIBE_TYPE] = subscribeTypes;
        userParam[_this.LOCALE_TYPE] = _this.userParam[_this.LOCALE_TYPE];
        _this.websocket.send(JSON.stringify(userParam));

    },

    /**
     * 开始链接
     *
     * @param userParam 连接时传递给服务器端的参数
     * @param successCallBack 连接成功处理方法
     * @param failureCallBack 连接失败处理方法
     * @param caller 调用者
     */
    connection: function (caller) {
        var _this = this;
        _this.last_active_time = new Date().getTime();

        if(sessionStorage.is_login=="false"){
            return;
        }

        //如果socket正在连接或者已经连接，则返回
        if (_this.websocket != null &&
            (
                _this.websocket.readyState == _this.websocket.CONNECTING
                || _this.websocket.readyState == _this.websocket.OPEN
            )
        ) {
            return;
        }

        _this.websocket = new WebSocket(_this.url_websocket);
        _this.websocket.onopen = _this.onWebsocketOpen;
        _this.websocket.onclose = _this.onWebsocketClose;
        _this.websocket.onmessage = _this.onWebsocketMessage;
        _this.websocket.onerror = _this.onWebsocketError;
        _this.websocket.onbeforeunload = _this.onWebsocketBeforeUnload;
        _this.websocket.outThis = _this;
    },
    /**
     * acceptDatas
     * @param datas
     */
    acceptDatas: function (datas) {
        // 接受的最后一个消息
        var lastData = datas[datas.length - 1];
        // 如果是断开连接
        var disconnect = this.isDisconnectObj(lastData);
        var len = datas.length;
        if (disconnect) {
            len--;
        }
        if (!disconnect) {// 如果不是断开连接，继续轮询
            if (this.async) {// 如果是异步处理
                this.acceptDatasByLength(datas, len);
            } else {
                this.acceptDatasByLength(datas, len);
            }
        } else {
            this.acceptDatasByLength(datas, len);
        }
    },
    /**
     * isDisconnectObj
     * @param o
     * @returns {boolean}
     */
    isDisconnectObj: function (o) {
        return o[this.SYNCHRONIZE_KEY] == this.DISCONNECT_VALUE;
    },
    /**
     * 处理数组中指定长度的数据
     */
    acceptDatasByLength: function (datas, len, disconnect) {
        for (var i = 0; i < len; i++) {
            var data = datas[i];
            this.accept(data, this.subscribes);
        }
    },
    /**
     * onWebsocketMessage
     */
    onWebsocketOpen: function () {
        var outThis = this.outThis;
        if (outThis.successCallBack) {
            outThis.successCallBack.call();
        }
        outThis.isConnect = true;
    },
    /**
     * onWebsocketMessage
     * @param event
     */
    onWebsocketMessage: function (event) {
        var outThis = this.outThis;
        var data = eval("(" + event.data + ")");

        // 订阅返回消息
        if (data[outThis.SYNCHRONIZE_KEY] == outThis.SUBSCRIBE_VALUE) {
            if (data.result == "success") {
                console.info("websocket,订阅成功" + outThis.getSubscribeTypes());
            } else {
                console.info(result);
            }
        } else {
            // 正常消息
            outThis.acceptDatas(data);
        }
    },
    /**
     * onWebsocketClose
     */
    onWebsocketClose: function (event) {
        console.log("socket close");
        var outThis = this.outThis;
        if (event.code != 1006) {
            setTimeout(function () {
                outThis.connection();
            }, 2000);
        }
    },
    /**
     * onWebsocketError
     */
    onWebsocketError: function (event) {
        console.log("socket error");
    },
    /**
     * onWebsocketBeforeUnload
     */
    onWebsocketBeforeUnload: function (event) {
        console.log("socket before unload");
    }

};