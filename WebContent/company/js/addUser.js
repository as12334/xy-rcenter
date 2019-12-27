define(function (require, exports, module) {
    var $  = require('jquery');
    require('plus')($);
    var sub = require('sub');

    var username = $("#userName");
    var userTips = $(".userTips");
    var haved = false;
    var checkPwd = require('checkPwd');

    var oBody = $("body");
    oBody.onlyNumber({
        className: '.zfNumber',
        isDecimal: false,
        isMinus: false
    });

    oBody.onlyNumber({
        className: '.plNumber',
        isDecimal: true,
        isMinus: false
    });


    $("#userPassword").unbind('keyup blur').bind('keyup blur',function(){
        checkPwd.init($(this));
    });

    $(".toRMB").keyup(function () {
        // try{
        $(this).siblings('.toRMBspan').html(changeMoneyToChinese($(this).val()));
        // window.parent.$.myLayer.setSize(true, true);
        // 重置对话框
        sub.dialogReset();
        // }catch(e){};
    });

    $("#btnSubmit").click(function () {
        var that = $(this);
        if (checkUserName()) {
            submitForm();
        }
    });

    function setTabBut(that) {
        var tabBox = that.parents('.tabBox');
        if( tabBox.length > 0 ){
            var tabBoxIndex = tabBox.index();
            var currId = top.masterids[tabBoxIndex];
            if(!tabBox.hasClass('tabBoxOn') && top.masterids.indexOf(currId) != -1){
                $('.tabBtn:not(.on)').click();
            }
        }
    }

    function isPw(str){
        var a = /[a-z]/i,
            b = /[0-9]/;
        if(a.test(str) && b.test(str)){
            return true;
        }else{
            return false;
        }
    }

    function returnObjId() {
        var ids = '';
        var className = '.addUserTop';
        // 六合彩
        if (top.masterids.indexOf('1') != -1) {
            className += ', #six';
        }
        // 快彩
        if (top.masterids.indexOf('2') != -1) {
            className += ', #kc';
        }
        return className;
    }

    function submitForm() {
        var textHaved = true;
        var className = returnObjId();
        $(className).find('.text').each(function () {
            var that = $(this);
            var thatVal = that.val();
            if(thatVal == '' && that.attr("data-empty") != "true"){
                setTabBut(that);
                that.focus();
                that.myxTips({
                    content: '當前項不能為空！'
                });
                textHaved = false;
                return false;
            }else if((that.attr('data-max') && (Number(thatVal) > Number(that.attr('data-max'))) || thatVal < Number(that.attr('data-min')?that.attr('data-min'):0))){
                setTabBut(that);
                that.focus();
                if (that[0].id.indexOf('userCredit') == -1) {
                    // 占成
                    that.myxTips({
                        content: '最高可設占成 '+ that.attr('data-max') +'% ,最低占成'+ (that.attr('data-min')?that.attr('data-min'):0) +'%'
                    });
                }else{
                    if (that.attr('data-max')) {
                        // 信用额度
                        that.myxTips({
                            content: '最高信用額度 '+ that.attr('data-max') +' ,最低信用額度'+ (that.attr('data-min')?that.attr('data-min'):0) +''
                        });
                    }else{
                        that.myxTips({
                            content: '最低信用額度'+ (that.attr('data-min')?that.attr('data-min'):0) +''
                        });
                    }
                }
                textHaved = false;
                return false;
            }else if(that.attr('id') == 'userPassword' && that.attr("data-empty") != "true"){
                if (!checkPwd.init(that)) {
                    that.focus();
                    textHaved = false;
                    return false;
                }
            }else if(that.attr('id') == 'userPassword' && that.attr("data-empty") == "true" && thatVal != ''){
                if (!checkPwd.init(that)) {
                    that.focus();
                    textHaved = false;
                    return false;
                }
            }
        });

		/*
		 var userCreditSix = $("#userCredit_six");
		 var userCreditSixVal = userCreditSix.val();
		 var userCreditKc = $("#userCredit_kc");
		 var userCreditKcVal = userCreditKc.val();

		 if (Number(userCreditSixVal) == 0 && Number(userCreditKcVal) == 0 && top.masterids.indexOf('1') != -1 && top.masterids.indexOf('2') != -1) {
		 setTabBut(userCreditSix);
		 userCreditSix.focus();
		 // 信用额度
		 userCreditSix.myxTips({
		 content: '⑥合彩和快彩:信用額度 不能同時小於等於0'
		 });
		 textHaved = false;
		 return false;
		 }else if(Number(userCreditSixVal) == 0 &&  top.masterids.indexOf('1') != -1 && top.masterids.indexOf('2') == -1){
		 setTabBut(userCreditSix);
		 userCreditSix.focus();
		 // 信用额度
		 userCreditSix.myxTips({
		 content: '⑥合彩:信用額度 不能等於0'
		 });
		 textHaved = false;
		 return false;
		 }else if(Number(userCreditKcVal) == 0 &&  top.masterids.indexOf('1') == -1 && top.masterids.indexOf('2') != -1){
		 setTabBut(userCreditKc);
		 userCreditKc.focus();
		 // 信用额度
		 userCreditKc.myxTips({
		 content: '快彩:信用額度 不能等於0'
		 });
		 textHaved = false;
		 return false;
		 }
		 */
        var lowmaxrate_six = $("#lowmaxrate_six");
        var min_six_lowmaxrate = $("#min_xz_downRate_six");
        var lowmaxrate_kc = $("#lowmaxrate_kc");
        var min_kc_lowmaxrate = $("#min_xz_downRate_six");

        if (lowmaxrate_six.length>0) {
            if (min_six_lowmaxrate.length>0) {
                if ( Number(lowmaxrate_six.val()) < Number(min_six_lowmaxrate.text())) {
                    setTabBut(lowmaxrate_six);
                    lowmaxrate_six.focus();
                    // 信用额度
                    lowmaxrate_six.myxTips({
                        content: '⑥合彩: ‘占成上限’不可低於 '+ min_six_lowmaxrate.text() +'%，請重新設定！'
                    });
                    textHaved = false;
                    return false;
                }
            }else{
                if ( Number(lowmaxrate_six.val()) < 0) {
                    setTabBut(lowmaxrate_six);
                    lowmaxrate_six.focus();
                    // 信用额度
                    lowmaxrate_six.myxTips({
                        content: '⑥合彩: ‘占成上限’不可低於等於 0%，請重新設定！'
                    });
                    textHaved = false;
                    return false;
                }
            }
            if ( Number(lowmaxrate_six.val()) > 100) {
                setTabBut(lowmaxrate_six);
                lowmaxrate_six.focus();
                // 信用额度
                lowmaxrate_six.myxTips({
                    content: '⑥合彩: ‘占成上限’不可高於 100%，請重新設定！'
                });
                textHaved = false;
                return false;
            }
        }
        if (lowmaxrate_kc.length>0) {
            if (min_kc_lowmaxrate.length>0) {
                if ( Number(lowmaxrate_kc.val()) < Number(min_kc_lowmaxrate.text())) {
                    setTabBut(lowmaxrate_kc);
                    lowmaxrate_kc.focus();
                    // 信用额度
                    lowmaxrate_kc.myxTips({
                        content: '快彩: ‘占成上限’不可低於 '+ min_kc_lowmaxrate.text() +'%，請重新設定！'
                    });
                    textHaved = false;
                    return false;
                }
            }else{
                if ( Number(lowmaxrate_kc.val()) < 0) {
                    setTabBut(lowmaxrate_kc);
                    lowmaxrate_kc.focus();
                    // 信用额度
                    lowmaxrate_kc.myxTips({
                        content: '快彩: ‘占成上限’不可低於等於 0%，請重新設定！'
                    });
                    textHaved = false;
                    return false;
                }
            }
            if ( Number(lowmaxrate_kc.val()) > 100) {
                setTabBut(lowmaxrate_kc);
                lowmaxrate_kc.focus();
                // 信用额度
                lowmaxrate_kc.myxTips({
                    content: '快彩: ‘占成上限’不可高於 100%，請重新設定！'
                });
                textHaved = false;
                return false;
            }
        }


        var txtlimithy = $("#txtlimithy");
        var spancurrentlimithy = $("#spancurrentlimithy");
        if(txtlimithy.length>0){
            if(spancurrentlimithy.length>0){
                if ( Number(txtlimithy.val()) < Number(spancurrentlimithy.text())) {
                    txtlimithy.focus();
                    txtlimithy.myxTips({
                        content: '代理下綫人數不可低於 '+ spancurrentlimithy.text() +' 人！'
                    });
                    textHaved = false;
                    return false;
                }
            }else{
                if ( Number(txtlimithy.val()) <= 0) {
                    txtlimithy.focus();
                    txtlimithy.myxTips({
                        content: '代理下綫人數 必須大於“0”！'
                    });
                    textHaved = false;
                    return false;
                }
            }
        }

        if(textHaved){
            sub.setIframeLoading();
            $.ajax({
                type: 'POST',
                url: root + "/account/persistUser.html?",
                data: $('#form').serialize(),
                error: function () { alert('处理程序出错,请通知管理员检查！'); },
                success: function (msg) {
                    sub.removeAjaxLoading();
                    // try{
                    $("#alert_show").html(msg);
                    // }catch(e){}
                    // window.parent.$.myLayer.close(true);
                    // $("#iframeTopMask", top.document).remove();
                    // window.parent.location.reload();
                }
            });
        }
    }

    username.bind('blur', function () {
        checkUserName();
    });

    function checkUserName(argument) {
        var shaved = false;
        var usernameVal = username.val();
        userTips.removeClass('tipsWrong tipsRight').html("");
        if(username.length != 0){
            if(usernameVal == ''){
                username.focus();
                userTips.addClass('tipsWrong').html('賬號不能為空！');
                haved = false;
                shaved = false;
            }else if(!/^(?!_)(?!.*?_$)(?!^\d+$)(?!^[\d|._]+$)(?!^[a-zA-Z]+$)(?!^[a-zA-Z|_]+$)[a-zA-Z0-9_]+$/.test(usernameVal)){
                username.focus();
                userTips.addClass('tipsWrong').html('帳號必須包含字母和數字，支持‘_’，但開頭和結尾不能用‘_’！');
                haved = false;
                shaved = false;
            }else if(usernameVal.length > 12 || usernameVal.length < 6){
                username.focus();
                userTips.addClass('tipsWrong').html('帳號長度必須6-12位！');
                haved = false;
                shaved = false;
            }else{
                $.ajax({
                    url: root + '/account/existNameAjax.html',
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    timeout: 5000,
                    async: false,
                    data:{
                        action: 'existname',
                        uname: usernameVal
                    },
                    success:function (d) {
                        // 1，账号已存在  0，账号可用
                        userTips.removeClass('tipsWrong');
                        userTips.removeClass('tipsRight');
                        if(d == '1'){
                            haved = false;
                            shaved = false;
                            username.focus();
                            userTips.addClass('tipsWrong').html('賬號已存在!');
                        }else if(d == '2'){
                            haved = false;
                            shaved = false;
                            username.focus();
                            userTips.addClass('tipsWrong').html('賬號不能為空!');
                        }else if(d == '3'){
                            haved = false;
                            shaved = false;
                            username.focus();
                            userTips.addClass('tipsWrong').html('賬號過於簡單!');
                        }else{
                            haved = true;
                            shaved = true;
                            userTips.addClass('tipsRight').html('賬號可用!');
                        }
                    },
                    error:function () {
                        haved = false;
                        shaved = false;
                    }
                });
            }
        }else{
            haved = true;
            shaved = true;
        }
        return shaved;
    }


    function changeMoneyToChinese(money){
        var cnNums = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"); //汉字的数字
        var cnIntRadice = new Array("","十", "百", "千"); //基本单位
        var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
        var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
        var cnInteger = "整"; //整数金额时后面跟的字符
        var cnIntLast = "元"; //整型完以后的单位
        var maxNum = 99999999999999.9999; //最大处理的数字

        var IntegerNum; //金额整数部分
        var DecimalNum; //金额小数部分
        var ChineseStr=""; //输出的中文金额字符串
        var parts; //分离金额后用的数组，预定义
        if( money == "" ){
            return "";
        }
        money = parseFloat(money);
        if( money == 0 ){
            ChineseStr = cnNums[0]+cnIntLast+cnInteger;
            return ChineseStr;
        }
        money = money.toString(); //转换为字符串
        if( money.indexOf(".") == -1 ){
            IntegerNum = money;
            DecimalNum = '';
        }else{
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0,4);
        }
        if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
            zeroCount = 0;
            IntLen = IntegerNum.length;
            for( i=0;i<IntLen;i++ ){
                n = IntegerNum.substr(i,1);
                p = IntLen - i - 1;
                q = p / 4;
                m = p % 4;
                if( n == "0" ){
                    zeroCount++;
                }else{
                    if( zeroCount > 0 ){
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0; //归零
                    ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
                }
                if( m==0 && zeroCount<4 ){
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
            //整型部分处理完毕
        }
        if( DecimalNum!= '' ){//小数部分
            decLen = DecimalNum.length;
            for( i=0; i<decLen; i++ ){
                n = DecimalNum.substr(i,1);
                if( n != '0' ){
                    ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
                }
            }
        }
        if( ChineseStr == '' ){
            ChineseStr += cnNums[0]+cnIntLast+cnInteger;
        }else if( DecimalNum == '' ){
            ChineseStr += cnInteger;
        }
        if( money >= maxNum ){
            ChineseStr = '對不起，金額超出可轉換的範圍';
        }
        return ChineseStr;
    }


    function To_RMB(whole) {
        //分离整数与小数
        var num;
        var dig;
        if (whole.indexOf(".") == -1) {
            num = whole;
            dig = "";
        } else {
            num = whole.substr(0, whole.indexOf("."));
            dig = whole.substr(whole.indexOf(".") + 1, whole.length);
        }

        //转换整数部分
        var i = 1;
        var len = num.length;

        var dw2 = new Array("", "万", "亿"); //大单位
        var dw1 = new Array("十", "百", "千"); //小单位
        var dw = new Array("", "一", "二", "三", "四", "五", "六", "七", "八", "九"); //整数部分用
        var k1 = 0; //计小单位
        var k2 = 0; //计大单位
        var str = "";

        for (i = 1; i <= len; i++) {
            var n = num.charAt(len - i);
            if (n == "0") {
                if (k1 != 0)
                    str = str.substr(1, str.length - 1);
            }

            str = dw[Number(n)].concat(str); //加数字

            if (len - i - 1 >= 0){
                if (k1 != 3){
                    try {
                        str = dw1[k1].concat(str);
                    } catch (e) {}
                    k1++;
                } else {
                    k1 = 0;
                    var temp = str.charAt(0);
                    if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
                        str = str.substr(1, str.length - 1);
                    try {
                        str = dw2[k2].concat(str);
                    } catch (e) {}
                }
            }

            if (k1 == 3){
                k2++;
            }

        }
        if (str.length >= 2) {
            if (str.substr(0, 2) == "一十") str = str.substr(1, str.length - 1);
        }
        return str;
    }

    // 新增会员
    var sixHtml = '<span style="vertical-align:top; margin-left:5px; margin-top: -2px;display:inline-block;" id="t_six">賺取:</span><input type="text" class="text plNumber" id="sltDrawbackAuto_six" name="sltDrawbackAuto_six" style="vertical-align: top; margin-left:5px;">';
    $("#sltDrawback_six").change(function () {
        var that = $(this);
        var thatVal = that.val();
        if (thatVal == 'auto'){
            that.after(sixHtml);
        }else{
            $("#sltDrawbackAuto_six").remove();
            $("#t_six").remove();
        }
    });
    var kcHtml = '<span style="vertical-align:top; margin-left:5px;margin-top: -2px; display:inline-block;" id="t_kc">賺取:</span><input type="text" class="text plNumber" id="sltDrawbackAuto_kc" name="sltDrawbackAuto_kc" style="vertical-align: top; margin-left:5px;">';
    $("#sltDrawback_kc").change(function () {
        var that = $(this);
        var thatVal = that.val();
        if (thatVal == 'auto'){
            that.after(kcHtml);
        }else{
            $("#sltDrawbackAuto_kc").remove();
            $("#t_kc").remove();
        }
    });

    var sixLowMaxrate = (function (){
        try{
            return six_low_maxrate == '' ? '0' : six_low_maxrate;
        }catch(e){
            return '0';
        }
    })();
    var sixArHtml = '<input style="vertical-align:center; margin-left:2px; " type="text" id="lowmaxrate_six" name="lowmaxrate_six" value="'+ sixLowMaxrate +'"  class="text zfNumber" />%';
    $("input[name=allowmaxrate_six]").click(function () {
        setAllowmaxrate_six($(this));
    });

    function setAllowmaxrate_six (obj) {
        var that = obj;
        var thatVal = that.val();
        if (thatVal == '1'){
            $("#lowmaxrate_six_wrap").html(sixArHtml);
        }else{
            $("#lowmaxrate_six_wrap").html('');
        }
    }
    var kcLowMaxrate = (function () {
        try{
            return kc_low_maxrate == '' ? '0' : kc_low_maxrate;
        }catch(e){
            return '0';
        }
    })();
    var kcArHtml = '<input style="vertical-align:center; margin-left:2px; " type="text" id="lowmaxrate_kc" name="lowmaxrate_kc" value="'+ kcLowMaxrate +'"  class="text zfNumber" />%';
    $("input[name=allowmaxrate_kc]").click(function () {
        setAllowmaxrate_kc($(this));
    });

    function setAllowmaxrate_kc (obj) {
        var that = obj;
        var thatVal = that.val();
        if (thatVal == '1'){
            $("#lowmaxrate_kc_wrap").html(kcArHtml);
        }else{
            $("#lowmaxrate_kc_wrap").html('');
        }
    }
    // 初始化下綫可占成數
    setAllowmaxrate_six($("input[name=allowmaxrate_six]:checked"));
    setAllowmaxrate_kc($("input[name=allowmaxrate_kc]:checked"));

    var limi = (function () {
        try{
            return txtLimit == '' ? '' : txtLimit;
        }catch(e){
            return '';
        }
    })();
    var sltHtml = '<input type="text" id="txtlimithy" name="txtlimithy" value="'+ limi +'"  class="text w50 zfNumber" />';
    $("input[name=sltlimithy]").click(function () {
        setSltlimithy($(this));
    });

    function setSltlimithy (obj) {
        var that = obj;
        var thatVal = that.val();
        if (thatVal == '1'){
            $("#txtlimithy").remove();
            $("#spanlimithy").prepend(sltHtml).show();
        }else{
            $("#txtlimithy").remove();
            $("#spanlimithy").hide();
        }
    }
    setSltlimithy($("input[name=sltlimithy]:checked"));


    $("#resetBtn").click(function () {
        // window.parent.$.myLayer.close(true);
        top.dialog.get(window).close().remove();
    });


    // 現金虧損自動回收 是否显示
    if ($("input[name=isCash_kc]").val() == '1') {
        $(".isCash_show").show();
        $("#isCash_kc_01").html("(快彩)現金額度");
    }else{
        $(".isCash_show").hide();
        $("#isCash_kc_01").html("(快彩)信用額度");
    }
    // 現金虧損自動回收 点击事件
    $("input[name=isCash_kc]").click(function () {
        if ($(this).val() == '1') {
            $(".isCash_show").show();
            $("#isCash_kc_01").html("(快彩)現金額度");
        }else{
            $(".isCash_show").hide();
            $("#isCash_kc_01").html("(快彩)信用額度");
        }
    });

    // 現金虧損自動回收 是否显示
    if ($("input[name=isCash_six]").val() == '1') {
        $(".isCash_six_show").show();
        $("#isCash_six_01").html("(⑥合彩)現金額度");
    } else {
        $(".isCash_six_show").hide();
        $("#isCash_six_01").html("(⑥合彩)信用額度");
    }
    // 現金虧損自動回收 点击事件
    $("input[name=isCash_six]").click(function () {
        if ($(this).val() == '1') {
            $(".isCash_six_show").show();
            $("#isCash_six_01").html("(⑥合彩)現金額度");
        } else {
            $(".isCash_six_show").hide();
            $("#isCash_six_01").html("(⑥合彩)信用額度");
        }
    });


});
