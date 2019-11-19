define(function(require, exports, module) {
	var $  = require('jquery');

	require('myLayer')($);

	var dialog = require('plugin/dialog/dialog-plus');

	window.dialog = dialog;

	var getBaseDataAjax = require('getBaseDataAjax');

	/**
	 * [iEVersion]
	 * @return {[Number]} [Return IE's version]
	 */
	function iEVersion() {
		var ie=!-[1,], ie6=ie&&!window.XMLHttpRequest, ie8=ie&&!!document.documentMode, ie7=ie&&!ie6&&!ie8, n = 1;
		if (ie){
			if (ie6){
				n = 6;
			}else if (ie8){
				n = 8;
			}else if (ie7){
				n = 7;
			}
		}
		return n;
	}

	var skinIframeChange = function (attr) {

		var sCssObj = $("#mainIframe").contents().find('#Iframe_skin');

		sCssObj.attr('href', setUrl(sCssObj.attr('href'), attr));

		function setUrl(src, str) {
			var a = src.split("/");
			a[a.length-2] = str;
			return a.join('/');
		}
	};

	/**
	 * [findIframeElent]
	 * @param  {[elent]}
	 * @return [obj]
	 */
	function findIframeElent(element) {
		var obj = $(element, $('#mainIframe').document);
		return obj;
	}

	/**
	 * [goScrollTop]
	 * @param  [Number] t [The target point]
	 */
	function goScrollTop(t) {
		$("html, body").animate({ scrollTop: t }, 120);
		findIframeElent('.top_info').removeClass('sticky_top');
	}

	/**
	 * [deferHide]
	 * @param  obj
	 */
	function deferHide(obj, atr) {
		obj.timer = setTimeout(function () {
			obj.animate({atr : 0}, 100, function () {
				$(this).hide();
			});
		}, 500);
	}
	function getDocHeight(doc) {
		doc = doc || document;
		var body = doc.body, html = doc.documentElement;
		if(!body || !html){
			return;
		}
		var height = Math.max( body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		return height;
	}
	function reHeight(id, h){
		var hei = h? h: 0;
		var ifrm = document.getElementById(id);
		var doc = ifrm.contentDocument? ifrm.contentDocument:
			ifrm.contentWindow.document;
		ifrm.style.visibility = 'hidden';
		ifrm.style.height = "530px"; // reset to minimal height ...
		// IE opt. for bing/msn needs a bit added or scrollbar appears
		// ifrm.style.height = getDocHeight( doc ) + 4 + hei + "px";
		return getDocHeight( doc ) + 10 + hei;
	}
	/**
	 * [setCookie]
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 * @param {[type]} iDay  [description]
	 */
	function setCookie(name, value, hours){
		var life=new Date().getTime();
		life+=hours*1000*60;
		var cookieStr=name+"="+escape(value)+";expires="+new Date(life).toGMTString();
		document.cookie=cookieStr;
	}
	/**
	 * [getCookie]
	 * @param  {[type]} name [description]
	 */
	function getCookie(name){
		var cookies = document.cookie.split(";");
		if(cookies.length>0){
			var cookie=cookies[0].split("=");
			if(cookie[0]==name)
			return unescape(cookie[1]);
		}
		return null;
	}
	/**
	 * [removeCookie]
	 * @param  {[type]} name [description]
	 */
	function removeCookie(name){
		var cookieStr=name+"="+escape('null')+";expires="+new Date().toGMTString();
		document.cookie=cookieStr;
	}
	var timer = null;
	var aTimer= null;
	var timer2 = null;

	function setMyLayerMask() {
		$("#iframeTopMask").show();
	}
	function removeMyLayerMask() {
		$("#iframeTopMask").hide();
	}
	/**
	 * [indexInit]
	 * @type {Object}
	 */
	var indexInit = {
		/**
		* [_init]
		*/
		_init: function () {
			var _this = this;
			// ie6
			if (iEVersion() == 6) {
				_this.pageScrollBottom();
			}
			// Right user InfoShow
			_this.userInfoShow('.user_select');
			// Set menu
			_this.setMenu(menuData);
			// 初始化皮肤
			var skinBox = $("#skinBox");
			var skinHtml = '';
			for (var key in skinData) {
				if (skinData.hasOwnProperty(key)) {
					skinHtml += '<a data-skin="' + key + '" class="user_skin skin_' + key.toLowerCase() + '" href="javascript:;"><i></i>' + skinData[key] + '</a>';
				}
			}
			skinBox.html(skinHtml);
			// Obj ScrollEvent
			_this.scrollEvent();
			//Skin change
			_this.skinChange();
			//Cookie Set Skin
			_this.cookieSetSkin();
			//Index Requset Ajax
			_this.indexRequset();
			//
			_this.loopRequset(_this.updateTimeInit);
			// Menu Handler
			if(useNowMenuId == '1'){
				_this.menuHandlers(nowMenuId);
			}else{
				_this.menuHandlers((getCookie('menuId') == null) ? nowMenuId : getCookie('menuId'));
			}
			// 绑定公告弹出
			$("#noticeLink").click(function () {
				_this.setArtDialog($(this), '站内消息', 'AdShow.aspx');
			});

			// 声音开关
			$("#soundSwitch").click(function () {
				soundSwitch = !soundSwitch;
				soundRun($(this));
			});

			function soundRun(obj) {
				if (soundSwitch) {
					obj.removeClass().addClass("lbOn");
				} else {
					obj.removeClass().addClass("lbOff");
				}
			}
		},
		returnGameTypeId: function (gameId) {
			var typeId = '';
			if (gameId == '100') {
				typeId = 1;
			} else {
				typeId = 2;
			}
			return typeId;
		},
		setMenu: function (d) {
			var that = this;
			var html = '';
			for (var key in d) {
				var gameId = key.split('_')[1];
				html += '<li><a data-id="' + gameId + '" data-type="' + that.returnGameTypeId(gameId) + '" data-url="' + d[key]["url"] + '" href="javascript:void(0)">' + d[key]["name"] + '</a></li>';
			}
			$("#menuList").html(html);
		},
		updateTimeInit: 5,
		loopRequset: function (num) {
			var _this = this;
			aTimer ? clearTimeout(aTimer) : aTimer = null;
			if (--num) {
				aTimer = setTimeout(function () {
					_this.loopRequset(num);
				}, 1000);
			} else {
				// 加载赔率接口
				_this.indexRequset();
			}
		},
		indexRequset: function () {
			var that = this;

			var b = new getBaseDataAjax({
				url: root + '/Handler/QueryHandler.html',
				_type: 'POST',
				dataType: 'json',
				postData: {
				    action: 'get_ad',
				    browserCode: browserCode
				},
				completeCallBack: function (d) {
					// that.requsetErrorHandlers(d);
				},
				successCallBack: function (d) {
					
					// 重新启动倒计时
					that.loopRequset(that.updateTimeInit);
					that.requsetHandlers(d);
				},
				errorCallBack: function (d) {
					// tip = tips.msgTips({
					// 	msg: "服务器链接失败，稍后重试！",
					// 	type : "error"
					// });
				}
			});
		},
		usableCreditData: {},
		requsetHandlers: function (d) {

			var that = this, userSelectHtml, noticeHtml;

			if (d.tipinfo != '') {
				that.setErrorArtDialog(d.tipinfo);
			}
			var arrMasterids = masterids.split(',');
			var html = '';
			var userHtml = '';
			that.usableCreditData = d.data;
			var uc = '';
			for (var i = 0; i < arrMasterids.length; i++) {
				var oItem = d.data['game_' + arrMasterids[i]];
				userHtml = '';
				// 信用额度显示
				uc = parseFloat(oItem['credit']) + '';
				if (arrMasterids[i] == '1') {
					userHtml = '已用金額：' + parseFloat(Number(oItem['credit']) - Number(oItem['usable_credit']));
					sixUsableCredit = oItem['usable_credit'];
					// 处理现金 信用额度显示
					if(six_cash == '1'){
						uc = '-';
					}
				} else {
					kcUsableCredit = oItem['usable_credit'];
					kcProfit = oItem['profit']; //kc今日输赢
					// 处理现金 信用额度显示
					if(kc_cash == '1'){
						uc = '-';
					}
				}


				html += '<span class="user_select_itme_left">' +
							'<h3>' + oItem['name'] + '</h3>' +
							'<p>盘　　口：' + oItem['kind'] + '</p>' +
							'<p>信用額度：' + uc + '</p>' +
							'<p>可用金額：' + parseFloat(oItem['usable_credit']) + '</p>' +
							'<p>' + userHtml + '</p>' +
						'</span>';
			}

			$(".user_select_item").html(html).css({
				'width': arrMasterids.length*176
			});

			var adHtml = '';
			//notic Tmp
			var adList = d.data.ad;
			for (var i = 0; i < adList.length; i++) {
				adHtml += '<a data-action="" href="javascript:;"><span>' + adList[i]['title'] + '</span><span>' + adList[i]['time'] + '</span></a>';
			}
			$("#noticeLink").html(adHtml);
			// Notice scroll
			// that.notice(".notice");
			// console.log(d.data.six_usable_credit, d.data.kc_usable_credit)
			that.usableCredit = [sixUsableCredit, kcUsableCredit];
			// console.log(d, adList, that.usableCredit, kcProfit);
			//findIframeElent('#profit').html(1122);
			// Menu show
			that.menuShow('.menu');

			var curType = $("#menuText").attr('data-type');

			if (curType == '1'){//six
			}else if (curType == '2') {//kc
				if (isReady) {
					try{
						//更新iframe今日输赢值
						$(window.frames["mainIframe"].document).find("#profit").html(kcProfit);
						//驱动拉取开奖号码
						// $("#mainIframe").prop('contentWindow').closedMarket.openBallByAd();
					}catch(e){};
				}
			}
		},
		usableCredit: [],
		requsetErrorHandlers: function (d) {
			var that = this;

			if (d.hasOwnProperty('tipinfo')) {
				that.setErrorArtDialog(d.tipinfo);
			}

		},
		/**
		* [returnOkText]
		*/
		returnOkText: function () {
			return '\u786e\u5b9a'
		},
		/**
		* [returnCancelText]
		*/
		returnCancelText: function () {
			return '\u53d6\u6d88'
		},
		/**
		* [cookieSetSkin Cookie Set Skin]
		*/
		cookieSetSkin: function () {

			var that = this;

			that.setSkin($("#skin"), skinPath, 1);
			// 处理按钮当前状态
			$(".user_skin").removeClass('on');
			$(".user_skin[data-skin=" + skinPath + "]").addClass('on');

		},
		setFullPageLoading: function () {
			var wh = $(window).height();
			var html = '<div id="styleLoading" style="height:' + wh + 'px"></div>';
			if ($("#styleLoading").length == 0) {
				$('body').append(html);
			}
		},
		/**
		* [skinChange]
		*/
		skinChange: function () {

			var o = $("#skinChange"), box = o.find('em'), mCssObj = $("#skin"), that = this;
			// Add Btn Event
			o.hover(function () {
				clearTimeout(timer2);
				box.addClass('active');

			}, function () {

				timer2 = setTimeout(function () {

					box.removeClass('active');

				}, 1000);

			});

			// that.setSkin( mCssObj, skinPath, 1);

			// Bind Change Btn Click Event
			o.delegate('.user_skin', 'click', function () {

				skinPath = $(this).attr('data-skin');
				$(".user_skin").removeClass('on');
				$(this).addClass('on');
				that.setFullPageLoading();
				var b = new getBaseDataAjax({
					url: root + '/Handler/QueryHandler.html',
					_type: 'POST',
					dataType: 'json',
					postData: {
						action: 'set_skin',
						skin: skinPath
					},
					completeCallBack: function (d) {
					},
					successCallBack: function (d) {
						that.setSkin(mCssObj, skinPath, 0);
						box.removeClass('active');
					},
					errorCallBack: function (d) {
					}
				});
			});

		},
		/**
		* [setSkin]
		* @param {[type]} obj  [description]
		* @param {[type]} skin [description]
		* @param {[type]} n    [description]
		*/
		setSkin: function (obj, skin, n) {
			// Set Index Skin Css Url
			obj.attr('href', setUrl(obj.attr('href'), skin));

			// if is Cookie set Skin For Sub
			if (n == 1) {
				window.frames['mainIframe'].onload = function () {
						skinIframeChange(skin);
				};
				// else is Btn set Skin
			} else {
				skinIframeChange(skin);
			}

			loadCss(setUrl(obj.attr('href'), skin), function () {
				$("#styleLoading").remove();
				removeElement(document.getElementById('currSkin'));
			});

			function removeElement(_element) {
				var _parentElement = _element.parentNode;
				if (_parentElement) {
					_parentElement.removeChild(_element);
				}
			}
			function loadCss(cssUrl, callback) {
				var elem, bl,
					isExecuted = false; // 防止在ie9中，callback执行两次
				if (cssUrl == null) {
					return String(cssUrl);
				}
				elem = document.createElement('link'),
				elem.rel = 'stylesheet';
				elem.id = 'currSkin';
				if (typeof (callback) === 'function') {
					bl = true;
				}
				// for ie
				function handle() {
					if (elem.readyState === 'loaded' || elem.readyState === 'complete') {
						if (bl && !isExecuted) {
							callback();
							isExecuted = true;
						}
						elem.onreadystatechange = null;
					}
				}
				elem.onreadystatechange = handle;
				// for 非ie
				if (bl && !isExecuted) {
					elem.onload = callback;
					isExecuted = true;
				}
				elem.href = cssUrl;
				document.getElementsByTagName('head')[0].appendChild(elem);
			}

			// Set Skin Css URL Function
			function setUrl(src, str) {
				var a = src.split("/");
				a[a.length - 2] = str;
				return a.join('/');
			}

		},
		/**
		* [userInfoShow]
		* @param  {[obj]}
		*/
		userInfoShow: function (obj) {
			var o = $(obj),
				a = o.find('#user_select_btn'),
				box = o.find('.user_select_item'),
				timer = null,
				_this = this,
				isShow = true;
			o.hover(function () {
				// _this.indexRequset();
				box.show().animate({ 'opacity': '1' }, 300);
				clearTimeout(timer);
			}, function () {
				deferHide(box, 'opacity');
			});
			function deferHide(obj) {
				timer = setTimeout(function () {
					obj.animate({ 'opacity': 0 }, 100, function () {
						$(this).hide();
					});
				}, 500);
			}
		},
		setCredit: function (typeId) {
			var that = this;
			currTypeId = typeId;
			// 处理右上角信用额度，可用额度显示
			if (currTypeId == '1') {
				$(".nameType").html("(⑥)");
			} else {
				$(".nameType").html("(快)");
			}
			// console.log(that.usableCreditData, typeId)
			if (that.usableCreditData.hasOwnProperty("game_" + currTypeId)) {
				// 处理现金 信用额度显示
				if (that.usableCreditData["game_" + currTypeId].hasOwnProperty('credit')) {
					var uc = parseFloat(that.usableCreditData["game_" + currTypeId]['credit'])+'';
					if (currTypeId == '1') {
						if(six_cash == '1'){
							uc = '-';
						}
					} else {
						if(kc_cash == '1'){
							uc = '-';
						}
					}
					$("#creditSpan").html(uc);
				}
				if (that.usableCreditData["game_" + currTypeId].hasOwnProperty('usable_credit')) {
					$("#usableCreditSpan").html(parseFloat(that.usableCreditData["game_" + currTypeId]['usable_credit']));
				}
			}

		},
		/**
		* [menuShow]
		* @param  [obj]
		*/
		menuShow: function (obj) {
			var timer = null, ll = $(obj).find('li').length, that = this;
			// Hover Menu
			$(obj).unbind('mouseenter').bind('mouseenter', function () {
				$(this).find('div').show().animate({ 'height': ll * 29 }, 100);
				clearTimeout(timer);
			});
			$(obj).unbind('mouseleave').bind('mouseleave', function () {
				deferHide($(this).find('div'), 0);
			});
			// 初始化右侧信用额度
			that.setCredit($("#menuText").attr('data-type'));
			// Bind Menu Click
			$(obj).find('div a').unbind('click').bind('click', function () {
				PlayPageIndex = 0;
				isReady = false;
				that.menuHandlers($(this).attr("data-id"));
				nowMenuId = $(this).attr("data-id");
				deferHide($(obj).find('div'), 0);
				setCookie('menuId', $(this).attr("data-id"), 24);
				// 绑定右侧信用额度
				that.setCredit($(this).attr('data-type'));
			});

			function deferHide(obj, time) {
				timer = setTimeout(function () {
					obj.animate({ 'height': 0 }, 100, function () {
						$(this).hide();
					});
				}, time);
			}
		},
		/**
		* [menuHandlers Package Menu Handlers]
		* @param  {[type]} id [description]
		*/
		menuHandlers: function (id) {
			var obj = $('.menu'), mA = obj.find("#menuText"), aText = mA.find('span'), aA = obj.find('div a[data-id=' + id + ']');
			aText.html(aA.html());
			mA.attr('data-id', id);
			mA.attr('data-type', aA.attr('data-type'));
			GameName = aA.html();
			GamePath = aA.attr('data-url');
			// Set Iframe Src
			$("#mainIframe").attr('src', 'index/'+aA.attr('data-url') + '.html?lid=' + aA.attr('data-id') + '&path=' + aA.attr('data-url'));
			//Menu After Bind Nav Handlers
			this.navHandlers();
		},
		/**
		* [navHandlers]
		*/
		navHandlers: function () {
			var id = $("#menuText").attr('data-id'), aNav = $('.nav a'), that = this;
			aNav.unbind('click');
			aNav.click(function () {
				var title = $(this).find('span').html(), action = $(this).attr("data-action");
				if (action != '') {
					that.setArtDialog($(this), title, action + '?id=' + id);
				} else {
					// $(this).myLayer({
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
						cancel: function () {}
					});
					d.showModal();
					// 
					// layer.confirm('您確定要退出嗎？', {
					// 	btn: ['確定','取消'] //按钮
					// }, function(){
					// 	top.location.href = '/';
					// }, function(){

					// });
					return false;
				}
			});
		},
		setArtDialog: function (obj, title, url) {
			// layer.open({
			// 	title: title,
			// 	type: 2,
			// 	fix: false, //不固定
			// 	area: '900px',
			// 	maxmin: true,
			// 	content: url,
			// 	success: function(layero, index) {
			// 		layer.iframeAuto(index);
			// 	}
			// });
			// obj.myLayer({
			// 	title: title,
			// 	isMiddle: true,
			// 	isShowBtn: false,
			// 	url: url
			// });
			// 
			ddddd = dialog({
				title: title,
				url: url,
				fixed: true,
				onreset: function () {
					// console.log()
				},
				oniframeload: function () {
					this.reset()
				},
				onremove: function () {
					// console.log('onremove');
				}
			});
			ddddd.showModal();
		},
		setErrorArtDialog: function (message) {
			$("body").myLayer({
				title: '\u63d0\u793a\u4fe1\u606f',
				content: message,
				isMiddle: true,
				okText: '確定',
				okCallBack: function () {	
					$("#myWarp").html('');
				}
			});
		},
		/**
		* [setIframeHeight]
		* @param [Boolean] b
		*/
		setIframeHeight: function (b) {
			setTimeout(function () {
				var oIframe = $("#mainIframe"); var hei = 0; var winHeight = $(window).height() - 121;
				if (!b) {
					hei = oIframe.contents().find('html body').height();
				} else {
					var h = oIframe.height();
					hei = h + b;
				};
				if (hei <= winHeight) {
					hei = winHeight;
				};
				oIframe.height(hei);
			}, 10);
		},
		/**
		* [pageScrollBottom]
		*/
		pageScrollBottom: function () {
			$(".notice").css({
				'top': $(document).scrollTop() + $(window).height() - 25
			});
		},
		/**
		* [scrollEvent]
		*/
		scrollEvent: function () {
			var that = this;
			$(window).bind('scroll', function () {
				var pdScrollTop = $(document).scrollTop();
				setTimeout(function () {
					if (window.frames['mainIframe'].subInit != undefined) {
						window.frames["mainIframe"].subInit.pageScrollTop(pdScrollTop);
					}
					if (iEVersion() == 6) {
						that.pageScrollBottom();
					}
				}, 0)
			});
		},
		isNoLogin: function () {
			window.location.href = "/";
		}
	};


	module.exports = indexInit;

});