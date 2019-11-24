// 渲染赔率
function requsetHandlers(data, bId) {
	var that = subInit, d = data, oText = $('#closeText'), oProfit = $("#profit"), oNowJq = $("#NowJq");
	var gameItme = $(".game_item").eq(that.gameTabIndex);
	// open
	if( that.openning == 'y'){
		oText.html('\u5c01\u76e4')
	}else{
		oText.html('\u958b\u734e')
	};

	// profit
	oProfit.html(d.profit);
	// NowJq
	oNowJq.html(d.nn).attr("data-id", d.p_id);

	if(that.isGameTypeLM() == 'lm'){

        var liList = gameItme.find(".kc_lm_title li");
        var aItem = gameItme.find(".game_lm_con");
        var liListlen = liList.length;
        var nowIndex = 0;

        for(var i=0; i<liListlen; i++){
            var t = liList.eq(i), a = t.attr("data-bid"), h4 = t.find("h4"), de = d.play_odds[a];
            t.attr({
                "data-pl": de.pl,
                "data-min": de.min_amount,
                "data-max": de.max_amount,
                "data-top": de.top_amount,
                "data-plx": de.plx
            });
            if(de.pl == '-'){
                h4.html("-");
                subInit.clearData();
            }else{
                h4.html(de.pl);
            };

            if(t.hasClass("active")){
                nowIndex = t.index();
            };
        };

        liList.unbind('click').click(function () {
            var t = $(this);
            if(!t.hasClass('active')){
                var $index = t.index();
                var aPlx = t.attr("data-plx");
                var bid = t.attr("data-bid").split('_')[0];
                var pl = t.attr("data-pl");
                var nPl = pl-0;
                var d = {};

                subInit.tplIndex = $index;
                aItem.html(juicer($("#"+ bId +"_" + subInit.tplIndex).html(), d));

                var aItemLi = aItem.find('li');
                var isPl = t.attr("data-ispl");

                liList.removeClass("active");
                t.addClass("active");
                nowIndex = $index;
                setLmPl(aPlx, aItemLi, pl, nPl, isPl);

                subInit.clearData();
            }
        });

        function setLmPl(aPlx, aItemLi, pl, nPl, ispl) {
            var aILilen = aItemLi.length;
            var arr = [];

            if(aPlx != ''){
                arr = aPlx.split(',');
            };
            if(ispl == '1'){
                var aItemLiBigId = aItemLi.eq(0).attr('data-bid').split('_')[0];
                for (var i = 0; i < aILilen; i++) {
                    var item = $("#lm_"+aItemLiBigId+"_"+(i+1));
                    var pab = item.find('.p a b');
                    var oPlx = arr[i]-0;
                    var nowPl = 0;

                    if(pl == '-'){
                        item.removeClass('showPl');
                    }else{
                        if(arr.length>0){
                            nowPl = nPl+oPlx;
                        }else{
                            nowPl = nPl;
                        };
                        item.addClass('showPl');
                        pab.html(nowPl);
                    }
                };
            }else{
                for (var i = 0; i < aILilen; i++) {
                    var item = aItemLi.eq(i);
                    if(pl == '-'){
                        item.removeClass('showPl');
                    }else{
                        item.addClass('showPl');
                    }
                };
            };

            // 绑定快彩连码事件
            setLmEvent(nowIndex);
        };

        // 初始化渲染第一组数据
        var liList0 = liList.eq(nowIndex);
        var liList0Pl = liList0.attr("data-pl");
        var liList0Plx = liList0.attr("data-plx");
        setLmPl(liList0Plx, aItem.find('li'), liList0Pl, liList0Pl-0, liList0.attr("data-ispl"));

	}else{
        // play_odds
        var gameItemLi = gameItme.find('li');
        var gameItemLilen = gameItemLi.length;

        for(var i=0; i<gameItemLilen; i++){
            var t = gameItemLi.eq(i), a = t.attr("data-bid");
            var pab = t.find('.p a b');

            t.attr({
                "data-pl" : d.play_odds[a].pl,
                "data-min": d.play_odds[a].min_amount,
                "data-max": d.play_odds[a].max_amount,
                "data-top": d.play_odds[a].top_amount
            });

            if(d.play_odds[a].pl == '-'){
                t.removeClass('showPl');
                that.clearData();
            }else{
                t.addClass('showPl');
                pab.html(d.play_odds[a].pl);
            }
        }
        // pl dialog
        that.addPlDialogEvent('.game_box_con');
        // 绑定下单按钮事件
        that.submitBtn(that.gameTabIndex);

	};

	if(oNowJq.html()-0 > $("#newPhase").text()-0+1){
		setTimeout(function () {
			that.openball();
		}, 0)
	};

	// Closed MarketFun Run
    console.log(d.stop_time);
	var t = that.closeTimeInit(d.stop_time);

	if(t<=0 || isNaN(t)){
		return;
	};

	bTimer ? clearTimeout(bTimer) : bTimer = null;

	that.closedMarketFun(t);

	parent.indexInit.setIframeHeight(false);
};

