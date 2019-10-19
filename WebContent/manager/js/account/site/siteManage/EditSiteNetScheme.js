define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editSAiteNetSchemeForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();
            $(this.formSelector).on("click", "#selectAllLottery", function (e,opt) {
                var selectLottery=document.getElementsByName('Lottery')
                var selectAllLottery=document.getElementById('selectAllLottery')
                if(selectAllLottery.checked==true){
                    if(selectLottery.length){
                        for(var i=0;i<selectLottery.length;i++){
                            selectLottery[i].checked = true;
                        }
                    }
                    selectLottery.chcked=true;
                }else{
                    if(selectLottery.length){
                        for(var i=0;i<selectLottery.length;i++){
                            selectLottery[i].checked = false;
                        }

                    }
                }
            });
        },

        onPageLoad: function () {
            this._super();
        },
        /**
         * 游戏配额--下一步
         * @param e
         * @param option
         */
        goSiteOdd:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetSchemeOdd.html';
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data);
                            var key = $("#editSiteNetSchemeOpenForm").find("[name='sysUserGameRelationsOpen.groupId']").val();
                            if(key!=null && key!=""){
                                var url = root + '/vSysSiteManage/gameOpen.html';
                                window.top.topPage.ajax({
                                    type: "POST",
                                    data: {"search.id":key},
                                    url: url,
                                    success: function (data) {
                                        $("#gameGroupOpen").html(data);
                                    },
                                    error: function (data) {
                                        $(e.currentTarget).unlock();
                                    }
                                });
                            }

                        }
                    })
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        /**
         * 游戏配额--下一步
         * @param e
         * @param option
         */
      /*  goSiteTemplate:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetSchemeOpen.html';
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data);
                            var key = $("#editSiteNetSchemeOpenForm").find("[name='sysUserGameRelationsOpen.groupId']").val();
                            if(key!=null && key!=""){
                                var url = root + '/vSysSiteManage/gameOpen.html';
                                window.top.topPage.ajax({
                                    type: "POST",
                                    data: {"search.id":key},
                                    url: url,
                                    success: function (data) {
                                        $("#gameGroupOpen").html(data);
                                    },
                                    error: function (data) {
                                        $(e.currentTarget).unlock();
                                    }
                                });
                            }

                        }
                    })
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },*/

        /**
         * 站点基本信息
         * @param e
         * @param option
         */
        goSiteBasic:function(e,option) {
            var url = root+'/vSysSiteManage/siteBasic.html';
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: "POST",
                data:data,
                url: url,
                success: function(data) {
                    $("#mainFrame").children("div").each(function () {
                        if($(this).css("display")=="block"){
                            $(this).html(data)
                        }
                    })
                },
                error: function(data) {
                    $(e.currentTarget).unlock();
                }
            });
        },

        searchGamePlayQuota: function (e) {
            // var groupId = $("[name='sysUserGameRelationsQuota.groupId']").val();
            // if(groupId!=null && groupId!="") {
                var url = root + '/vSysSiteManage/playMethod.html';
                if(e.key!=null && e.key!=""){
                    var data = {"search.id": e.key};
                    $("#gameGroupQuotaName").val(e.value);
                    window.top.topPage.ajax({
                        type: "POST",
                        data: data,
                        url: url,
                        success: function (data) {
                            $("#gameGroupPage").html(data);
                        },
                        error: function (data) {
                            $(e.currentTarget).unlock();
                        }
                    });
                }
            // } else{
            //     page.showPopover(e, {}, "text", "请选择分组", true);
            // }
        },

        searchGameOpenSetting: function (e) {
            var url = root + '/vSysSiteManage/gameOpen.html';
            if(e.key!=null && e.key!=""){
                var data = {"search.id": e.key};
                $("#gameGroupOpenName").val(e.value);
                window.top.topPage.ajax({
                    type: "POST",
                    data: data,
                    url: url,
                    success: function (data) {
                        $("#gameGroupOpen").html(data);
                    },
                    error: function (data) {
                        $(e.currentTarget).unlock();
                    }
                });
            }
        }
    });
});