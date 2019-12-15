define(function(require, exports, module) {
	var $  = require('jquery');
	require('myLayer')($);
	require('skinChange');

	var getBaseDataAjax = require('getBaseDataAjax');


	function returnSec (str) {
		str = str.replace(/-/g, "/");
		var d = new Date(str);
		return d.getTime();
	}

	// 格式化时间 hh:mm:ss => s
	function timeFormat(time) {
		var hms = time.split(":"),
		s = hms[2] - 0,
		m = hms[1] - 0,
		h = hms[0] - 0;
		return h * 3600 + m * 60 + s;
	}
	// 反格式化时间 s => hh:mm:ss
	function unTimeFormat(time) {
		var h = parseInt(time / 60 / 60) + '', m = parseInt(time / 60) - 60 * h + '', s = time % 60 + '';
		h < 10 ? h = '0' + h : h;
		m < 10 ? m = '0' + m : m;
		s < 10 ? s = '0' + s : s;
		return h + ':' + m + ':' + s;
	}


	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			factory(require('jquery'));
		} else {
			factory(jQuery);
		}
	}(function ($) {

		$.fn.noopenDiv = function () {

			return this.each(function () {
				this.top = (Math.random() - 1) * 300;
				this.left = (Math.random() - 0.5) * $(window).width() / 2;
				var that = $(this);
				divanmate();
				function divanmate() {
					that.css({
						'top': this.top,
						'left': this.left
					}).animate({
						'top': (Math.random() - 2) * 300,
						'left': Math.random() * 400
					}, (Math.random() + 0.5) * 3000, function () {
						that.animate({
							'top': this.top,
							'left': this.left
						}, (Math.random() + 0.5) * 3000, function () {
							divanmate();
						});
					});
				}
			});

		};

	}));

	var noopenInit = function () {

		window.parent.htmlData = {};

		// top.setHeight();

		var ie6Html = '';
		var ie6 = !-[1,]&&!window.XMLHttpRequest;
		if (!ie6) {
			ie6Html = '<div class="bg"></div><div class="bg"></div><div class="bg"></div>';
		}
		var bItem = $('<div class="bg"></div>'+ ie6Html);

		$('body').append(bItem);
		$('.bg').noopenDiv();
		var timer = null;
		var timer2 = null;
		var timer3 = null;
		var n = 3;
		if (parent.GamePath == 'L_SIX') {
		    $("#kc").hide();
		    $("#six").show();
			$("#phase").html(phase);
			getOpenBall(n);
		}else {
		    $("#six").hide();
		    $("#kc").show();
			openTimeUpdata((returnSec(endTime) - returnSec(currentTime))/1000);
		}

		$("#kjBtn").click(function () {
			var that = $(this);
			window.parent.setMyLayer('/SixOpenSchedule/six_open_date.aspx',  that.html());
		});


		// 六合彩
		function sixGetBall(seconds) {
			clearTimeout(timer3);
			if (--seconds) {
				timer3 = setTimeout(function () {
					sixGetBall(seconds);
				}, 1000);
			} else {
				getOpenBall();
			}
		}
		function getOpenBall(argument) {
			var b = new getBaseDataAjax({
				url: top.GamePath+'/Handler/Handler.ashx',
				postData:{
					action: 'get_openball'
				},
				completeCallBack:function () {},
				successCallBack:function (d) {
					if (d.data.draw_phase == phase) {
						if (d.data.hasOwnProperty("draw_result")) {
							var arrNumber = d.data.draw_result;
							var html = '';
							for (var i = 0; i < arrNumber.length; i++) {
								if(arrNumber[i]){
									if(i==6){
										html+='<span class="No_add">+</span><span class="No_'+arrNumber[i]+'"></span><span class="No_text">'+ d.data.upopennumberzodiac[i] +'</span>';
									}else {
										html+='<span class="No_'+arrNumber[i]+'"></span><span class="No_text">'+ d.data.upopennumberzodiac[i] +'</span>';
									}
								}
							}
							if(arrNumber[6] != ''){
								n = 10;
							}
							$("#openBall").html(html);
						}
					}else{
						$("#openBall").html("（未開獎，請耐心等待！）");
					}
					if (d.data.hasOwnProperty('newphase')) {
						if(d.data.newphase != ''){
							window.location.href = d.data.newphase;
						}
					}
					sixGetBall(n);
				},
				errorCallBack:function () {}
			});
		}

		var kc_valid_seconds = 0;
		// 快彩
		function openTimeUpdata(seconds) {
			if (isNaN(seconds)) {
				return;
			}
			if(seconds<0){
				isOpenPan();
				return;
			}
			clearTimeout(timer);
			if (kc_valid_seconds >= 1800) {
			    kc_valid_seconds = 0;
			    window.location.reload();
			}
			if (--seconds) {
				timer = setTimeout(function () {
				    openTimeUpdata(seconds);
				}, 1000);
				var time = unTimeFormat(seconds);
				var h = time.split(':')[0];
				var m = time.split(':')[1];
				var s = time.split(':')[2];
				$("#openTime").html('距離開盤時間還有:<span>' + h + '小時' + m + '分' + s + '秒</span>');
				kc_valid_seconds++;
			} else {
				window.location.href = url;
			}
		}

		function closeTimeUpdata(seconds) {
			clearTimeout(timer2);
			if (--seconds) {
				timer2 = setTimeout(function () {
					closeTimeUpdata(seconds);
				}, 1000);
				$("#openTime").html('未開盤，'+ seconds + '秒後刷新！');
			} else {
				isOpenPan();
			}
		}
		function isOpenPan(num) {
			var b = new getBaseDataAjax({
				url: '/Handler/QueryHandler.html',
				postData:{
					action: 'get_openlottery',
					lid: lid
				},
				completeCallBack:function () {},
				successCallBack:function (d) {
					if(d.data.isopenvalue.isopen == -1){
						closeTimeUpdata(10);
					}else{
						// window.parent.$.myLayer.close(true);
						window.location.href = url;
					}
				},
				errorCallBack:function () {}
			});
		}

	};

	module.exports = noopenInit;
});
