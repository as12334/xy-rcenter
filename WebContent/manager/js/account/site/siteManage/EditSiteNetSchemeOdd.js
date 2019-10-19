define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function (formSelector) {
            this.formSelector = "#editSiteNetSchemeOddForm";
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

          /*  $(this.formSelector).on("click", "#searchOddDiv a", function (e,opt) {
                var siteId = $("#odd_search_id").val();
                if(!siteId){
                    return false;
                }
                var code = $(this).attr("code");
                if(code=='cqssc'||code=='tjssc'||code=='xjssc'||code=='bjpk10'||code=='ahk3'||code=='fc3d'||
                    code=='tcpl3'||code=='jsk3'||code=='hbk3'||code=='gxk3'){
                    $(".wfqh-btn").attr("style", "display:");
                    $("#gfwfqh").addClass("gfwfqh-wrap");
                    $("#jdwf").addClass("active");
                    $("#gfwf").removeClass("active");

                }else {
                    $(".wfqh-btn").attr("style", "display:none");
                    $("#gfwfqh").removeClass("gfwfqh-wrap");
                    $("#gfwf").removeClass("active");
                }
                $(this).attr('class', 'label odd-label ssc-odd-active');
                $(this).siblings().attr('class', 'label odd-label');
                $("#lot_two_menu").load(root+'/lottery/odd/'+code+'/Index.html');
            });

            $(this.formSelector).on("click", "#wfqh-btn a", function () {
                var code = $("#searchOddDiv a.ssc-odd-active").attr("code");
                $(this).siblings().removeClass('active');
                $(this).addClass("active");
                var i = $(this).attr('id');
                if(i=='gfwf'&& code.indexOf('gf')<0){
                    code+="gf";
                }else if(code.indexOf('gf')>0){
                    code = code.substr(0,(code.length-2));
                }
                $(_this).attr('class', 'label odd-label ssc-odd-active');
                $(_this).siblings().attr('class', 'label odd-label');
                $("#lot_two_menu").load(root+'/lottery/odd/'+code+'/Index.html');
            });

            $(this.formSelector).on("click", "#lotteryOddDiv li", function (e) {
                $("#lotteryOddDiv li").removeClass("active");
                $(this).addClass("active");
                var datacode = $(this).attr("data-code");
                var code = $(this).attr("code");
                $("#searchOddDiv a").attr("style", "display:none");
                $("#searchOddDiv a[data-code='"+datacode+"']").attr("style", "display:");
                $("#searchOddDiv a[code='"+code+"']").click();
            });

            $(this.formSelector).on("click", "#comitSearch", function (e,opt) {
                var siteId=$("#odd_search_id").val();
                if(!siteId){
                    page.showPopover(e,opt,"danger","站点ID不能为空",true);
                    return;
                }
                $.ajax({
                    url:root+"/lottery/odd/oddContent.html?siteId="+siteId,
                    type: "post",
                    dataType: "json",
                    success:function(data){
                        if(data){
                            $(".col-lg-12").css('display','block');
                            $('#norecord').css('display','none');
                            if($('.odd-label').hasClass('ssc-odd-active')){
                                $('.ssc-odd-active').click();
                            }else{
                                $("#firstOddOne").click();
                            }
                        }else{
                            $(".col-lg-12").css('display','none');
                            $('#norecord').css('display','block');
                        }
                    },
                })
            });*/
        },

        onPageLoad: function () {
            this._super();
        },

        /**
         * 选择限额
         * @param e
         * @param option
         */
        goSiteQuota:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetQuota.html';
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
        goSiteNetScheme:function(e,option) {
            var url = root+'/vSysSiteManage/siteNetScheme.html';
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