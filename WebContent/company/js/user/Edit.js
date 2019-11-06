define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editUserForm";
            this._super();
        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            this._super();
            var _this = this;
            $(_this.formSelector).on("change","input[name='result.ownerUserType']",function () {

                var href = "/vSiteUser/createUser/"+$("input[name='result.userType']").val()+".html?search.ownerUserType="+$(this).val();
                $.ajax({
                    loading: true,
                    url: root + href,
                    type: "post",
                    success: function (data) {
                        //解绑原有事件
                        $(_this.formSelector).unbind();
                        $("#mainFrame").html(data);
                    },
                    error: function (data, state, msg) {
                        //超时导致后台返回,安全密码验证不做任何处理

                    }
                });
            });
            $(_this.formSelector).on("change","select[name='set_water']",function () {

                $("input[name='water']").val($(this).val());
            });

            $(_this.formSelector).on("change","select[name='result.ownerId']",function () {

                _this.getSubInfo(null,$("input[name='result.userType']").val(),$(this).val());
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


        },
        onPageLoad: function () {
            this._super();
            var _this = this;
            _this.getSubInfo($("select[name='result.id']").val(),$("input[name='result.userType']").val(),$("[name='result.ownerId']").val());
        },

        //獲取上級資料
        getSubInfo : function(userId,userType,ownerId){
                $.ajax({
                    loading: true,
                    url: root + "/vSiteUser/getSubInfo.html",
                    type: "post",
                    dataType:"JSON",
                    data:{"search.id":userId,"search.userType":userType,"search.ownerId":ownerId},
                    success: function (data) {
                        $("#shareCredits").text(data.shareCredits);
                        $("#superStintOccupy").val(data.superiorOccupy);
                        $("#maxSuperiorOccupy").text(100 - data.maxSuperiorOccupy);
                        $("input[name='maxSuperiorOccupy']").val(100 - data.maxSuperiorOccupy);
                    },
                    error: function (data, state, msg) {

                    }
                });
            var superCredit = $("select[name='shareName']").find("option:selected").data("credit");
            $("#shareCredits").text(superCredit);

        },



        saveValid: function (e) {
            var _this=this;
            // if(!this.validateForm(e)){
            //     return false;
            // }
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
        },
        test :function () {
            var tabName = $(".game_box_title .active a").text();
            $("fieldset").each(function () {
                var first = $(this).find("legend").text();
                $(this).find("li").each(function () {
                    var name = $(this).data("name");
                    var bid  = $(this).data("bid");
                    var str = "INSERT INTO test ( tyep, name, bet_code, bet_num) VALUES ('"+tabName+"' '"+first+"','第一球', '"+name+"', '"+bid.split("_")[0]+"', '"+bid.split('_')[1]+"');";
                    console.log(str);

                })

            })

        }
    })
});