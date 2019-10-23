/**
 * Created by jeff on 15-8-14.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#editDomainForm";
            this._super(this.formSelector);
            this.domainIdEnable();
            this.showMassage();
            this.checkHall();
        },
        bindEvent: function () {
            var _this=this;
            this._super();

            this.resizeDialog();
            $(this.formSelector).on("input","textarea[name='result.domain']", function () {
                //线路域名没填或格式不对，提交按钮禁用
                _this.domainIdEnable();
            })
        },
        onPageLoad: function () {
            this._super();
        },


        checkHall : function () {
            var _this=this;
            var type = $("input[name='result.type']",_this.formSelector).val();
            if(type =='3'){
                $("#templateCode").show();
                $("#theme").show();
            }else{
                $("#templateCode").hide();
                $("#theme").hide();
            }
            $("input[name='result.templateCode']",_this.formSelector).val("");
            $("input[name='result.theme']",_this.formSelector).val("");
        },


        //线路域名是否有效
        domainIdEnable: function () {
            var checkNum = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
            var domain=$("textarea[name='result.domain']").val();
            if(domain!=""){
                var last = domain.charAt(domain.length - 1);
                if (last == '\n') {
                    domain = domain.substring(0, domain.length - 1);
                }
                var urls = domain.split(",");
                var isDomain = true;
                var badUrl = "";
                var newDomailUrl = "";
                for(var i=0;i<urls.length;i++){
                    var newStr =urls[i].replace(/^\s+|\s+$/g,'');
                    if(!checkNum.test(newStr)){
                        isDomain = false;
                        badUrl += urls[i] + ",";
                    }
                    newDomailUrl += newStr + ",";
                }
                if(newDomailUrl!=""){
                    newDomailUrl = newDomailUrl.substring(0, newDomailUrl.length - 1);
                    $("textarea[name='result.domain']").val(newDomailUrl);
                }

                if(!isDomain){
                    if(badUrl.length>0){
                        badUrl = badUrl.substring(0,badUrl.length-1);
                        var e = {};
                        e.currentTarget = $("textarea[name='result.domain']");
                        page.showPopover(e, {}, 'warning', "输入的域名[" + badUrl+"]格式不正确", true);
                    }
                    $("._search").lock();
                    $("._search").addClass("disabled");
                    $("#isCorrect").hide();
                }else{
                    $("._search").unlock();
                    $("#isCorrect").show();
                    $("._search").removeClass("disabled");
                }
            }else{
                $("._search").lock();
                $("#isCorrect").hide();
                $("._search").addClass("disabled");
            }
        },
        showMassage : function () {
            //显示提示语
            $("#managerMsg").text($("[data-value='"+ $("[name='result.pageUrl']").val()+"']").text());
        }
    });
});