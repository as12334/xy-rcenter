define(function(require, exports, module) {
	var $  = require('jquery');

	require('plus')($);

	require('myLayer')($);

	// 引入新dialog-plus 插件 支持 iframe
	window.dialog = require('dialog-plus');
	// // 将dialog对象暴露，iframe内部可以访问
	// // 
	// console.log(dialog)
	// window.dialog = dialog;

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


	$("#logoText").attr({
		'src': $("#logoText").attr('src') +'?'+ Math.random()
	});

	var getBaseDataAjax = require('getBaseDataAjax');
	var sound = require('sound');

	masterFirst = $.inArray(masterids.split(',')[0], masterArr);

	var skinBox = $("#skinBox");

	if (online_type != 'zj') {
		$("#onlineBtn").addClass('onlineClass');
	}

	$("#onlineBtn").click(function () {
		if (online_type == 'zj') {
			// $(this).myLayer({
			// 	title: "在線",
			// 	isMiddle: true,
			// 	isShowBtn: false,
			// 	url: "ViewOnlineUser.aspx"
			// });

			dialog({
				id: 'topDialog',
				title: "在線",
				url: 'ViewOnlineUser.aspx',
				fixed: true,
				onreset: function () {
				},
				oniframeload: function () {
					this.reset()
				}
			}).showModal();
		}
	});

	var skinHtml = '';
	var skinIndex = 0;
	for(var key in skinData){
		var skinClass = '';
		if (!skinIndex) {
			skinClass = 'active';
		}
		skinHtml += '<a class="'+ key +' '+ skinClass +'" data-skin="'+ key +'" href="javascript:;"><em><i></i></em><span>'+ skinData[key] +'</span></a>'
		skinIndex++;
	}

	skinBox.html( skinHtml );

	$("#skinWrap").hover(function () {
		skinBox.show();
	},function () {
		skinBox.hide();
	});

	setSkinFun(skinBox.find("a[data-skin="+ skinPath +"]"));

	skinBox.find('a').click(function () {
		setSkinFun($(this));
	});
	function removeElement(_element){
		 var _parentElement = _element.parentNode;
		 if(_parentElement){
				_parentElement.removeChild(_element);
		 }
	}
	function loadCss (cssUrl, callback) {
		var elem, bl,
			isExecuted = false; // 防止在ie9中，callback执行两次
		if ( cssUrl == null ) {
			return String(cssUrl);
		}
		elem = document.createElement('link'),
		elem.rel = 'stylesheet';
		elem.id = 'currSkin';
		if ( typeof(callback) === 'function' )  {
			bl = true;
		}
		// for ie
		function handle() {
			if ( elem.readyState === 'loaded' || elem.readyState === 'complete' ) {
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

	function setFullPageLoading() {
		var wh = $(window).height();
		var html = '<div id="styleLoading" style="height:'+ wh +'px"></div>';
		if($("#styleLoading").length == 0){
			$('body').append(html);
		}
	}

	function setSkinFun(obj) {
		var thisPath = obj.attr('data-skin');
		var isLoadover = false;
		var aLink = [];
		skinBox.find('a').removeClass('active');
		obj.addClass('active');
		skinBox.hide();
		var oSkin = $("#skin");
		var mainIframeSkin = $("#mainIframe").contents().find('#Iframe_skin');
		if (thisPath != skinPath) {
			setFullPageLoading();
			var b = new getBaseDataAjax({
                url: root + '/Handler/QueryHandler.html',
				_type: 'POST',
				dataType: 'json',
				postData:{
					action: 'set_skin',
					skin: thisPath
				},
				completeCallBack:function (d) {},
				successCallBack:function (d) {
					// 改变首页
					aLink = [];
					aLink.push(setUrl(oSkin.attr('href'), thisPath));
					oSkin.attr('href', setUrl(oSkin.attr('href'), thisPath));
					// 改变iframe
					if (thisPath != skinPath) {
						// aLink.push(mainIframeSkin);
						mainIframeSkin.attr('href', setUrl(mainIframeSkin.attr('href'), thisPath));
					}
					var dateDiv = $('div[lang=zh-cn]');
					if (dateDiv.length>0) {
						var skinLink = dateDiv.find('iframe').contents().find('link');
						aLink.push(setUrl(skinLink.attr('href'), thisPath));
						skinLink.attr('href', setUrl(skinLink.attr('href'), thisPath));
					}
					var i = 0;
					if(thisPath != skinPath){
						loadFun(i);
					}
					function loadFun(i) {
						loadCss(aLink[i], function () {
							if(i == (aLink.length - 1)){
								isLoadover = true;
								$("#styleLoading").remove();
								removeElement(document.getElementById('currSkin'));
							}else {
								i++;
								loadFun(i);
								removeElement(document.getElementById('currSkin'));
							}
						});
					}
					skinPath = thisPath;
				},
				errorCallBack:function (d) {}
			});
		}

	}

	function setUrl(src, str) {
		var a = src.split("/");
		a[a.length-2] = str;
		return a.join('/');
	}

	// 导航
	$(".navBox").hover(function () {
		$('.navList').show();
		$(".up").hide();
		$(".down").show();
	}, function () {
		$('.navList').hide();
		$(".up").show();
		$(".down").hide();
	});
	// 导航click事件
	setNav($(".navBox a").eq(0));

	$(".navBox a").click(function () {
		// if (isClickAgin) {
			setNav($(this));
		// }else{

		// }
	});

	function setNav(obj) {
		$("#menuText").html(obj.html());
		pathFolder = obj.attr('data-url');
		$("#menuText").attr("data-url", obj.data('url'));
		$("#menuText").attr("data-id", obj.attr('data-id'));
		myLid = obj.attr('data-id');
		masterFirst =  $.inArray(returnSid(myLid), masterArr);
		$(".navList").hide();
		$("#menuUl").find('li:first').click();
	}

	// 一级导航功能处理
	function setMenu() {
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

		setLi(aLi.eq(aLi.length-2));

		aLi.unbind('click').click(function () {
			setLi($(this));
		});

		function setLi (obj) {
			if(obj.html() == '安全退出'){
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
					cancel: function () {}
				});
				d.showModal();
			}else{
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
					domMenu(obj.html(), sUrl);
				}
			}
		}
	}

	function domMenu(mainKey, affiKeys) {
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
			if (aMenu[i].indexOf("|") > 0) {
				text = aMenu[i].split('|')[0];
				url = aMenu[i].split('|')[1];
				ifAlert = aMenu[i].split('|')[2];
			} else {
				text = mainKey;
				url = aMenu[i];
			}
			if(mainKey == '即時注單' && text != '帳單' && text != '實時滾單'){
				isDoubleClick = 0;
			}else{
				isDoubleClick = 1;
			}
			if (ifAlert == '0') {
				sHtml += '<a href="javascript:;" data-isdc='+ isDoubleClick +' data-url="' + url + '">' + text + '</a><b>|</b>';
			} else {
				sHtml += '<a href="javascript:;" data-isdc='+ isDoubleClick +' data-iframe="' + url + '">' + text + '</a><b>|</b>';
			}
		}

		$(".navListBox").html(sHtml).children().last().remove();
		var aA =  $(".navListBox a");

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
			}else{
				// isClickAgin = true;
				setA(thatObj);
			}
		});

		function setA(obj) {
			$("#ajaxLoading").remove();
			if(obj.html() == '變更密碼'){
				// obj.siblings('a').addClass('onBtn');
			}else{
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
			}else if(obj.data('iframe')){
			   if(affiKeys == 'ut'){
					if( obj.data('iframe') == 'Quit.aspx' ){
						window.location.href = "Quit.aspx";
					}else{
						htmlData = {};
						$("#mainIframe").attr('src', obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
						$("#mainIframe").load(function () {
							setIframeHeight();
						});
					}
				}else{
					if(obj.html() == '帳單' || obj.html() == '備份' ){
						htmlData = {};
						$("#mainIframe").attr('src', affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
					}else if(obj.html() == '實時滾單'){
						window.open(affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"),'實時滾單','width=1920,height=1080,top=0,left=0,directories=no,status=no,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no');
					}else{
						myPath = affiKeys + '/' + obj.data('iframe');
						pathName = affiKeys + obj.data('iframe').split('.')[0];
						if(htmlData[pathName] && iEVersion() != 6 && iEVersion() != 7){
							try{
								$("#mainIframe").contents().find('html body').html($(htmlData[pathName]));
								window.frames['mainIframe'].setScript(true);
							}catch(e){};
						}else{
							$("#mainIframe").attr('src', affiKeys + '/' + obj.data('iframe') + '?lid=' + $("#menuText").attr("data-id"));
						}
					}
				}
			}
		}
	}

	setMenu();

	// 公告接口
	var aTimer = null;

	var updateTimeInit = 5;

	function adRequset(num) {
		aTimer ? clearTimeout(aTimer) : aTimer = null;
		if(--num){
			aTimer = setTimeout(function () {
				adRequset(num);
			}, 1000);
		}else{
			// 加载赔率接口
			indexRequset();
		}
	}
	var oldTime = '';
	function indexRequset() {
		var b = new getBaseDataAjax({
            url: root + '/Handler/QueryHandler.html',
			_type: 'POST',
			dataType: 'json',
			postData:{
				action: 'get_ad',
				oldTime: oldTime
			},
			completeCallBack:function () {},
			successCallBack:function (d) {
				// 重新启动倒计时
				adRequset( updateTimeInit );
				oldTime = d.data.autoJP.timestamp;
				indexDom(d);
			},
			errorCallBack:function () {}
		});
	}

	var newHtml = '';
	var tipsHtml = '';

	function indexDom (d) {
		// 降赔列表展示
		var tipsList = d.data.autoJP.tipsList;
		var tipsListLen = tipsList.length;

		if(tipsListLen>0){
			for(var i=0; i<tipsListLen; i++){
			    var title = '';
			    var category = '';
			    //if (tipsList[i]['category'] != null && tipsList[i]['category'] != '') {
			    //    category = '【' + tipsList[i]['category'] + '】';
			    //}

			    var numberStr = "";
			    if (tipsList[i]['number'] != null && tipsList[i]['number'] != '') {
			        numberStr = ' 單號碼【' + tipsList[i]['number'] + '】 ';
			    }
				if(tipsList[i]['play_name'] == tipsList[i]['put_val']){
				    title = '<b class="red">' + tipsList[i]['play_name'] + '</b>' + numberStr + '降';
				} else {
				   
				    title = tipsList[i]['play_name'] + '<b class="red">' + tipsList[i]['put_val'] + '</b>號' + numberStr + '降 ';
				}
				tipsHtml += '<li>『' + tipsList[i]['lottery_name'] + '<span class="green">第' + tipsList[i]['phase'] + '期</span>' + category + title + '<span class="red">' + tipsList[i]['odds'] + '</span>』 ' + tipsList[i]['add_time'] + '</li>';
			}
			console.log(tipsHtml != $("#jpWrap").text())
			if (tipsHtml != $("#jpWrap").text()) {
				$("#jpWrap").html(tipsHtml);
				// sound 插入降赔声音
				sound('jp');
				setTimeout(autoAnimation, 5000);
			}
		}

		// 公告展示
		var adList = d.data.ad;
		var adListLen = adList.length;
		var adHtml = '';
		if(adListLen>0){
			for(var i=0; i<adListLen; i++){
				adHtml += '<a class="masA" href="javascript:;"><span>'+ adList[i]['title'] +'<em>'+ adList[i]['time'] +'</em></span></a>';
			}
		}
		if (newHtml != adHtml) {
			newHtml = adHtml 
			$(".ggBox").html('<marquee id="Affiche" onMouseOver="this.setAttribute(\'scrollamount\', 0, 0);" onMouseOut="this.setAttribute(\'scrollamount\', 2, 0);" direction="left" scrolldelay="4" scrollamount="2" behavior="scroll">'+ adHtml +'</marquee>' );
		}

		// 在线人数
		if (online_type == 'zj') {
		var online = d.data.online_cnt;
		$("#dlonline").html( online.split('|')[0] );
		$("#useronline").html( online.split('|')[1] );
		}
	}


	var callboarTimer = null;

	var callboard = $('#scrollDiv');

	autoAnimation = function (){
		clearTimeout(callboarTimer);
		callboarTimer = null;
		var callboardUl = callboard.find('ul');
		var callboardLi = callboard.find('li');
		var liLen = $('#scrollDiv li').length;
		var initHeight = callboardLi.first().outerHeight(true);
		if (liLen <= 1) return;
		var self = arguments.callee;
		var callboardLiFirst = callboard.find('li').first();
		callboardLiFirst.animate({
			marginTop:-initHeight
		}, 500, function (){
			clearTimeout(callboarTimer);
			callboardLiFirst.appendTo(callboardUl).css({marginTop:0});
			callboarTimer = setTimeout(self, 5000);
		});
	};

	callboard.bind('hover', function (){
		clearTimeout(callboarTimer);
		callboarTimer = null;
	}, function (){
		callboarTimer = setTimeout(autoAnimation, 5000);
	});

	indexRequset();
	adRequset( updateTimeInit );

	$("body").delegate('.masA', 'click', function () {
		$("#webMassage").click();
	});

	// 初始化声音开关
	soundRun($("#soundSwitch"));
	soundRun2($("#soundSwitch2"));

	// 声音开关
	$("#soundSwitch").click(function () {
		soundSwitch = !soundSwitch;
		soundRun($(this));
	});
	// 声音开关
	$("#soundSwitch2").click(function () {
		soundSwitch2 = !soundSwitch2;
		soundRun2($(this));
	});


	function soundRun(obj) {
		if(soundSwitch){
			obj.removeClass().addClass("lbOn");
		}else{
			obj.removeClass().addClass("lbOff");
		}
	}

	function soundRun2(obj) {
		if(soundSwitch2){
			obj.removeClass().addClass("lbOn");
		}else{
			obj.removeClass().addClass("lbOff");
		}
	}
});
