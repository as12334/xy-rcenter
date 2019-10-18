define(['bootstrap-dialog','jqmetisMenu','template'], function (BootstrapDialog,jqmetisMenu,Template) {
    return Class.extend({
        topMenu:"#side-menu",
        init: function () {
            var _this = this;
            window.top.topPage.ajax({
                cache: true,
                type: "GET",
                loading:true,
                url: "sysResource/fetchAllMenus.html",
                success: function (data) {
                    var _mainFrame=$("#mainFrame");
                    if(data == "[]"){
                        window.top.topPage.showErrorMessage("获取菜单为空");
                        return;
                    }
                    var json = eval(data);
                    var resourceName="";
                    var dataurl="";
                    if(json.length>0) {
                        var html = Template('leftMenuArtTmpl', {list: json});

                        $(_this.topMenu).html(html);
                        if(json[0].object.resourceUrl) {
                            var homePermission = json[0].object.permission;
                            if(homePermission === "boss:home" || homePermission === 'shareholder:home' || homePermission === "COMPANY:home" || homePermission === 'agent:home') {
                                dataurl = "/"+json[0].object.resourceUrl;
                                resourceName=""+json[0].object.resourceName;
                                $("#side-menu").on("click","li:eq(0) a",function () {
                                    $(this).attr("add-table","addTable").attr("tab-name",resourceName).attr("href",dataurl).attr("nav-target","mainFrame").attr("first",true)
                                });
                                $("#side-menu li:eq(0) a").trigger("click");
                            }else{
                                dataurl = "/"+json[0].children[0].object.resourceUrl;
                                resourceName=""+json[0].children[0].object.resourceName;
                            }
                        }else{
                            if(json[0].children.length>0){
                                dataurl = "/"+json[0].children[0].object.resourceUrl;
                                resourceName=""+json[0].children[0].object.resourceName;
                            }
                        }
                        _mainFrame.css("minHeight", $(window).height() - $(".top:first").outerHeight()- $(".top:first").outerHeight()-12);
                        _mainFrame.css("height", $(window).height() - $(".top:first").outerHeight()- $(".top:first").outerHeight()-12);
                        $("#left-menu").css("height",$("#mainFrame").height()+50+"px");
                     }
                    _this.showMenu();

                }
            });
            // _this.language();
            $("#mainFrame").on("click",".navbar-minimalize",function () {
                var timeObj;
                var timeObje;
                var menu=$("#side-menu").children("li");
                if($("body").hasClass("mini-navbar")){
                    if(menu.hasClass("active")){
                        menu.removeClass("active").find("ul").removeClass("in");
                    }
                    var imgurl;
                    menu.children("a").unbind().mouseover(function () {
                        var that=$(this);
                        timeObj = setTimeout(function () {
                           imgurl=that.find("img").attr("src");
                           that.find("img").attr("src","").attr("alt",that.find("span:eq(0)").html());
                        },500
                       );
                    });
                    menu.children("a").mouseout(function () {
                        clearTimeout(timeObj);
                        if($(this).find("img").attr("alt")){
                            var that=$(this);
                           setTimeout(function () {
                               that.find("img").attr("src",imgurl).removeAttr("alt");
                           },500)
                        }

                    });
                    menu.children("ul").find("li").unbind().mouseover(function () {
                        clearTimeout(timeObje);
                    });
                    menu.children("ul").find("li a").unbind().mouseout(function () {
                        timeObje = setTimeout(function () {
                            menu.removeClass("active").find("ul").removeClass("in")
                        },800)
                    });
                }else{
                    menu.children("a").unbind("mouseover");
                    menu.children("a").unbind("mouseout");
                    menu.children("ul").unbind("mouseover");
                    menu.children("ul").find("li a").unbind("mouseout")
                }
            });

            var obtnleft = $("#tab-scroll-left");
            var obtnright = $("#tab-scroll-right");
            var odiv = $("#tab-scroll")[0];
            obtnleft.click(function () {
                odiv.scrollLeft=odiv.scrollLeft-113;
            });
            obtnright.click(function(){
                odiv.scrollLeft=odiv.scrollLeft+113;
            });

        },
        setFirstUrl: function (url) {
            window.top.topPage.ajax({
                cache: true,
                type: "GET",
                sync:false,
                loading: true,
                url: url,
                success: function (data) {
                    var targetSelect;
                    if(location.hash.length>1){
                        if($("[href='"+location.hash.substr(1)+"'][nav-top]").length==0) {
                            $("#mainFrame").html(data);
                            targetSelect="#mainFrame";
                        }else{
                            targetSelect="#mainFrame";
                        }
                        $(targetSelect).html("");
                        window.top.topPage.ajax({
                            cache: true,
                            type: "GET",
                            sync:false,
                            loading: false,
                            url: root+location.hash.substr(1),
                            success: function (data1) {
                                $(targetSelect).html(data1);
                            }
                        });
                    }else{
                        $("#mainFrame").html(data)
                    }
                }
            });
        },

        showMenu: function () {
            {$(".navbar-nav .dropdown").hover(
                function() {
                    $('.dropdown-menu', this).not('.in .dropdown-menu').show();
                    $(this).toggleClass('open');
                },
                function() {
                    $('.dropdown-menu', this).not('.in .dropdown-menu').hide();
                    $(this).toggleClass('open');
                }
            );}
        },

        /**
         * 多语言选项初始化
         * ＠author: Simon
         */
        language : function(){
            var _this=this;
            window.top.topPage.ajax({
                url:root+'/index/language.html',
                dataType:'json',
                cache: false,
                type:"get",
                success:function(data){
                    var languageCurrent = data.languageCurrent;
                    var languageI18n = data.languageI18n;
                    var languageWarn = window.top.message.common['language.change.warn'];
                    var lis = '';
                    var ali;
                    if(data.languageDicts) {
                        $.each(data.languageDicts, function (key, value) {
                            if(languageI18n){
                                var val = languageI18n[value.language];
                                var vals = val.split("#");
                                if (value.language.indexOf(languageCurrent) > -1) {
                                    ali = '<img src="' + resComRoot + vals[1] + '" data-rel=\'{"languageWarn":"' + languageWarn + '"}\' class="m-r-xs">' + vals[0] + '<span class="caret m-l-xs"></span>'
                                }else{
                                    lis += '<li><a href="javascript:void(0)" change="language" ><img src="' + resComRoot + vals[1] + '" class="m-r-xs" data-rel=\'{"lang":"' + vals[2] + '","country":"' + vals[3] + '"}\'>' + vals[0] + '</a></li>'
                                }
                            }
                        });
                    }
                    $("#divLanguage ul").html(lis);
                    $("#divLanguage button").html(ali);
                    _this.changelanguage();
                }});
        },
        /**
         * 多语言选项切换
         * ＠author: Simon
         */
        changelanguage :function(){
            $(document).on("click","ul li [change='language']", function () {
                var img = $(this).children("img");
                var data_rel = $.parseJSON(img.attr("data-rel"));
                var warn_msg = $.parseJSON($(this).parent().parent().prev().children("img").attr("data-rel"));
                window.top.topPage.showConfirmMessage(warn_msg.languageWarn,function(result)
                {
                    if(result) {
                        window.top.topPage.ajax({
                            url:root+'/index/language/change.html',
                            dataType:'json',
                            cache: false,
                            data: {'lang':data_rel.lang,'country':data_rel.country},
                            type:"get",
                            success:function(data){
                                window.top.topPage.showSuccessMessage(data.msg,function(){
                                    location.reload();
                                });
                            }});
                    }
                });
            });
        }

    });

});