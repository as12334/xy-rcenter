/**
 * 管理首页-首页js
 */
define(function (BasePage) {

    return Class.extend({
        init: function () {
            this.formSelector = "#mainFrame";
            // this._super(this.formSelector);
            this.bindEvent();
            this.onPageLoad();
            this.setMenu();

        },
        /**
         * 当前对象事件初始化
         */
        bindEvent: function () {
            // this._super();
            var _this = this;
            $(this.formSelector).on("click", ".navBox a", function () {
                _this.setNav($(this));
            });
        },

        onPageLoad: function () {
            var _this = this;
            var timer = null;
            var obj = $("#gameAll");

            //彩种绑定事件
            var ll = $(obj).find('li').length;
            $(obj).unbind('mouseenter').bind('mouseenter', function () {
                $(this).find('div').show().animate({'height': ll * 29}, 100);
                clearTimeout(timer);
            });
            $(obj).unbind('mouseleave').bind('mouseleave', function () {
                _this.deferHide($(this).find('div'), 0);
            });
        },
        deferHide: function (obj, time) {
            timer = setTimeout(function () {
                obj.animate({'height': 0}, 100, function () {
                    $(this).hide();
                });
            }, time);
        },
        setNav: function (obj) {
            $("#menuText").html(obj.html());
            pathFolder = obj.attr('data-url');
            $("#menuText").attr("data-url", obj.data('url'));
            $("#menuText").attr("data-id", obj.attr('data-id'));
            myLid = obj.attr('data-code');
            // masterFirst =  $.inArray(returnSid(myLid), masterArr);
            $(".navList").hide();
            $("#menuUl").find('li:first').click();
        },
        // 一级导航功能处理
        setMenu: function () {
            var _this = this;
            var liList = '';
            var menuUl = $("#menuUl");
            for (var key in nav) {
                if(key == '站内消息'){
                    liList += '<li id="webMassage">' + key + '</li>';
                }else{
                    liList += '<li>' + key + '</li>';
                }
            }
            menuUl.html(liList);
            var FirstLi = menuUl.find("li:first");
            var LastLi = menuUl.find("li:last");
            FirstLi.addClass('on');
            LastLi.addClass('nb');

            // 绑定导航事件
            var aLi = menuUl.find('li');

            setLi(aLi.eq(aLi.length - 2));

            aLi.unbind('click').click(function () {
                setLi($(this));
            });

            function setLi(obj) {
                if (obj.html() == '安全退出') {
                    // $("body").myLayer({
                    // 	title: '安全退出',
                    // 	isMiddle: true,
                    // 	isShowBtn: true,
                    // 	content: '您確定要退出嗎？',
                    // 	okText: '確定',
                    // 	okCallBack: function () {
                    // 		top.location.href = '/';
                    // 	}
                    // });
                    var d = dialog({
                        title: '安全退出',
                        content: '您確定要退出嗎？',
                        okValue: '確定',
                        fixed: true,
                        ok: function () {
                            top.location.href = '/';
                        },
                        cancelValue: '取消',
                        cancel: function () {
                        }
                    });
                    d.showModal();
                } else {
                    aLi.removeClass('on');
                    obj.addClass('on');
                    var sUrl = '';
                    var n = obj.index();
                    var name = obj.html();
                    if (name == '即時注單') {
                        // sUrl = $("#menuText").attr('data-url');
                        // if(isClickAgin){
                        // 	isClickAgin = false;
                        domMenu(obj.html(), pathFolder);
                        // }
                    } else {
                        // isClickAgin = true;
                        sUrl = 'ut';
                        _this.domMenu(obj.html(), sUrl);
                    }
                }
            }
        },
        domMenu: function (mainKey, affiKeys) {
            var _this = this;

            var aMenu = nav[mainKey][affiKeys];
            var sHtml = '';
            var text = '';
            var url = '';
            var ifAlert = '1';
            var isDoubleClick = 0;
            for (var i = 0; i < aMenu.length; i++) {
                text = '';
                url = '';
                ifAlert = '1';
                if (aMenu.length > 0) {
                    text = aMenu[i].name;
                    url = aMenu[i].url;
                    // ifAlert = aMenu[i].split('|')[2];
                } else {
                    text = mainKey;
                    url = aMenu[i];
                }
                if (mainKey == '即時注單' && text != '帳單' && text != '實時滾單') {
                    isDoubleClick = 0;
                } else {
                    isDoubleClick = 1;
                }
                if (ifAlert == '0') {
                    sHtml += '<a href="javascript:;" data-isdc=' + isDoubleClick + ' data-url="' + url + '">' + text + '</a><b>|</b>';
                } else {
                    sHtml += '<a href="javascript:;" data-isdc=' + isDoubleClick + ' data-iframe="' + url + '">' + text + '</a><b>|</b>';
                }
            }

            $(".navListBox").html(sHtml).children().last().remove();
            var aA = $(".navListBox a");

            setA(aA.eq(0));

            aA.unbind('click').bind('click', function () {
                var thatObj = $(this);
                // if (!thatObj.hasClass('onBtn')) {
                // 	isClickAgin = true;
                // }
                if (mainKey == '即時注單' && thatObj.attr("data-isdc") != '1') {
                    // if (isClickAgin) {
                    // 	isClickAgin = false;
                    setA(thatObj);
                    // }
                } else {
                    // isClickAgin = true;
                    setA(thatObj);
                }
            });

            function setA(obj) {
                var _this = this;
                $("#ajaxLoading").remove();
                if (obj.html() == '變更密碼') {
                    // obj.siblings('a').addClass('onBtn');
                } else {
                    aA.removeClass('onBtn');
                    obj.addClass('onBtn');
                }
                if (obj.data('url')) {
                    dialog({
                        id: 'topDialog',
                        title: obj.html(),
                        url: obj.data('url') + '?lid=' + $("#menuText").attr("data-id"),
                        fixed: true,
                        onreset: function () {
                        },
                        oniframeload: function () {
                            this.reset()
                        }
                    }).showModal();
                } else if (obj.data('iframe')) {
                    if (affiKeys == 'ut') {
                        if (obj.data('iframe') == 'Quit.aspx') {
                            window.location.href = "Quit.aspx";
                        } else {
                            var url = obj.data('iframe');

                            $.ajax({
                                loading: true,
                                url: root + url,
                                // headers: {
                                //     "Soul-Requested-With": "XMLHttpRequest"
                                // },
                                type: "post",
                                success: function (data) {
                                    $("#mainFrame").html(data);
                                },
                                error: function (data, state, msg) {
                                    //超时导致后台返回,安全密码验证不做任何处理

                                }
                            });



                            htmlData = {};
                            $("#mainIframe").attr('src', obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
                            $("#mainIframe").load(function () {
                                setIframeHeight();
                            });
                        }
                    } else {
                        if (obj.html() == '帳單' || obj.html() == '備份') {
                            htmlData = {};
                            $("#mainIframe").attr('src', affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
                        } else if (obj.html() == '實時滾單') {
                            window.open(affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"), '實時滾單', 'width=1920,height=1080,top=0,left=0,directories=no,status=no,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no');
                        } else {
                            myPath = affiKeys + '/' + obj.data('iframe');
                            pathName = affiKeys + obj.data('iframe').split('.')[0];
                            if (htmlData[pathName] && iEVersion() != 6 && iEVersion() != 7) {
                                try {
                                    $("#mainIframe").contents().find('html body').html($(htmlData[pathName]));
                                    window.frames['mainIframe'].setScript(true);
                                } catch (e) {
                                }
                                ;
                            } else {
                                $("#mainIframe").attr('src', affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
                            }
                        }
                    }
                }
            }
        }


    });
});