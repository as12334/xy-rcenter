/**
 * Created by cj on 15-6-18.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "#validPrivilegeForm";
            this._super(this.formSelector);
            $('div.loading', parent.document).hide();
            this.initPage();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            var _this = this;
            /*$("[name='code']").keydown(function (event) {
                if(event.keyCode==13){
                    $(".btn-check-ok").click();
                }
            });*/

            $(this.formSelector).bind("keydown","code,validateCode",function (e) {
                if (e.keyCode == 13 || e.which == 13 ) {
                    $(".btn-check-ok").click();
                }
            })
        },

        onPageLoad:function() {
            this._super();
        },
        /**
         * init page content
         */
        initPage: function () {
            var _this = this;
            //$('.modal-body > div:eq(2)').hide();
            /*
             $('#privilegeCode').togglePassword({
             el: '#togglePassword'
             });
             */
            var times = $('#7f1a3d0c-f15e-4e7a-8836-fc7182298af9', _this.formSelector).val();
            if (times < 4) {
                _this.showValidateCode(times);
            }
        },
        /**
         * 显示验证码
         * @param t
         */
        showValidateCode: function (t) {
            var _this = this;
            //该值等于1 则会远程验证 验证码参数
            $('input[name=requiredValidateCode]', _this.formSelector).val(1);
            $('#error_message_span span:last', _this.formSelector).text(t);
            $('#system_captcha', _this.formSelector).removeClass('hide');
            $('#error_message_span', _this.formSelector).removeClass('hide');
            setTimeout(function () {
                _this.resizeDialog();
            }, 100);

        },

        /**
         * 回调判断验证状态
         * @param e
         * @param option
         * @returns {boolean}
         */
        showTips: function (e, option) {
            var _this = this;
            $("#privilegePWD", _this.formSelector).find(".successsmall").remove();
            $("#system_captcha", _this.formSelector).find(".successsmall").remove();
            var result = option.data;
            var PrivilegeStatusEnum = {};
            PrivilegeStatusEnum.ALLOW_ACCESS = 100;//密码正确，通过验证
            PrivilegeStatusEnum.LOCKED = 99;//密码错误达到上限，锁定用户
            PrivilegeStatusEnum.WRONG_VALICODE = 97;//验证码错误
            if (result.stateCode == PrivilegeStatusEnum.ALLOW_ACCESS) {
                _this.closePage();
                /*if (window.top.page.parentTarget != undefined) {
                 $(window.top.page.parentTarget).click();
                 }*/
                _this.returnValue = true;
            } else if (result.stateCode == PrivilegeStatusEnum.LOCKED) {
                location.href = root + "/common/privilege/showLockPrivilege.html";
            } else {
                $(window.top.topPage.getCurrentForm(e))[0].reset();
                $('#privilegeCode').focus();
                _this.refreshCode();
                if (result.leftTimes < 4) {
                    _this.showValidateCode(result.leftTimes);
                }
            }
            $(e.currentTarget).unlock();
            return false;
        },
        /**
         * 验证密码
         * @returns {boolean}
         */
        validate: function () {
            var _this = this;
            var $privilegeCode = $('#privilegeCode');
            var v = $privilegeCode.val();
            if (!v) {
                $privilegeCode.focus();
                return false;
            }
            var $validateCode = $('input[name=validateCode]', _this.formSelector);
            if ($validateCode && $validateCode.is(":visible")) {
                v = $validateCode.val();
                if (!v) {
                    $($validateCode).focus();
                    return false;
                }
            }
            return true;
        },
        /**
         * 刷新
         */
        refreshCode: function () {
            var _this = this;
            var url = null;
            var img = $('#system_captcha img');
            if (!url) {
                url = $(img).attr('src');
            }
            $(img).attr('src', url + '?t=' + Math.random());
            $("input[name='validateCode']", _this.formSelector).val("");
            $('#system_captcha a').unlock();
        },
        closePrivilege: function (e, opt) {
            window.top.topPage.closeDialog();
        },

        // /**
        //  * 重写，添加回调参数
        //  */
        // closePage: function (e, opt) {
        //     var _this = this;
        //     _this.returnValue = false;
        //     window.top.topPage.closeDialog();
        // },

    })
});