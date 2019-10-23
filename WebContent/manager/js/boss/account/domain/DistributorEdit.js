/**
 * Created by jeff on 15-8-14.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this.domainIdEnable();
            this.formSelector = "#bossDistributorAddForm";
            this._super(this.formSelector);
        },
        bindEvent: function () {
            var _this = this;
            this._super();
            $(_this.formSelector).on("input","textarea[name='result.domain']", function () {
                //线路域名没填或格式不对，提交按钮禁用
                _this.domainIdEnable();
            })
        },
        onPageLoad: function () {
            this._super();
        },

        getValidateRule:function($form){
            var that = this;
            var rule = that._super($form);
            $form.validate(rule);
        },
        /*saveDomain:function(e,p){
            var that = this;
            if (!that.validateForm(e)) {
                return false;
            }
            $("input[name='result.isForAllRank']").val($("input.all_rank").is(":checked"));
            $('input[type=checkbox].rank').prop('disabled',false);
            window.top.topPage.ajax({
                url:root+'/content/domain/persist.html',
                type:"POST",
                data:window.top.topPage.getCurrentFormData(e),
                error: function (request) {
                    $(e.currentTarget).unlock();
                },
                success: function (data) {
                    that.closePage();
                }
            });
        },*/
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
                        var _this=this;
                        e.currentTarget = $("textarea[name='result.domain']");
                        page.showPopover(e, {}, 'warning', _this.formatStr('输入的域名',badUrl), true);
                    }
                    $("._search").lock();
                    $("._search").addClass("disabled");
                }else{
                    $("._search").unlock();
                    $("._search").removeClass("disabled");
                }
            }else{
                $("._search").lock();
                $("._search").addClass("disabled");
            }

        },
        closePage: function () {
            window.top.topPage.closeDialog();
        },
    });
});