//game set ball 
function setBallFun(obj) {
    if (obj.attr("data-num") < 20) {
        obj.addClass("blue_ball");
    } else {
        obj.addClass("red_ball");
    }
    obj.text(obj.attr("data-num"));
};

function combination(b, a) {
    return factorial(b) / (factorial(a) * factorial(b - a));
};
function factorial(a) {
    if (a < 2) {
        return 1;
    } else {
        return a * factorial(a - 1);
    }
};
function arr_del(arr, d){
    return arr.slice(0,d-1);
};

Array.prototype.delRepeat=function(){ 
    var newArray=[]; 
    var provisionalTable = {}; 
    for (var i = 0, item; (item= this[i]) != null; i++) { 
        if (!provisionalTable[item]) { 
            newArray.push(item); 
            provisionalTable[item] = true; 
        } 
    }
    return newArray; 
};

var count = 0;
var group = 0;
var arr = [];

//game setLmEvent
function setLmEvent(index) {

    var oWrap = $(".kc_lm");
    var oNowBtn = $('.kc_lm_title li').eq(index);
    var submitBtn = $("#gameSubmit");
    var dex = oNowBtn.attr('data-num')-0;
    var h3 = oNowBtn.find('h3').html();


    // 处理任選二、選二連組、任選三、選三前組、任選四、任選五
    if(index == 0 || index == 2 || index ==3 || index ==5 || index == 6 || index == 7){
        run1();
    }else if(index == 1){
        run2();
    }else if(index == 4){
        run3();
    };

    function run3 () {
        var aBox = oWrap.find(".game_lm_item");
        var oBox1 = aBox.eq(0);
        var oBox2 = aBox.eq(1);
        var oBox3 = aBox.eq(2);
        var Li1 = oBox1.find('li');
        var Input1 = oBox1.find('input[type="checkbox"]');
        var Li2 = oBox2.find('li');
        var Input2 = oBox2.find('input[type="checkbox"]');
        var Li3 = oBox3.find('li');
        var Input3 = oBox3.find('input[type="checkbox"]');
        var b = false;
        var count = 0;

        Li1.unbind('click').click(function () {
            LiClick($(this), Li1);
        });

        Li2.unbind('click').click(function () {
            LiClick($(this), Li2);
        });

        Li3.unbind('click').click(function () {
            LiClick($(this), Li3);
        });

        Input1.unbind('click').click(function (event) {
            InputClick($(this), Li1, event)
        });

        Input2.unbind('click').click(function (event) {
            InputClick($(this), Li2, event)
        });

        Input3.unbind('click').click(function (event) {
            InputClick($(this), Li3, event)
        });

        function LiClick (t, aLi) {
            var $this = t;
            var oInput = $this.find('input[type="checkbox"]');
            if(b && subInit.openning == 'y'){
                
                if($this.hasClass('on')){
                    oInput.prop('checked', !oInput.is(':checked'));
                    checkChange($this, aLi, oInput);
                }
            }else{
                oInput.prop('checked', !oInput.is(':checked'));
                checkChange($this, aLi, oInput);
            }
        };

        function InputClick(t, aLi, event) {
            var oLi = t.parent().parent().parent();
            if(b){
                if(oLi.hasClass('on')){
                    checkChange(oLi, aLi, $(this));
                }
            }else{
                checkChange(oLi, aLi, $(this));
            }
            event.stopPropagation();
        };

        function checkChange (obj, aLi, input) {
            var objIndex = obj.index();
            group = 0;
            arr = [];

            var aLilen = aLi.length;
            for(var i=0; i<aLilen; i++){
                var $this = aLi.eq(i);
                if(i == objIndex){
                    $this.toggleClass('on');
                }
            };

            var oBox1On = oBox1.find('.on');
            var oBox2On = oBox2.find('.on');
            var oBox3On = oBox3.find('.on');

            var len1 = oBox1On.length;
            var len2 = oBox2On.length;
            var len3 = oBox3On.length;
            for(var j=0; j<len1; j++){
                var k1 = oBox1On.eq(j), k1i = k1.index();
                arr.push(k1.attr('data-bid').split('_')[1]);
                for(var q=0; q<len2; q++){
                    var k2 = oBox2On.eq(q), k2i = k2.index();
                    arr.push(k2.attr('data-bid').split('_')[1]-0+20);
                    if(k1i != k2i){
                        for(var m=0; m<len3; m++){
                            var k3 = oBox3On.eq(m), k3i = k3.index();
                            arr.push(k3.attr('data-bid').split('_')[1]-0+40);
                            if(k1i != k3i && k2i != k3i){
                                group++
                            }
                        }
                    }
                }
            }

            arr = arr.delRepeat();
        };

        bindSubmit();
    };

    function run2 () {
        var aBox = oWrap.find(".game_lm_item");
        var oBox1 = aBox.eq(0);
        var oBox2 = aBox.eq(1);
        var Li1 = oBox1.find('li');
        var Input1 = oBox1.find('input[type="checkbox"]');
        var Li2 = oBox2.find('li');
        var Input2 = oBox2.find('input[type="checkbox"]');
        var b = false;

        Li1.unbind('click').click(function () {
            LiClick($(this), Li1);
        });

        Li2.unbind('click').click(function () {
            LiClick($(this), Li2);
        });

        Input1.unbind('click').click(function (event) {
            InputClick($(this), Li1, event)
        });

        Input2.unbind('click').click(function (event) {
            InputClick($(this), Li2, event)
        });

        function LiClick (t, aLi) {
            var $this = t;
            var oInput = $this.find('input[type="checkbox"]');
            if(b && subInit.openning == 'y'){
                if($this.hasClass('on')){
                    oInput.prop('checked', !oInput.is(':checked'));
                    checkChange($this, aLi, oInput);
                }
            }else{
                oInput.prop('checked', !oInput.is(':checked'));
                checkChange($this, aLi, oInput);
            }
        };    

        function InputClick(t, aLi, event) {
            var oLi = t.parent().parent().parent();
            if(b){
                if(oLi.hasClass('on')){
                    checkChange(oLi, aLi, $(this));
                }
            }else{
                checkChange(oLi, aLi, $(this));
            }
            event.stopPropagation();
        };

        function checkChange (obj, aLi, input) {
            var objIndex = obj.index();
            group = 0;
            arr = [];

            var aLilen = aLi.length;
            for(var i=0; i<aLilen; i++){
                var $this = aLi.eq(i);
                if(i == objIndex){
                    $this.toggleClass('on');
                }
            };         

            var oBox1On = oBox1.find('.on');
            var oBox2On = oBox2.find('.on');

            var len1 = oBox1On.length;
            var len2 = oBox2On.length;
            for(var j=0; j<len1; j++){
                var k1 = oBox1On.eq(j), k1i = k1.index();
                arr.push(k1.attr('data-bid').split('_')[1]);
                for(var q=0; q<len2; q++){
                    var k2 = oBox2On.eq(q), k2i = k2.index();
                    arr.push(k2.attr('data-bid').split('_')[1]-0+20);
                    if(k1i != k2i){
                        group++
                    }
                }
            }

            arr = arr.delRepeat();
        };

        bindSubmit();
    };

    function run1() {
        var aLi = oWrap.find('li');
        var aInput = oWrap.find('input[type="checkbox"]');
        var b = false;

        aLi.unbind('click').click(aLiClick);
        aInput.unbind('click').click(aInputClick);
        
        function aLiClick () {
            var $this = $(this);
            var oInput = $this.find('input[type="checkbox"]');
            if(group >= 45 && subInit.openning == 'y'){
                if($this.hasClass('on')){
                    oInput.prop('checked', !oInput.is(':checked'));
                    checkChange($this, aLi, oInput);
                }
            }else{
                oInput.prop('checked', !oInput.is(':checked'));
                checkChange($this, aLi, oInput);
            }
        };

        function aInputClick(event) {
            var oLi = $(this).parent().parent().parent();
            if(b){
                if(oLi.hasClass('on')){
                    checkChange(oLi, aLi, $(this));
                }
            }else{
                checkChange(oLi, aLi, $(this));
            }
            event.stopPropagation();
        };

        function checkChange (obj, aLi, input) {
            var objIndex = obj.index();
            count = 0;
            group = 0;
            arr = [];

            input.prop({
                'disabled': false
            });


            var aLilen = aLi.length;
            for(var i=0; i<aLilen; i++){
                var $this = aLi.eq(i);
                if(objIndex == i){
                    $this.toggleClass('on');
                }
                if($this.hasClass('on')){
                    count++;
                    group = combination(count, dex);
                    arr.push($this.attr('data-bid').split('_')[1]);
                };
            };

            for (var i = 0; i < aLi.length; i++) {
                var $this = aLi.eq(i), ind = $this.index();
                if(group >= 45){
                    if(!$this.hasClass('on')){
                        $this.find('input[type="checkbox"]').prop({
                            'disabled': true
                        });
                    }
                }else{
                    if(!$this.hasClass('on')){
                        $this.find('input[type="checkbox"]').prop({
                            'disabled': false
                        });
                    }
                }
            };

        };

        bindSubmit();
    };

    function bindSubmit() {
        submitBtn.unbind('click').click(function () {
            var dlog = dialog();

            dlog.close().remove();

            arr = arr.sort(function(a, b){ return a-b; });

            var arr1 = [];
            var arr2 = [];
            var arr3 = [];

            var str = '';

            if(index == 4){
                for(var m=0; m<arr.length; m++){
                    if(arr[m]<=20){
                        arr1.push(arr[m]);
                    }else if(arr[m]>20 && arr[m]<=40){
                        arr2.push(arr[m]-20);
                    }else if(arr[m]>40){
                        arr3.push(arr[m]-40);
                    }
                }
                str = arr1+'|'+arr2+'|'+arr3;
            }else if(index == 1){
                for(var m=0; m<arr.length; m++){
                    if(arr[m]<=20){
                        arr1.push(arr[m]);
                    }else if(arr[m]>20){
                        arr2.push(arr[m]-20);
                    }
                }
                str = arr1+'|'+arr2;
            }else{
                str = arr;
            };

            if (group >= 1 && subInit.openning == 'y') {
                var data = {
                    'uPI_ID': oNowBtn.attr('data-bid').split('_')[1],
                    'odds': oNowBtn.attr('data-pl'),
                    'min': oNowBtn.attr('data-min'),
                    'max': ForDight(oNowBtn.attr('data-max')),
                    'jV': JeuValidate,
                    'wanfa': $(".game_box_title li").eq(subInit.gameTabIndex).attr("data-id"),
                    'jiangqi': $("#NowJq").attr("data-id"),
                    'NoS': arr,
                    'len': arr.length,
                    'group': group,
                    'myNos': str,
                    'h3': h3
                };
                var cLmHtml = juicer($("#tpl_lm_odds").html(), data);
                dlog = dialog({
                    id: "lmSubmitWrap",
                    title: "确认订单("+h3+")",
                    content: cLmHtml,
                    button:[
                        {
                            id: "ok",
                            value : subInit.returnOkText(),
                            callback: function () {
                                subInit.callBackFun(dlog, $("#orderLmForm"), 'lmPl');
                                return false;
                            },
                            autofocus: false
                        }
                    ]
                });
            }else if(group < 1 && subInit.openning == 'y'){

                dlog =  dialog({
                    title: "提示信息",
                    content: "您至少选择一注下单！",
                    button:[{
                        id: 'ok',
                        value : subInit.returnOkText(),
                        callback: function () {
                            return true;
                        },
                        autofocus: false
                    }]
                });

            }else{
                dlog =  dialog({
                    title: "提示信息",
                    content: "当前已停止下注，请等待下一期开盘。"
                });
            }

            dlog.addEventListener('close', function () {
                dlog.close().remove();
            });
            dlog.showModal();
            $("#odds_lm_pl").focus();    
            $("#odds_lm_pl").keyup(function (ev) {
                var va = $(this).val();
                var ga = group*va;
                $("#uPI_TM").val(ga);
                $("#lmPl").html(ga).attr("data-credit", va);
                
                var keycode = ev.which;
                if(keycode == 13 || keycode ==108 ){
                    subInit.callBackFun(dlog, $("#orderLmForm"), 'lmPl');
                };
            });
        });
    };
};
