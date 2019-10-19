define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "#editSiteNetSchemeQuotaForm";
            this._super(this.formSelector);
        },

        bindEvent: function () {
            this._super();

            $("#gameGroupPage").on("click", "li a", function (e) {
                $("#gameGroupPage li").attr("class", "");
                $(this).parent().attr("class", "active");
                var playId = $(this).data().value;
                $(".gamePlay").hide();
                $("#gameGroupPage" + " " + "#" + playId).show();
            });

            $("#gameGroupOpen").on("click", "li a", function (e) {
                $("#gameGroupOpen li").attr("class", "");
                $(this).parent().attr("class", "active");
                var playId = $(this).data().value;
                $(".gamePlayOpen").hide();
                $("#gameGroupOpen" + " " + "#" + playId).show();
            });
        },

        onPageLoad: function () {
            this._super();
        },
        /**
         * 游戏开启--下一步
         * @param e
         * @param option
         */
        goSiteTemplate:function(e,option) {
            var url = root+'/vSysSiteManage/siteTemplate.html';
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


        /**
         * 游戏开启--上一步
         * @param e
         * @param option
         */
        goSiteNetSchemeOdd:function(e,option) {
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
                            var key = $("#editSAiteNetSchemeForm").find("[name='sysUserGameRelationsQuota.groupId']").val()
                            if(key!=null && key!=""){
                                var url = root + '/vSysSiteManage/playMethod.html';
                                window.top.topPage.ajax({
                                    type: "POST",
                                    data: {"search.id":key},
                                    url: url,
                                    success: function (data) {
                                        $("#gameGroupPage").html(data);
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
        searchGamePlayQuota: function (e) {
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