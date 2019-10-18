define(['lb/components/Comet', 'site/index/PopUp', 'cookie'], function (Comet, PopUp, cookie) {
    return Comet.extend({
        init: function () {
            var param = {
                url: wsRoot,
                localeType: language.replace("-", "_"), isImmediatelyConnect: true
            };
            var _this = this;
            popUp = new PopUp();
            popUp.bindEvent();
            param.success = function () {
                console.info("连接成功!");
                subscribes = [
                    {subscribeType: "BOSS_LOTTERY_ERROR", callBack: popUp.bossLotteryError},
                    {subscribeType: "BOSS_LOTTREY_RESULT_GATHER", callBack: popUp.bossLotteryResultGather},
                    {subscribeType: "BOSS_LOTTREY_RESULT_VALID", callBack: popUp.bossLotteryResultValid},
                    {subscribeType: "BOSS_LOTTREY_RESULT_INIT", callBack: popUp.bossLotteryResultInit},
                    {subscribeType: "SHAREHOLDER_LOTTREY_RESULT_REMINDER", callBack: popUp.shareholderLotteryResultReminder},
                    {subscribeType: "MERCHANT_LOTTREY_RESULT_REMINDER", callBack: popUp.merchantLotteryResultReminder},
                    {subscribeType: "DISTRIBUTOR_LOTTREY_RESULT_REMINDER", callBack: popUp.distributorLotteryResultReminder},
                    {subscribeType: "NEW_BILL", callBack: popUp.newBillPopUpCallBack},
                    {subscribeType: "MERCHANT_RECHARGE_REMINDER", callBack: popUp.merchantDepositAndWithdraw},
                    {subscribeType: "MERCHANT_WITHDRAW_REMINDER", callBack: popUp.merchantDepositAndWithdraw},
                    {subscribeType: "M_SYS_ANN", callBack: popUp.systemAnnouncement},
                    {subscribeType: "S_SYS_ANN", callBack: popUp.systemAnnouncement},
                    {subscribeType: "D_SYS_ANN", callBack: popUp.systemAnnouncement},
                    {subscribeType: "ME_SYS_MSG", callBack: popUp.systemMessage},
                    {subscribeType: "SH_SYS_MSG", callBack: popUp.systemMessage},
                    {subscribeType: "DI_SYS_MSG", callBack: popUp.systemMessage}

                ];
                _this.subscribeMsgs(subscribes);
            };
            param.failure = function () {
                console.info("连接失败!");
            };
            this._super(param);
        }
    });


});