define(function (require, exports, module) {
	var $  = require('jquery');
	require('plus')($);

	var sub = require('sub');

	require('array');

	var p = window.top;

	var oBody = $("body");

	var isError = true;

	if (top.dialog.get(window)) {
		top.dialog.get(window).title('退水');
	}
	
	function ForDight4(Dight){
		Dight = Math.round(Dight*Math.pow(10,4))/Math.pow(10,4);
		return Dight;
	}

	oBody.onlyNumber({
		className: '.plNumber',
		isDecimal: true,
		isMinus: false
	});

	oBody.onlyNumber({
		className: '.plMinsNumber',
		isDecimal: true,
		isMinus: true
	});

	oBody.onlyNumber({
		className: '.onlyNum',
		isDecimal: false,
		isMinus: false
	});
	
	try {
		if (drawFlag == '1') {
			$(".text").attr('disabled', true);
			$("#drawbackBtn").parent().hide();
		}
	} catch(e) {}

	$("#drawBackWrap").delegate('.text', 'focus',function () {
		var that = $(this);
		setTips(that, false);
	});

	var six_plwt = $("#six_plwt");
	$("#six .addBtns").click(function () {
		var sixVal = six_plwt.val();
		var endVal = 0;
		$(".text").removeClass('textOn');
		if (Number(sixVal) > 0) {
			$("#six .plNumber:not(.zk)").each(function () {
				var that = $(this);
				if (that.is(":visible") == true) {
					var thatId = that.attr('id');
					endVal = Number(that.val()) + Number(sixVal);
					if (endVal > Number(drawBackjson[thatId.split('_')[0]][thatId])) {
						endVal = Number(drawBackjson[thatId.split('_')[0]][thatId]);
					}else if(endVal <= 0){
						endVal = 0;
					}
					that.val(ForDight4(endVal)).addClass('textOn');
				}
			});
		}
	});
	$("#six .minBtns").click(function () {
		var sixVal = six_plwt.val();
		var endVal = 0;
		$(".text").removeClass('textOn');
		if (Number(sixVal) > 0) {
			$("#six .plNumber:not(.zk)").each(function () {
				var that = $(this);
				if (that.is(":visible") == true) {
					var thatId = that.attr('id');
					endVal = Number(that.val()) - Number(sixVal);
					if (endVal > Number(drawBackjson[thatId.split('_')[0]][thatId])) {
						endVal = Number(drawBackjson[thatId.split('_')[0]][thatId]);
					}else if(endVal <= 0){
						endVal = 0;
					}
					that.val(ForDight4(endVal)).addClass('textOn');
				}
			});
		}
	});
	var kc_plwt = $("#kc_plwt");
	$("#kc .addBtns").click(function () {
		var kcVal = kc_plwt.val();
		var endVal = 0;
		$(".text").removeClass('textOn');
		if (Number(kcVal) > 0) {
			$("#kc .plNumber:not(.zk)").each(function () {
				var that = $(this);
                var max = that.attr("data-max");
				if (that.is(":visible") == true) {
					var thatId = that.attr('id');
					endVal = Number(that.val()) + Number(kcVal);
                    if (endVal > Number(max)) {
                        endVal = Number(max);
					}else if(endVal <= 0){
						endVal = 0;
					}
					that.val(ForDight4(endVal)).addClass('textOn');
				}
			});
		}
	});
	$("#kc .minBtns").click(function () {
		var kcVal = kc_plwt.val();
		var endVal = 0;
		$(".text").removeClass('textOn');
		if (Number(kcVal) > 0) {
			$("#kc .plNumber:not(.zk)").each(function () {
				var that = $(this);
				var max = that.attr("data-max");
				if (that.is(":visible") == true) {
					var thatId = that.attr('id');
					endVal = Number(that.val()) - Number(kcVal);
					if (endVal > Number(max)) {
						endVal = Number(max);
					}else if(endVal <= 0){
						endVal = 0;
					}
					that.val(ForDight4(endVal)).addClass('textOn');
				}
			});
		}
	});
	function setTips(that, isFocus) {
		var thatId = that.attr('id');
		var max = that.attr('data-max');

		if(!that.hasClass('zk')){
			if (isError) {
				if (that.attr('name').indexOf('single_min') == -1) {
					myText = '最大';
				}else{
					myText = '最小';
				}
				that.myxTips({
					content: myText + '：<span class="red">' + max + '</span>',
					ishide: false,
					isFocus: true
				});
				if(isFocus){
					that.focus();
				}
			}else{
				that.myxTips({
					content: '單註限額必須大於最小單註'+ $("#"+thatId.replace(/max_amount/, 'single_min_amount')).val() + '!',
					ishide: false,
					isFocus: true
				});
				if(isFocus){
					that.focus();
				}
				isError = true;
			}
		}
	}

	$("#drawBackWrap").delegate('.text', 'blur',function () {
		$('#myxTips').remove();
	});

	$("#drawbackBtn").click(function () {
		submitForm();
	});

	function submitForm() {
		var textHaved = true;
		var dataAttr = [];
		var pidAttr = [];
		var submitSrt = '';
		$(".text").each(function () {
			var that = $(this);
            var max = that.attr("data-max");
			var thatId = that.attr('id');
			if(!that.hasClass('zk') && that.is(":visible") == true){

				if(isNaN(that.val())){
					findTabBox(that);
					setTips(that, true);
					textHaved = false;
					return false;
				}else if(that.val() == ''){
					findTabBox(that);
					setTips(that, true);
					textHaved = false;
					return false;
				}else if(Number(that.val()) > Number(max) && that.attr('name').indexOf('single_min') == -1){
					findTabBox(that);
					setTips(that, true);
					textHaved = false;
					return false;
				}else if(Number(that.val()) < Number(max) && that.attr('name').indexOf('single_min') != -1){
					findTabBox(that);
					setTips(that, true);
					textHaved = false;
					return false;
				}else if(thatId.indexOf('max_amount') != -1 && Number(that.val()) < Number($("#"+thatId.replace(/max_amount/, 'single_min_amount')).val()) ){
					findTabBox(that);
					isError = false;
					setTips(that, true);
					textHaved = false;
					return false;
				}else{
					textHaved = true;
					return true;
				}
			}
		});
		if(textHaved){
			sub.setIframeLoading();
            var array = [];
            var obj;

            $(".tm3 .list_hover").each(function () {
                var that = $(this);
                that.find("input").each(function () {
                	var thatVal = $(this).attr('data-val');
                	var newVal  = $(this).val();

                    if (thatVal != newVal) {

                        var code = that.find("[name='code']").text();
                        var betSort = that.find("[name='betSort']").text();
                        var rebateA = that.find("input").eq(0).val();
                        var rebateB = that.find("input").eq(1).val();
                        var rebateC = that.find("input").eq(2).val();
                        var maxBet = that.find("input").eq(3).val();
                        var maxExpectBet = that.find("input").eq(4).val();
                        var minBet = that.find("input").eq(5).val();
                        obj = {
                            'code': code,
                            'betSort': betSort,
                            'minBet': minBet,
                            'maxBet': maxBet,
                            'maxExpectBet': maxExpectBet,
                            'rebateA': rebateA,
                            'rebateB': rebateB,
                            'rebateC': rebateC
                        };
                        array.push(obj);
                        return false;
                    }
                });

            });







			// $(".text").each(function () {
			// 	var that = $(this);
			// 	var thatName = that.attr('name');
			// 	var thatVal = that.attr('data-val');
			// 	var newVal = that.val();
            //
			// 	if(!that.hasClass('zk')){
			// 		if (thatVal != newVal) {
            //
             //            var code = that.parent().parent().find("input").eq(0);
             //            var betSort = that.parent().parent().find("input").eq(1);
             //            var rebateA = that.parent().parent().find("input").eq(2);
             //            var rebateA = that.parent().parent().find("input").eq(3);
             //            var rebateA = that.parent().parent().find("input").eq(4);
             //            var maxBet = that.parent().parent().find("input").eq(5);
             //            var maxExpectBet = that.parent().parent().find("input").eq(7);
             //            var minBet = that.parent().parent().find("input").eq(8);
            //
            //
            //
			// 			var thatAttr = thatName.split('_');
			// 			var pid = thatAttr[thatAttr.length-1];
			// 			var game = thatAttr[0];
			// 			var obj1 = $("#"+ game +"_a_"+pid);
			// 			var obj2 = $("#"+ game +"_b_"+pid);
			// 			var obj3 = $("#"+ game +"_c_"+pid);
			// 			var obj4 = $("#"+ game +"_max_amount_"+pid);
			// 			var obj5 = $("#"+ game +"_phase_amount_"+pid);
			// 			var obj6 = $("#"+ game +"_single_min_amount_"+pid);
			// 			dataAttr.push(game +"_a_"+pid + '=' + obj1.val());
			// 			dataAttr.push(game +"_b_"+pid + '=' + obj2.val());
			// 			dataAttr.push(game +"_c_"+pid + '=' + obj3.val());
			// 			dataAttr.push(game +"_max_amount_"+pid + '=' + obj4.val());
			// 			dataAttr.push(game +"_phase_amount_"+pid + '=' + obj5.val());
			// 			dataAttr.push(game +"_single_min_amount_"+pid + '=' + obj6.val());
			// 			pidAttr.push(game+'_'+pid);
			// 		}
            //
             //        var code = $(this).find("input[name='code']").val();
             //        var betSort = $(this).find("input[name='betSort']").val();
             //        var minBet = $(this).find("input[name^='minBet']").val();
             //        var maxBet = $(this).find("input[name^='maxBet']").val();
             //        var maxExpectBet = $(this).find("input[name^='maxExpectBet']").val();
             //        var rebateA = $(this).find("input[name^='rebateA']").val();
             //        var rebateB = $(this).find("input[name^='rebateB']").val();
             //        var rebateC = $(this).find("input[name^='rebateC']").val();
            //
			// 	}
			// });

			// dataAttr = dataAttr.uniquelize();
			// pidAttr = pidAttr.uniquelize();
            //
            //
            //
			// submitSrt = dataAttr.join('&') + '&savenew=' + ($('#savenew').is(':checked')?1:0) + '&hdnSubmit=' + $('#hdnSubmit').val() + '&uid=' + $('#uid').val() + '&isAdd=' + $('#isAdd').val() + '&namestr=' + pidAttr.join(',');
            var url = root + "/siteLotteryRebates/saveSiteLotteryRebates.html";
            data['lotteryRebatesJson'] = JSON.stringify(array);
            data['search.hid'] = $("[name='search.hid']").val();
			if(array.length > 0){
				$.ajax({
					type: 'POST',
					url: url,
					// data: $('#form_six').serialize(),
					data: data,
                    dataType: 'json',
					error: function () { alert('处理程序出错,请通知管理员检查！'); },
					success: function (data) {
						sub.removeAjaxLoading();
                        alert(data.msg);
                        history.go(-1);
					}
				});
			}else{

				if(p.NewIsAdd){
					window.location.href = backurl; 
				}

				sub.removeAjaxLoading();
				alert('退水設置未有改動！'); 
			}
		}
	}

	function findTabBox(that) {
		if(!that.parents('.tabBox').hasClass('tabBoxOn')){
			$('.tabBtn:not(.on)').click();
		}
	}

	$("#resetBtn").click(function () {
		top.dialog.get(window).close().remove();
	});

	p.setIframeHeight();
});
