define(['common/BaseEditPage', 'bootstrapswitch'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editUserForm";
            this._super(this.formSelector);
            this.bindEvent();
            this.onPageLoad();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;

        },
        onPageLoad: function () {
            this._super();
            var _this = this;
            $(_this.formSelector).on("change","select[name='set_water']",function () {

                $("input[name='water']").val($(this).val());
            });

            $(_this.formSelector).on("click",".myLayerCancel",function () {

                $(".navListBox .onBtn").click();
            });

            $(_this.formSelector).on("change","select[name='result.ownerId']",function () {

                _this.getSubInfo($(this).val(),$("input[name='result.userType']").val());
            });
            $(_this.formSelector).on("change","input[name='stintId']",function () {

                if($(this).val() == 'yes'){
                    $("input[name='result.stintOccupy']").hide();
                    $("input[name='result.stintOccupy']").val("-1");
                }else {
                    $("input[name='result.stintOccupy']").show();
                    $("input[name='result.stintOccupy']").val("0");
                }
            });
            _this.getSubInfo($("select[name='result.ownerId']").val(),$("input[name='result.userType']").val());
        },

        //獲取上級資料
        getSubInfo : function(userId,userType){
            if(userId){
                $.ajax({
                    loading: true,
                    url: root + "/vSiteUser/getSubInfo.html",
                    type: "post",
                    dataType:"JSON",
                    data:{"search.id":userId,"search.userType":userType},
                    success: function (data) {
                        $("#shareCredits").text(data.shareCredits);
                        $("#superStintOccupy").val(data.superiorOccupy);
                    },
                    error: function (data, state, msg) {

                    }
                });
            }
            var superCredit = $("select[name='shareName']").find("option:selected").data("credit");
            $("#shareCredits").text(superCredit);

        },



        saveValid: function (e) {
            var _this=this;
            if(!this.validateForm(e)){
                return false;
            }
            window.top.topPage.ajax({
                url: root+"/vSiteUser/saveManagerUser.html",
                async:false,
                dataType:'json',
                data:_this.getCurrentFormData(e),
                success: function (data) {
                    alert(data.msg);
                    $(".navListBox .onBtn").click();
                },
                error: function (e) {
                }
            });
        },
        updateValid: function (e) {
            var _this=this;
            // if(!this.validateForm(e)){
            //     return false;
            // }
            window.top.topPage.ajax({
                url: root+"/vSiteUser/updateManagerUser.html",
                async:false,
                dataType:'json',
                data:_this.getCurrentFormData(e),
                success: function (data) {
                    alert(data.msg);
                    $(".navListBox .onBtn").click();
                },
                error: function (e) {
                }
            });
        }
    })
});