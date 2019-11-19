var myLayerIndex = '19841011';
var ie6 = !-[1,]&&!window.XMLHttpRequest;

define('myLayer',['jquery'],function(require,exports,moudles){
	 return function(jquery){
		 (function($) {
			function mydrag() {
				var oMyLayer = null;
				var oX, oY, wY;
				var dragging = false;
				$("body").delegate('.move', 'mousedown', function(e){  
					e.preventDefault();
					dragging = true;
					oMyLayer = $(this).parents('.myLayer').eq(0);
					oX = e.pageX - oMyLayer.offset().left;
					oY = e.pageY - oMyLayer.offset().top;
				});
				
				$(document).mousemove(function(e){
					if(dragging){
						var offsetX = e.pageX - oX, offsetY = e.pageY - oY;
						e.preventDefault();
						wY = $(window).scrollTop();
						var setRig = $(window).width() - oMyLayer.outerWidth(), setTop = wY;
						offsetX < 0 && (offsetX = 0);
						offsetX > setRig && (offsetX = setRig);
						offsetY < setTop && (offsetY = setTop);
						offsetY > $(window).height() - oMyLayer.outerHeight() + wY && (offsetY = $(window).height() - oMyLayer.outerHeight() + wY);
						
						oMyLayer.css({left: offsetX, top: offsetY});
						
						offsetX = offsetY = setRig = setTop = null;
					}
				}).mouseup(function(){
					try{
						dragging = false;
					}catch(e){
						dragging = false;
					}
				});
			}

			$(function () {
				if (!ie6) {
					mydrag();
				}
			});


			var ua = navigator.userAgent;
			var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				isAndroid = ua.match(/(Android)\s+([\d.]+)/),
				isMobile = isIphone || isAndroid;


			(function (factory) {
				if (typeof define === 'function' && define.amd) {
					define(['jquery'], factory);
				} else if (typeof exports === 'object') {
					factory( require('jquery') );
				} else {
					factory(jQuery);
				}
			}(function ($) {

				/*
				 * [弹窗控件]
				 */
				$.fn.myLayer = function (options) {
					var defaults = {
						title: '提示信息',
						content: '',
						url: '',
						isMiddle: false,
						isShowBtn: true,
						okText: '提交',
						height: '',
						cancelText: '取消',
						isCancelBtn: true,
						okCallBack: function () {},
						openCallBack: function () {},
						closeCallBack: function () {}
					};
					var opts = $.extend({}, defaults, options);
					var _this = $(this);
					var onHtml = '';
					var maskHtml = '';
					var btnHtml = '';
					myLayerIndex++;
					var mli = myLayerIndex;
					$.myLayer.that = _this;
					var titleClass = '';
					var dh = $(document).height();
					$.myLayer.oMyLayerContentWidth = 0;
					$.myLayer.oMyLayerContentHeight = opts.height ? opts.height : 0;
					if($("#myWarp").length == 0){
						$("body").append('<div id="myWarp"></div>');
					}

					$('.myLayer[data-isMiddle=false]').remove();

					if(!opts.isMiddle){
						onHtml = '<div class="myLayerOn"></div>';
						maskHtml = '';
						titleClass = '';
					}else{
						if ($(".myLayerMask").length == 0) {
							// 修正ie6下遮罩不住select
							if (ie6) {
								maskHtml = '<div class="myLayerMask" style="height:'+ dh +'px"></div><iframe class="myLayerMaskIframe" src="" width="100%" height="'+ dh +'" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" frameborder="0"></iframe>';
							}else{
								maskHtml = '<div class="myLayerMask" style="height:'+ dh +'px"></div>';
							}
						}else {
							maskHtml = '';
						}
						titleClass = 'move';
					}

					var btnWrapClass = '';

					if(!opts.isShowBtn){
						btnHtml = '';
						btnWrapClass = 'noPadding';
					}else{
						if (opts.isCancelBtn) {
							btnHtml = '<a href="javascript:;" class="btn grayBtn myLayerCancel" title="'+ opts.cancelText +'">'+ opts.cancelText +'</a>'+
									'<a href="javascript:;" class="btn hotBtn myLayerOk" title="'+ opts.okText +'">'+ opts.okText +'</a>';
						}else{
							btnHtml = '<a href="javascript:;" class="btn hotBtn myLayerOk" title="'+ opts.okText +'">'+ opts.okText +'</a>';
						}
						btnWrapClass = '';
					}
					var _tpl = '';
					if(!opts.url){
						_tpl = '<table data-isMiddle="'+ opts.isMiddle +'" data-index="'+ mli +'" id="myLayer_'+ mli +'" class="myLayer" border="0" cellspacing="0" cellpadding="0"><td>'+
									onHtml +
									'<div class="myLayerTitle '+ titleClass +'">'+
										'<h3>'+ opts.title +'</h3>'+
										'<a href="javascript:;" class="myLayerClose" title="关闭"></a>'+
									'</div>'+
									'<div class="myLayerContent">'+ opts.content +'</div>'+
									'<div class="myLayerFooter '+ btnWrapClass +'">'+
										btnHtml+
									'</div>'+
									'<div class="myLayerLoading"></div>'+
								'</td></table>'+
								maskHtml;
					}else{
						var newUrl = '';
						if (opts.url.indexOf('?') > 0) {
							newUrl = opts.url + '&indexLayer='+ mli;
						}else{
							newUrl = opts.url + '?indexLayer='+ mli;
						}
						_tpl = '<table data-isMiddle="'+ opts.isMiddle +'" data-index="'+ mli +'" id="myLayer_'+ mli +'" class="myLayer" border="0" cellspacing="0" cellpadding="0"><td>'+
									onHtml +
									'<div class="myLayerTitle '+ titleClass +'">'+
										'<h3>'+ opts.title +'</h3>'+
										'<a href="javascript:;" class="myLayerClose" title="关闭"></a>'+
									'</div>'+
									'<div class="myLayerContent"><iframe class="myLayerIframe" id="myLayerIframe_'+ mli +'" name="myLayerIframe_'+ mli +'" src="'+ newUrl +'" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" frameborder="0"></iframe></div>'+
									'<div class="myLayerFooter class="'+ btnWrapClass +'">'+
										btnHtml+
									'</div>'+
									'<div class="myLayerLoading"></div>'+
								'</td></table>'+
								maskHtml;
					}

					var obj = $(_tpl);
					// $('#myLayer').remove();
					$('#myWarp').append( obj );

					var oMyLayer = $('#myLayer_'+ mli);
					var oMyLayerContent = oMyLayer.find(".myLayerContent");
					if(!!opts.url){
						oMyLayer.find(".myLayerLoading").show();
						var oIframe = oMyLayer.find(".myLayerIframe");
						// 修正ie6下不加载iframe
						if (ie6) {
							document.frames('myLayerIframe_'+ mli).location.reload(); 
						}

						oIframe.load(function () {
							oMyLayer.find(".myLayerLoading").hide();
							$.myLayer.isFirst = true;
							$.myLayer.setSize(opts.isMiddle, true, false, myLayerIndex);
							if($(this)[0].contentWindow.fixed){
								$(this)[0].contentWindow.fixed();
							}
						});
					}else{
						$.myLayer.isFirst = true;
					}
					
					$.myLayer.setSize(opts.isMiddle, false, false, myLayerIndex);

					$(window.top).unbind('myScroll');

					if(opts.isMiddle){
						var isIframe = false;
						if(!!opts.url){
							isIframe = true;
						}


						if(!isMobile) {
							$(window.top).bind('scroll',function () {
								if ($('.myLayer').length) {
									$(this).trigger('myScroll');
								}
							});
							$(window.top).bind('myScroll', function () {
								$.myLayer.setSize(opts.isMiddle, isIframe, true, myLayerIndex);
							});
						}
					}

					var topMask = '<div id="iframeTopMask"></div>';

					if(opts.openCallBack){
						opts.openCallBack(obj);
						if(top != self && opts.isMiddle){
							if($("#iframeTopMask", top.document).length == 0){
								$("body", top.document).append(topMask);
							}
						}
					}

					oMyLayer.find(".myLayerCancel, .myLayerClose").unbind('click').bind('click', function (event) {
						$.myLayer.close(true, $(this).parents('.myLayer').eq(0).attr('data-index'));
						opts.closeCallBack(obj);
						if (event.stopPropagation) {
							event.stopPropagation();
						}
						else if (window.event) {
							window.event.cancelBubble = true;
						}
						return false;
					});
					oMyLayer.find(".myLayerFooter").undelegate('.myLayerOk:not(.grayBtn1)', 'click');
					oMyLayer.find(".myLayerFooter").delegate('.myLayerOk:not(.grayBtn1)', 'click', function () {
						opts.okCallBack(obj);
						return false;
					});

					return oMyLayer;
				};

				$.myLayer = {
					that: null,
					isFirst: true,
					oMyLayerContentWidth: 0,
					oMyLayerContentHeight: 0,
					showLoading: function () {
						$("#myLayerLoading").show();
					},
					hideLoading: function () {
						$("#myLayerLoading").hide();
					},
					close: function (b, mli) {
						if(top != self){
							$("#iframeTopMask", top.document).remove();
						}
						if(b && mli == undefined){
							$("#myWarp").html('');
							$("#myWarp", parent.document).html('');
						}
						if (mli && b) {
							if ($('#myLayer_'+ mli).length) {
								$('#myLayer_'+ mli).remove();
							}else{
								$('#myLayer_'+ mli, parent.document).remove('');
							}
						}
						if ($(".myLayer").length == 0) {
							$("#myWarp").html('');
							$("#myWarp", parent.document).html('');
							$(window.top).unbind('myScroll');
							// $(document).unbind('mousemove');
							// $(document).unbind('mouseup');
						}
						var a = myLayerIndex, c = 0;
						$('.myLayer').each(function () {
							c = Number($(this).attr('data-index'));
							if (c > a) {
								c = a;
							}
						});
						myLayerIndex = c;
						$.myLayer.oMyLayerContentHeight = 0;
					},
					setSize:function(isMiddle, isIframe, isMyScroll, mli) {
						var oMyLayer = $('#myLayer_'+ mli);
						var oMyLayerContent = oMyLayer.find(".myLayerContent");
						var wh = $(top).height();
						var dh = $(document).height();
						var _this = $.myLayer.that;
						var th = _this.innerHeight();
						var tw = _this.innerWidth();
						var ch = $.myLayer.oMyLayerContentHeight;

						if(isIframe){
							var oIframe = $("#myLayerIframe_" + mli);
							if (!isMyScroll) {
								oIframe.css({'width': 0,'height': 0});
							}
							var $iframe = oIframe.contents();
							var $iframeBody = $iframe.find('body');
							var oIframeWidth = $iframe.width();
							var oIframeHeight = $iframeBody.height();
							var cw = 0;
							if (ch > oIframeHeight) {
								ch = 0;
							}
							if (!isMyScroll) {
								oIframe.css({
									'width': oIframeWidth,
									'height': oIframeHeight
								});
							}
							// 处理滚动条
							if ($.myLayer.oMyLayerContentHeight) {
								if (oIframeHeight > wh - 200) {
									ch = wh - 200;
								}
								if (ch > $.myLayer.oMyLayerContentHeight) {
									ch = $.myLayer.oMyLayerContentHeight;
								}
								if(oIframeHeight >= ch && ch != 0){
									cw = oIframeWidth + 18;
								}else{
									cw = oIframeWidth;
								}
							}else{
								if(oIframeHeight >= (wh - 200)){
									cw = oIframeWidth + 18;
								}else{
									cw = oIframeWidth;
								}
							}
							// if (!isMyScroll) {
								oMyLayerContent.css({
									'height': ch ? ch : 'auto',
									'width': cw
								});
							// }
						}else{
							if ($.myLayer.isFirst) {
								$.myLayer.oMyLayerContentWidth = oMyLayerContent.outerWidth();
							}
							if(oMyLayerContent.height() >= (wh-200)){
								oMyLayerContent.css({
									'width': $.myLayer.oMyLayerContentWidth
								});
							}else{
								oMyLayerContent.css({
									'width': 'auto'
								});
							}
						}
						if(oMyLayerContent.height() >= (wh-200)){
							oMyLayerContent.css({
								'height': ch ? ch : wh - 200,
								'overflow': 'visible',
								'overflow-y': 'auto'
							});
						}else {
							if (!isMiddle) {
								oMyLayerContent.css({
									'height': ch ? ch : 'auto'
								});
							}else{
								oMyLayerContent.css({
									'height': ch ? ch : 'auto',
									'overflow': 'visible',
									'overflow-y': 'auto'
								});
							}
						}
						var _top, _left, _mTop, _mLeft;

						var oh = oMyLayer.height();
						var ow = oMyLayer.width();
						if(!isMiddle){
							var ot = _this.offset().top;
							if(dh - ot - th <= oh){
								_top = ot + th/2 - oh - 20;
								oMyLayer.addClass('onBottom');
							}else{
								_top = ot + th + 7;
								oMyLayer.removeClass('onBottom');
							}
							_left = _this.offset().left + (tw/2 - 17);
							_mTop = 0;
							_mLeft = 0;
						}else{
							var nowHeight = 0;
							if( dh < wh){
								nowHeight = dh;
							}else{
								nowHeight = wh;
							}
							_top = nowHeight*0.45 + $(top.document).scrollTop();
							_left = parseInt($(window).width()/2);
							if(_top-oh/2<0){
								_mTop = -_top;
							}else{
								_mTop = -oh/2;
							}
							_mLeft = -ow/2;
						}

						if(top != self && isMiddle){
							if((_top - 102) > 0){
								_top = _top - 102;
								if(_top-oh/2<0){
									_mTop = -_top;
								}
							}else{
								_top = 0;
							}
						}

						oMyLayer.css({
							'left': _left + _mLeft,
							'top': _top + _mTop
						}).show();

						if (ie6) {
							oMyLayer.find(".myLayerLoading").css({
								'height': oMyLayer.height()
							});
						}
					
						$.myLayer.isFirst = false;
						
						oMyLayer.find(".myLayerOk").focus();
					}
				};
			}));

		})(jquery);
	};
});

define('skinChange',['jquery'],function(require, exports, module){

	// 引入jQuery模块
	var $ = require('jquery');

	var skinChange = function (attr) {

		var sCssObj = $("#Iframe_skin");

		sCssObj.attr('href', setUrl(sCssObj.attr('href'), attr));

		function setUrl(src, str) {
			var a = src.split("/");
			a[a.length-2] = str;
			return a.join('/');
		}
	};

	// 设置皮肤
	skinChange(top.skinPath);

	module.exports = skinChange;
});
define('tips',['jquery'],function(require, exports, module){

	// 引入jQuery模块
	var $ = require('jquery');



	/*
	 * [提示框 需jQuery]
	 */
	var tips = (function ($) {
		var msgTips = function(options) {
			var defaults = {
				timeOut : 2000,				//提示层显示的时间
				msg : "",					//显示的消息
				speed : 100,				//滑动速度
				type : "success"			//提示类型（1、success 2、error 3、warning）
			};
			var options = $.extend(defaults,options);
			if($("#tip_container").length == 0){
				$("body").prepend('<div id="tip_container" class="container tip_container"><div id="tip" class="mtip"><i class="micon"></i><span id="tsc"></span><i id="mclose" class="mclose"></i></div></div>');
			}else{
				$("#tip_container").slideUp(options.speed);
			}

			var $this = $(this);
			var $tip_container = $("#tip_container");
			var $tip = $("#tip");
			var $tipSpan = $("#tsc");
			var $colse = $("#mclose");
			var that = this;
			//先清楚定时器
			clearTimeout(that.timer);

			
			(function(){
				$tip.attr("class", options.type).addClass("mtip");
				$tipSpan.html(options.msg);
				$tip_container.css({
					'margin-left':  -$tip_container.width()/2,
					'margin-top':  -$tip_container.height()/2
				});
				$tip_container.slideDown(options.speed);
				//提示层隐藏定时器
				that.timer = setTimeout(function (){
					$tip_container.slideUp(options.speed);
				}, options.timeOut);
			})();

			//鼠标移到提示层时清除定时器
			$tip_container.bind("mouseover",function() {
				clearTimeout(that.timer);
			});
			
			//鼠标移出提示层时启动定时器
			$tip_container.bind("mouseout",function() {
				that.timer = setTimeout(function (){
					$tip_container.slideUp(options.speed);
				}, options.timeOut);
			});

			//关闭按钮绑定事件
			$colse.bind("click",function() {
				$tip_container.slideUp(options.speed);
			});
		};

		return {
			msgTips: msgTips
		};
	})(jQuery);




	module.exports = tips;
});

define('getBaseDataAjax',['jquery','tips','json2'],function(require, exports, module) {

	var $ = require('jquery');
	// 引入tips插件
	var tips = require('tips');

	require('json2');

	// 激活consoloe
	getBaseDataAjax.ajaxObj = {};
	var console = console || {log:function(){return false;}};

	/*
	 * [加载基础数据Ajax封装]
	 * paramsname		[type]		description
	 * url				[str]		请求路径
	 * postData			[object]	请求所需必要参数
	 * completeCallBack	[function]	超时回调(status还有success,error等值的情况)
	 * successCallBack	[function]	成功回调
	 * errorCallBack	[function]	错误回调
	 */
	function getBaseDataAjax(params) {
		this.url = params.url;
		this.postData = params.postData;
		this._type = params._type;
		this.dataType = params.dataType;
		this.completeCallBack = params.completeCallBack || function () {};
		this.successCallBack = params.successCallBack || function () {};
		this.portionSuccessCallBack = params.portionSuccessCallBack || function () {};
		this.errorCallBack = params.errorCallBack || function () {};
		this.otherErrorCallBack = params.otherErrorCallBack || function () {};
		this.oddsErrorCallBack = params.oddsErrorCallBack || function () {};
		this.endCallBack = params.endCallBack || function () {};
		this.getBaseDataAjaxHandle();
	}
	getBaseDataAjax.prototype.getBaseDataAjaxHandle = function () {
		var that = this, tip = null, key;

		var mySelf = arguments.callee;

		try{
			that.postData.playpage = top.playpage;
		}catch(error){}
		
		if(top.location != self.location){
			that.postData.playpage = top.GamePage;
		}
		
		if (getBaseDataAjax.ajaxObj.hasOwnProperty(that.postData.action) && (that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad') && getBaseDataAjax.ajaxObj[that.postData.action].readyState != 4 && getBaseDataAjax.ajaxObj[that.postData.action].readyState != undefined) {
			// getBaseDataAjax.ajaxObj[that.postData.action].abort();
		}
		getBaseDataAjax.ajaxObj[that.postData.action] = $.ajax({
			url: that.url,
			data: that.postData,
			type: that._type,
			cache: false,
			dataType: that.dataType,
			timeout: 30000,
			async: true,
			complete: function(XMLHttpRequest, status){
				// if(status == 'timeout' && that.postData.action == 'get_ad'){
				// 	if(typeof that.completeCallBack == "function"){
				// 		that.completeCallBack();
				// 	}else{
				// 		console.log('Plaese add completeCallBack Function for getBaseDataAjaxHandle!');
				// 	}
				// }
				if(status == 'timeout'){
					if(that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad'){
						setTimeout(function () {
							mySelf.call(that);
						}, 5000);
					}
				}
			},
			success: function(data) {
				try{
					if (data.length == "undefined" || data.length != 0) {
						if(that._type == 'GET'){
							that.successCallBack( data );
						}else{
							if(data.data){
								if(data.data.hasOwnProperty('maxidvalid')){
									parent.oldId = data.data.maxidvalid;
								}
								if(data.data.hasOwnProperty('JeuValidate')){
									JeuValidate = data.data.JeuValidate;
								}
							}
							if(typeof that.successCallBack == "function" || typeof that.portionSuccessCallBack == "function" || typeof that.otherErrorCallBack == "function" || typeof that.oddsErrorCallBack == "function" ){
								if (data.success == 200) {
									that.successCallBack( data );
								}else if(data.success == 210){ // 部分成功
									that.portionSuccessCallBack( data );
								}else if(data.success == 100){ // 踢人,冻结,停用
									top.location.href = "/"; // 阿处强烈要求我修改
								}else if(data.success == 150){ // 同一个用户不能同时登录,跳转到指定页面
									top.location.href = data.data.turl.url;
								}else if(data.success == 300){ //300 未登錄
									top.exit();
								}else if(data.success == 400){ //400 其他错误单独处理
									that.otherErrorCallBack( data );
								}else if(data.success == 500){ //500
									that.otherErrorCallBack( data );
								}else if(data.success == 600){ //600 赔率变动
									that.oddsErrorCallBack( data );
								}else if(data.success == 700){
									tip = tips.msgTips({
										msg: data.tipinfo,
										type : "error"
									});
									top.location.href = data.data.turl.url;
								}else if(data.success == 800){
									tip = tips.msgTips({
										msg: data.tipinfo,
										type : "error"
									});
									top.location.href = data.data.turl.url;
								}else if(data.success == 900){
									tip = tips.msgTips({
										msg: data.tipinfo,
										type : "error"
									});
									top.location.href = data.data.turl.url;
								}else{
									tip = tips.msgTips({
										msg: data.tipinfo,
										type : "error"
									});
								}
							}else{
								console.log('Plaese add successCallBack otherErrorCallBack and oddsErrorCallBack Function for getBaseDataAjaxHandle!');
							}
						}
					}else{
						return;
					}
				}catch(error){
					if (top.ajaxErrorLogSwitch) {
						$.ajax({
							url: 'http://'+ window.location.host + '/ViewLog/LogAjaxException.aspx',
							data: {
								'url': that.url,
								'action': JSON.stringify(that.postData),
								'data': JSON.stringify(data),
								'error': error.name + ':' + error.message
							},
							type: 'POST',
							cache: false,
							dataType: 'html',
							timeout: 20000,
							async: true,
							complete: function(XMLHttpRequest, status){},
							success: function() {},
							error: function () {}
						});
					}
				}
			},
			error: function(data) {
				if(typeof that.errorCallBack == "function"){
					that.errorCallBack(data);
				}else{
					console.log('Plaese add errorCallBack Function for getBaseDataAjaxHandle!');
				}
				if(that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad'){
					setTimeout(function () {
						mySelf.call(that);
					}, 5000);
				}
			}
		});

		// return this.obj;
	};

	module.exports = getBaseDataAjax;

});

define('game_global',['jquery','getBaseDataAjax','tips','skinChange','myLayer','jquery'],function(require, exports, module) {
	// 引入排序
	//


    juicer.set({
        'tag::operationOpen': '{@',
        'tag::operationClose': '}',
        'tag::interpolateOpen': '&{',
        'tag::interpolateClose': '}',
        'tag::noneencodeOpen': '&&{',
        'tag::noneencodeClose': '}',
        'tag::commentOpen': '{#',
        'tag::commentClose': '}'
    })
	var textIndex = 0;
	// 上次下单对象
	var lastLmData = [];
	var isLastBtn = false;
	// 引入jquery
	var $ = require('jquery');

	var getBaseDataAjax = require('getBaseDataAjax');

	var tips = require('tips');

	var skinChange = require('skinChange');
	
	require('myLayer')($);

	// var console = console || {log:function(){return false;}};
	var requestTimer = null;
	// 获取parent.window
	var p = window.parent;
	var aTimer = null;
	var bTimer = null;
	var xTipsTimer = null;
	var isDt = false;
	var isDtType = false;

	var isAbort = false;
	var pageObj = null;
	//数组功能扩展
	Array.prototype.arrEach = function(fn){
		fn = fn || Function.K;
		var a = [];
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < this.length; i++){
			var res = fn.apply(this,[this[i],i].concat(args));
			if(res != null) a.push(res);
		}
		return a;
	};
	//数组是否包含指定元素
	Array.prototype.contains = function(suArr){
		for(var i = 0; i < this.length; i ++){
			if(this[i] == suArr){
				return true;
			}
		}
		return false;
	};
	//不重复元素构成的数组
	Array.prototype.uniquelize = function(){
		var ra = new Array();
		for(var i = 0; i < this.length; i ++){
			if(!ra.contains(this[i])){
				ra.push(this[i]);
			}
		}
		return ra;
	};
	//两个数组的补集  Array.complement(a, b)
	Array.complement = function(a, b){
		return Array.minus(Array.union(a, b),Array.intersect(a, b));
	};
	//两个数组的交集  Array.intersect(a, b)
	Array.intersect = function(a, b){
		return a.uniquelize().arrEach(function(o){return b.contains(o) ? o : null});
	};
	//两个数组的差集  Array.minus(a, b)
	Array.minus = function(a, b){
		return a.uniquelize().arrEach(function(o){return b.contains(o) ? null : o});
	};
	//两个数组并集  Array.union(a, b)
	Array.union = function(a, b){
		return a.concat(b).uniquelize();
	};


	var quickSort = function(arr) {
	　　if (arr.length <= 1) { return arr; }
	　　var pivotIndex = Math.floor(arr.length / 2);
	　　var pivot = arr.splice(pivotIndex, 1)[0];
	　　var left = [];
	　　var right = [];
	　　for (var i = 0; i < arr.length; i++){
		if (arr[i] < pivot) {
		　　left.push(arr[i]);
		} else {
		　　right.push(arr[i]);
		}
	　　}
	　　return quickSort(left).concat([pivot], quickSort(right));
	};


	function ForDight(Dight){
		Dight = Math.round(Dight*Math.pow(10,1))/Math.pow(10,1);
		return Dight;
	}

	function ForDight2(Dight){
		Dight = Math.round(Dight*Math.pow(10,2))/Math.pow(10,2);
		return Dight;
	}
	function ForDight4(Dight){
		Dight = Math.round(Dight*Math.pow(10,4))/Math.pow(10,4);
		return Dight;
	}
	// 判斷對象是否為空
	function objIsEmpty(obj) {
		var isEmpty = true;
		if (typeof obj === "object" && !(obj instanceof Array)){
			var hasProp = false;
			for (var prop in obj){
				hasProp = true;
				break;
			}
			if (hasProp){
				obj = [obj];
				isEmpty = false;
			}else{
				isEmpty = true;
			}
		}
		return isEmpty;
	}
	// 只允许输入数字
	function onlyNumber(ev) {
		var code = ev.keyCode || ev.which;
		if((ev.ctrlKey && code == 97) || (ev.ctrlKey && code == 65)){  // Ctrl+A
			return true;
		}else if((ev.ctrlKey && code == 120) || (ev.ctrlKey && code == 88)){ // Ctrl+X
			return true;
		}else if((ev.ctrlKey && code == 99) || (ev.ctrlKey && code == 67)){ // Ctrl+C
			return true;
		}else if((ev.ctrlKey && code == 122) || (ev.ctrlKey && code == 90)){ // Ctrl+Z
			return true;
		}else if((ev.ctrlKey && code == 118) || (ev.ctrlKey && code == 86) || (ev.shiftKey && code == 45)){ // Ctrl+V, Shift+Ins
			return true;
		}else if( (code >= 48 && code <= 57) ) { // number (keypress no smallKey)
			return true;
		}else if( code == 8 || code == 9 || code == 37 || code == 39 ){ //backspace, tab, left, right
			return true;
		}else if( code == 13 ){ // enter
			return true;
		}else if( code == 46 ){ // del(.)
			return true;
		}else{
			if (ev && ev.preventDefault)
				ev.preventDefault(); //阻止默认浏览器动作(W3C)
			else
				window.event.returnValue = false; //IE中阻止函数器默认动作的方式
			return false;
		}
	}
	// 校验
	function checkNumber (ev, isDecimal) {
		var v = ev.target.value;
		v = v.replace(/\s/g,"");
		var dot = $.inArray('.', v.split(''));
		var length = v.length;
		if(v && length>0){
			if(isDecimal){
				if(dot === 0){
					v = '0' + v;
				}else{
					for(var i = length - 1; i >= 0; i--){
						var ch = v.charAt(i);
						var validChar = false;
						var validChars = [0,1,2,3,4,5,6,7,8,9,'.'];
						for(var j = 0; j < validChars.length; j++){
							if(ch == validChars[j]){
								validChar = true;
								break;
							}
						}
						if(!validChar || ch == " "){
							v = v.substring(0, i) + v.substring(i + 1);
						}
						var firstDecimal = $.inArray('.', v.split(''));
						if(firstDecimal > 0){
							for(var k = length - 1; k > firstDecimal; k--){
								var chch = v.charAt(k);
								if(chch == '.'){
									v = v.substring(0, k) + v.substring(k + 1);
								}
							}
						}
					}
				}
			}else{
				for(var i = length - 1; i >= 0; i--){
					var ch = v.charAt(i);
					var validChar = false;
					var validChars = [0,1,2,3,4,5,6,7,8,9];
					for(var j = 0; j < validChars.length; j++){
						if(ch == validChars[j]){
							validChar = true;
							break;
						}
					}
					if(!validChar || ch == " "){
						v = v.substring(0, i) + v.substring(i + 1);
					}
				}
			}
		}
		ev.target.value = v;
	}

	/*
	 * 会员端
	 */
	var subInit = {
		// 第一次加载
		isFirst: 0,
		// 游戏页面缓存兑现
		gamePage: {},
		// 游戏页面Loading对象
		gameLoadingObj: function () {
			return $(".game_loading_wrap").eq(0);
		},
		// 游戏页面BOX对象
		gameBoxObj: function () {
			return $("#gameBox");
		},
		// 页面文件名称
		playPage: '',
		// 赔率缓存对象
		oddsData: {},
		// 下单缓存对象
		orderData: {},
		// 下單輸入框緩存對象
		orderInputData: {},
		// 連碼菜單索引緩存
		lmIndex: 0,
		// 連碼active數據緩存
		lmActiveData: {},
		// 連碼胆拖數據緩存
		lmDtData: {},
		// 连码笔数缓存
		lmGroup: 0,
		// 是否开放下单
		isOpenOddr: {},
		// 控制回车下单速度
		isEnterSubmit: true,
		// 初始化
		_init: function () {
			var _this = this;
			// 初始化提交按钮
			$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
			// 设置皮肤
			// skinChange(parent.skinPath);
			// 加载开奖号码
			closedMarket.openball();
			// 给body增加球的样式
			$("body").removeClass().addClass( p.GamePath );
			// 设置当前彩种LOGO 从顶层获取
			$("#game_logo").attr('src', p.LogoSrc);
			// 设置当前彩种Name 从顶层获取
			$("#game_big_name").html( p.GameName );
			// 设置当前玩法Name 从当前彩种index获取
			$("#game_small_name").html( GameSmallName );
			// 点击彩种下第一个玩法
			_this.menuHuHandler( p.PlayPageIndex );
			// 控制历史开奖
			_this.addHistoryEvent();
			// 绑定tab
			_this.tabChange();
			// 獲取近期下注
			_this.putinfo();
			// 激活工具條
			_this.toolYs();
			// 只能输入数字
			var oBody = $("body");
			oBody.undelegate('.onlyNum');
			oBody.delegate('.onlyNum', 'keypress', function (e) {
				onlyNumber(e);
			});
			oBody.delegate('.onlyNum', 'input', function (e) {
				checkNumber(e, false);
			});
			// 绑定回车事件
			oBody.unbind('keydown').bind('keydown', function (ev) {
				var code = ev.keyCode || ev.which;
				if(code == 13){
					var myLayerOk = $('#myLayer_'+ myLayerIndex).find(".myLayerOk");
					if ($('#myLayer_'+ myLayerIndex).find('.myLayerLoading').is(':visible')) {
						return;
					}
					if (!_this.isEnterSubmit) {
						return;
					}
					if(myLayerOk.length>0){
						_this.isEnterSubmit = false;
						if (document.activeElement.id != 'myLayerOk') {
							myLayerOk.click();
						}
					}else{
						$("#gameSubmit").focus().click();
					}
				}
			});

			$("#gameBox").delegate('.lineHover li', 'mouseover', function () {
				var i = $(this).index();
				$(".lineHover").each(function () {
					$(this).find('li').eq(i).addClass('lineActive');
				});
			});

			$("#gameBox").delegate('.lineHover li', 'mouseout', function () {
				var i = $(this).index();
				$(".lineHover").each(function () {
					$(this).find('li').eq(i).removeClass('lineActive');
				});
			});


			
			if ($("#lastSubmit").length == 0) {
				$("#clearBtn").before('<input id="lastSubmit" style="display:none" class="btn grayBtn" type="button" value="重復上次下單">');
			}
			

			p.isReady = true;

		},
		// 清空缓存数据
		clearData: function () {
			var _this = this;
			$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
			_this.oddsData = {};
			_this.isFirst = 0;
			$("#myWarp").html('');
			_this.lmDtData = {};
			_this.lmActiveData = {};
			_this.orderInputData = {};
			_this.lmIndex = 0;
			isDt = false;
		},
		nowPageId: '',
		// 绑定菜单事件
		menuHuHandler: function (i) {
			var _this = this;
			$(".subBtn").unbind('click').bind('click', function () {
				var that = $(this);
				// 更新索引
				p.PlayPageIndex = that.index();
				// 清空数据
				_this.clearData();

				// 清空上一次缓存
				isLastBtn = false;

				$(".subBtn").removeClass('active').eq(that.index()).addClass('active');
			    // 修改当前玩法Name
				$("#game_small_name").html( that.text() );
				// 缓存页面文件名称
				_this.playpage = that.attr('data-id');
				top.GamePage = _this.playpage;
				// 恢复六合彩radioIndex
				sixBet.radioIndex = 0;
				sixBet.radioLxIndex = 0;
				_this.gameLoadingObj().show();
				_this.gameBoxObj().hide();
				_this.nowPageId = that.attr('data-id');
					// 加载页面
					_this.gamePageDom();
					// 两面
					_this.rankList();
			}).eq(i).click();

			// 綁定六合彩
			var gameBox = $("#gameBox");
			gameBox.undelegate('.sixBtn', 'click');
			gameBox.delegate('.sixBtn', 'click', function () {
				var that = $(this);
				// 清空数据
				_this.clearData();
				// 清空上一次缓存
				isLastBtn = false;
				// 修改当前玩法Name
				// $("#game_small_name").html( that.find('h3').html() );
				_this.gameLoadingObj().show();
				_this.gameBoxObj().hide();
				// 缓存页面文件名称
				_this.playpage = that.attr('data-id');
				top.GamePage = _this.playpage;
				// 加载页面
				_this.gamePageDom();
			});
			// 当出现问题手动回执
			$("#game_reload").unbind('click').bind('click', function () {
				_this.playpage = $(".subBtn.active").attr('data-id');
				_this.clearData();
				// 清空上一次缓存
				isLastBtn = false;
				_this.gamePage = {};
				top.GamePage = _this.playpage;
				if (getBaseDataAjax.ajaxObj != 'undefined') {
					if (getBaseDataAjax.ajaxObj.hasOwnProperty('get_oddsinfo')) {
						getBaseDataAjax.ajaxObj['get_oddsinfo'].abort();
					}
				}
				_this.gamePageDom();
			});
		},
		ajaxobj: {},
		// 加载游戏页面
		gamePageDom: function () {
			var _this = this;
			if (_this.ajaxobj.readyState != 4 && _this.ajaxobj.readyState != undefined) {
				_this.ajaxobj.abort();
			}
			// if(!_this.gamePage.hasOwnProperty( _this.playpage )){
				_this.ajaxobj = $.ajax({
					url: root + '/html/' +  _this.playpage  + '.html',
					type: 'GET',
					cache: true,
					dataType: "html",
					timeout: 5000,
					async: true,
					complete: function(XMLHttpRequest, status){},
					success: function(d) {
						if (this.url.indexOf(_this.playpage) != -1) {
							// 缓存当前页面
							// _this.playpage = this.url.split('/')[1].split('.')[0];
							// top.GamePage = _this.playpage;
							// _this.gamePage[ _this.playpage ] = d;
							_this.gameBoxObj().html($(d));
							// 加载生肖
							_this.domZodiacBox();
							// 加载赔率接口
							_this.oddsLoadAjax();
							// 开始倒计时
							_this.updateFun(_this.updateTimeInit());
						}
					},
					error: function(data) {}
				});

			// }else{
			// 	_this.gameBoxObj().html( _this.gamePage[ _this.playpage ] );
			// 	// 加载生肖
			// 	_this.domZodiacBox();
			// 	// 加载赔率接口
			// 	_this.oddsLoadAjax();
			// 	// 开始倒计时
			// 	_this.updateFun(_this.updateTimeInit());
			// }

		},
		domZodiacBox: function () {
			var _this = this;
			if (_this.playpage == 'six_sxws' || _this.playpage == 'six_sxws_bz' || _this.playpage == 'six_tmsx') {
				$(".zodiacBox").each(function () {
					var that = $(this);
					that.html(p.zDataHtml[that.attr('data-index')]);
				});
			}
		},
		// 渲染奖期:
		baseDomHandler: function (d) {},
		updateTimeInit: function () {
			var _this = this;
			var num = 45;
			if (_this.playpage == 'six_lm' || _this.playpage == 'six_lm_b' || _this.playpage == 'six_bz' || _this.playpage == 'six_lx' || _this.playpage == 'six_ws' || _this.playpage == 'kl10_lm' || _this.playpage == 'pcdd_lm' || _this.playpage == 'xync_lm' || _this.playpage == 'jssfc_lm') {
				num = 180;
			}
			return num;
		},
		// 执行倒计时
		updateFun: function (num) {
			var _this = this;
			var obj = $("#updateTime");
			aTimer ? clearTimeout(aTimer) : aTimer = null;
			if(--num){
				aTimer = setTimeout(function () {
					// 开始递归
					_this.updateFun(num);
				}, 1000);
			}else{
				// 加载赔率接口
				_this.oddsLoadAjax();
			}
			// 显示当前时间
			num ? obj.html( num + '\u79d2' ) : obj.html('...');
		},
		// 加载赔率接口
		oddsLoadAjax: function () {
			var _this = this;
			var b = new getBaseDataAjax({
				url: root + '/handler/handler.html',
				_type: 'POST',
				dataType: 'json',
				postData: optionsData('odds'),
				completeCallBack:function () {},
				successCallBack:function (d) {
					// 重新启动倒计时
					_this.updateFun( _this.updateTimeInit() );
					
					if (_this.playpage == d.data.playpage) {
						if (d.data.hasOwnProperty('credit')) {
							// 额度，index处理
							top.setCredit(d.data.credit, d.data.usable_credit);
							// p.indexInit.usableCreditData['game_'+p.currTypeId]['credit'] = d.data.credit;
							// p.indexInit.usableCreditData['game_'+p.currTypeId]['usable_credit'] = d.data.usable_credit;
							// p.indexInit.setCredit(p.currTypeId);
						}
						// 处理封盘
						if(d.data['isopen'] == '0'){
							$.myLayer.close(true);
							location.replace('/noopen.aspx?lid='+p.nowMenuId+'&path='+p.GamePath);
							return;
						}
						// 开封盘初始化
						closedMarket._init( d.data );

						// 渲染基础数据
						// _this.baseDomHandler( d.data );
						// 渲染赔率
						if (_this.playpage == 'kl10_lm' || _this.playpage == 'pcdd_lm' || _this.playpage == 'xync_lm' || _this.playpage == 'jssfc_lm' || _this.playpage == 'six_bz') {
							$("#lastSubmit").hide();
							// 快樂十分連碼，幸运农场连码，六合彩不中统一处理
							_this.oddsDomLmHandler( d.data );
						}else if(_this.playpage == 'six_lm' || _this.playpage == 'six_lm_b'){
							$("#lastSubmit").hide();
							if(isShowLM_B == '1'){
								$(".six_lm_tab").show();
							}else{
								$(".six_lm_tab").hide();
							}
							// 六合彩连码
							sixBet.oddsDomSixLmHandler( d.data );
						}else if(_this.playpage == 'six_lx' || _this.playpage == 'six_ws'){
							$("#lastSubmit").hide();
							// 六合彩六肖/生肖連/尾數連
							sixBet.oddsDomSixLxHandler( d.data );
						}else{
							$("#lastSubmit").show();
							// DOM赔率
							_this.oddsDomHandler( d.data );
						}

						if(p.GamePath == 'L_SIX'){
							// 加载快捷菜单
							if(_this.playpage == 'six_tm_a' || _this.playpage == 'six_tm_b' || _this.playpage == 'six_zmt_1' || _this.playpage == 'six_zmt_2' || _this.playpage == 'six_zmt_3' || _this.playpage == 'six_zmt_4' || _this.playpage == 'six_zmt_5' || _this.playpage == 'six_zmt_6'){
								sixBet.shortCut();
							}
						}
					}
				},
				errorCallBack:function () {}
			});
		},
		// 赔率DOM函数
		oddsDomHandler: function (d) {
			var _this = this;
			var playOdds = d.play_odds;
			var playHtml = '';
			var oddsHtml = '';
			var inputHtml = '';
			var ballName = '';
			var oLi = null;
			for(var key in playOdds){
				playHtml = '';
				oddsHtml = '';
				inputHtml = '';
				ballName = '';
				oLi = $("#g_" + key);
				// 如果赔率缓存中与当前赔率不一致DOM新赔率
				if( !_this.oddsData.hasOwnProperty( key ) ){
					if( playOdds[ key ]['pl'] == '-' ){
						oddsHtml = '<a id="odds_'+ key +'" class="" href="javascript:;">-</a>';
						inputHtml= '-';
						if(_this.orderInputData.hasOwnProperty( key )){
							delete _this.orderInputData[ key ];
						}
					}else{
						oddsHtml = '<a id="odds_'+ key +'" class="oddsEvent" title="點擊下注" href="javascript:;">'+ playOdds[ key ]['pl'] +'</a>';
						inputHtml= '<input data-id="'+ key +'" class="input onlyNum orderInput" type="text">';
					}
					if( !isNaN(Number(oLi.attr('data-name'))) && !oLi.attr('data-text') ){
						var numberBall = '';
						// alert(p.GamePath != 'L_CQSC') 
						if (p.GamePath != 'L_CQSC' && p.GamePath != 'L_K8SC' && p.GamePath != 'L_PCDD' && p.GamePath != 'L_K3' && p.GamePath != 'L_XJSC' && p.GamePath != 'L_TJSC' && p.GamePath != 'L_SPEED5' && p.GamePath != 'L_JSCQSC' && p.GamePath != 'L_SSC168' && p.GamePath != 'L_VRSSC') {
							numberBall = (Number(oLi.attr('data-name'))<10?'0'+Number(oLi.attr('data-name')):Number(oLi.attr('data-name')));
						}else{
							numberBall = Number(oLi.attr('data-name'));
						}
						ballName = '<span class="name '+ 'No_' + numberBall +'"></span>';

					}else{
						var dataName = oLi.attr('data-name');
						if(!!oLi.attr('data-text')){
							ballName = '<span class="name bf_14">' +
											dataName +
										'</span>';
						}else if(!!oLi.attr('data-dup')){
							var cName = dataName.match(/\((\S*)\)/)[1].split('');
							var cNameHtml = '';
							for(var i=0;i<cName.length;i++){
								cNameHtml+='<span class="No_' + cName[i] +'"></span>';
							}
							ballName = '<span class="name bf_14">' +
											cNameHtml+
										'</span>';
						}else{
							ballName = '<span class="name">' +
											dataName +
										'</span>';
						}
					}
					playHtml += ballName +
								'<span class="p">'+
									oddsHtml +
								'</span>'+
								'<span id="inw_'+ key +'" class="in">'+
									inputHtml +
								'</span>';
					oLi.html( playHtml );
				}else{
					// 当赔率缓存数据与赔率接口数据不一样时
					if(_this.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
						// 只替换赔率值
						var oddsObj = $('#odds_' + key);
						var inputWrapObj = $('#inw_' + key);
						if( playOdds[key]['pl'] == '-' ){
							oddsObj.removeClass('oddsEvent');
							inputWrapObj.html('-');
							if(_this.orderInputData.hasOwnProperty( key )){
								delete _this.orderInputData[ key ];
							}
						}else{
							oddsObj.addClass('oddsEvent');
							var inputValue = '';
							if(_this.orderInputData.hasOwnProperty( key )){
								inputValue = _this.orderInputData[ key ];
							}else{
								inputValue = '';
							}
							inputWrapObj.html('<input data-id="'+ key +'" value="'+ inputValue +'" class="input onlyNum orderInput" type="text">');
						}
						oddsObj.html( playOdds[ key ]['pl'] );
					}
				}
				// 缓存每个赔率对象
				_this.oddsData[ key ] = playOdds[ key ];
			}
			// 赔率加载完成后事件
			_this.oddsLoadEndHander();
			// 绑定赔率点击事件
			var gameBox = $("#gameBox");

			gameBox.undelegate('.oddsEvent', 'click');
			gameBox.delegate('.oddsEvent', 'click', function () {
				$(this).oddsLayer();
			});
			// 綁定工具欄事件
			gameBox.undelegate('.orderInput', 'click');
			gameBox.delegate('.orderInput', 'click', function () {
				var tVal = $("#tool_ys_input").val();
				var that = $(this);
				if(tVal && $(this).val()==''){
					$(this).val( $("#tool_ys_input").val() );
					setSubmit(that);
				}
			});
			$('.orderInput').unbind('input propertychange');
			$('.orderInput').bind('input propertychange', function () {
				var that = $(this);
				setSubmit(that);
			});
			// gameBox.undelegate('.orderInput', 'keyup');
			// gameBox.delegate('.orderInput', 'keyup', function () {
			// 	var that = $(this);
			// 	setSubmit(that);
			// });
			function setSubmit(obj) {
				var isOk = 1;
				if(obj.val()){
					_this.orderInputData[ obj.attr('data-id') ] = obj.val();
				}else{
					delete _this.orderInputData[ obj.attr('data-id') ];
					// delete top.lastData[top.GamePage][ obj.attr('data-id') ];
				}
				if (objIsEmpty(_this.orderInputData)) {
					isOk = 0;
				}
				if (objIsEmpty(top.lastData[top.GamePage])) {
					isLastBtn = false;
				}
				isSubmitOk(isOk);
			}
			// 綁定普通下單清空按鈕事件
			// clearBtn
			$("#clearBtn").unbind('click').bind('click', function () {
				$(".orderInput").val('');
				isLastBtn = false;
				_this.orderInputData = {};
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
			});
			var game_box_tool = $(".game_box_tool");
			// 綁定普通下單提交按鈕事件
			game_box_tool.undelegate('#gameSubmit:not(.disSubmit)', 'click');
			game_box_tool.delegate('#gameSubmit:not(.disSubmit)', 'click', function () {
				// 判斷下單對象是否為空
				if(!objIsEmpty(_this.orderInputData) || !objIsEmpty(top.lastData[top.GamePage])){
					// 不為空打開并設置提交窗口
					$(this).orderSubmitLayer();
				}
				// }else{
				// 	// 否則彈出錯誤提示
				// 	var tip = tips.msgTips({
				// 		msg: '至少投注一項！',
				// 		type : "error"
				// 	});
				// }
			});

			game_box_tool.undelegate('#lastSubmit:not(.disSubmit)', 'click');
			game_box_tool.delegate('#lastSubmit:not(.disSubmit)', 'click', function () {
				isLastBtn = true;
				// 判斷下單對象是否為空
				if(!objIsEmpty(top.lastData[top.GamePage])){
					_this.orderInputData = jQuery.extend(true, _this.orderInputData, top.lastData[top.GamePage]);
					for(var key in top.lastData[top.GamePage]){
						$("input[data-id="+ key +"]").val(top.lastData[top.GamePage][key]);
					}
					$("#gameSubmit").removeAttr('disabled').removeClass('disSubmit');
				}else{
					var tip = tips.msgTips({
						msg: '對不起，未能記錄您上次投註',
						type : "error"
					});
				}
			});

		},
		// 连码单注最小值
		lmMin: 0,
		// 连码单注最大值
		lmMax: 0,
		// 连码最大下注金额
		lmTopMax: 0,
		// 连码单期
		lmDq: 0,
		// 连码单号
		lmDh: 0,
		// 连码名称
		lmTitle: '',
		// 连码赔率
		lmOdds: '',
		// 连码赔率函数
		oddsDomLmHandler: function (d) {
			var _this = this;
			var playOdds = d.play_odds;
			for(var key in playOdds){
				var lmBtn = $("#lm_" + key);
				var lmBtnOdds = lmBtn.find('h4');
				// 如果赔率缓存中与当前赔率不一致DOM新赔率
				if( !_this.oddsData.hasOwnProperty( key ) ){
					lmBtnOdds.html( playOdds[key]['pl'] );
				}else{
					// 当赔率缓存数据与赔率接口数据不一样时
					if(_this.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
						lmBtnOdds.html( playOdds[key]['pl'] );
					}
				}
				// 缓存每个赔率对象
				_this.oddsData[ key ] = playOdds[ key ];
			}

			// 绑定连码Btn事件
			var gameLmTitle = $("#gameLmTitle>li");
			if(p.GamePath == 'L_SIX'){
				gameLmTitle = $("#gameSixLmTitle>li")
			}
			var gameLmBox = $("#gameLmBox>dd");
			var firstBid = gameLmTitle.eq(_this.lmIndex).attr('data-bid');
			var firstWrap = gameLmBox.eq(_this.lmIndex);
			var firstIspl = gameLmTitle.eq(_this.lmIndex).attr('data-ispl');
			var firstName = gameLmTitle.attr('data-name');
			// 初始化赔率列表
			_this.lmBoxDom(firstWrap, firstBid, firstIspl, firstName);
			// 绑定连码按钮点击事件
			gameLmTitle.unbind('click').bind('click', function () {
				_this.lmIndex = $(this).index();
				// 禁用提交按钮
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				
				var bid = $(this).attr('data-bid');
				var hasPl = $(this).attr('data-ispl');
				gameLmTitle.removeClass('active').eq(_this.lmIndex).addClass('active');
				gameLmBox.removeClass('active').eq(_this.lmIndex).addClass('active');
				// 清空checkbox数据
				_this.lmGroup = 0;
				_this.lmActiveData = {};
				_this.lmDtData = {};
				isDt = false;
				_this.lmBoxDom(gameLmBox.eq(_this.lmIndex), bid, hasPl, $(this).attr('data-name'));
			});
			// 赔率加载完成后事件
			_this.oddsLoadEndHander();
		},
		// 渲染连码BOX wrap:连码BOX对象 bid:大ID hasPl:是否显示赔率
		lmBoxDom: function(wrap, bid, hasPl, title) {
			var _this = this;
			var aLi = wrap.find('li');
			var html = '';
			var aLiLen = aLi.length;
			var oLi = null;
			_this.lmMin = ForDight(_this.oddsData[bid]['min_amount']);
			_this.lmMax = ForDight(_this.oddsData[bid]['max_amount']);
			_this.lmTopMax = ForDight(_this.oddsData[bid]['top_amount']);
			_this.lmDq = ForDight(_this.oddsData[bid]['dq_max_amount']);
			_this.lmDh = ForDight(_this.oddsData[bid]['dh_max_amount']);
			_this.lmTitle = title;
			_this.lmOdds = _this.oddsData[bid]['pl'];
			// 开始渲染
			var thatOddsData = {};
			var nPl = '';
			var radioClass = '';
			var NoClass = '';
			var NoId = '';

			// 针对pc蛋蛋 特殊处理
			var ii = 1;
			if(_this.playpage == 'pcdd_lm'){
				ii = 0;
				aLiLen = aLiLen - 1;
			}

			for(var i = ii; i <= aLiLen; i++) {
				oLi = $("#lm_"+ bid.split('_')[0] + '_' +i);
				// 获取缓存对象
				thatOddsData = _this.oddsData[bid];
				// 新赔率等于 基础赔率 + 微调值
				nPl = '0';
				radioClass = '';
				if(_this.playpage == 'pcdd_lm'){
					NoClass = Number(oLi.attr('data-name'));
				}else{
					NoClass = (Number(oLi.attr('data-name'))<10?'0'+Number(oLi.attr('data-name')):Number(oLi.attr('data-name')));
				}
				NoId = oLi.attr("data-bid");
				if(thatOddsData['pl'] == '-'){
					nPl = '-';
					_this.isOpenOddr[bid] = false;
				}else{
					_this.isOpenOddr[bid] = true;
					nPl = ForDight2(Number(thatOddsData['pl']) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1])));
				}
				if(thatOddsData['pl'] == '-'){
					radioClass = 'radiodsable';
				}else if(_this.lmActiveData[NoId] && !radioClass){
					radioClass = 'radioPoint';
				}else if(_this.lmActiveData[NoId] == false && !radioClass){
					radioClass = 'radiodsable';
				}else{
					radioClass = '';
				}

				if(hasPl == '1'){
					html = '<span class="name '+ 'No_' + NoClass +'"></span>'+
							'<span class="p"><a href="javascript:;">' + nPl + '</a></span>'+
							'<span class="in"><a data-id="'+ NoId +'" href="javascript:;" class="radioSim '+ radioClass +'"></a></span>';
				}else{
					html ='<span class="name '+ 'No_' + NoClass +'"></span>'+
							'<span class="in"><a data-id="'+ NoId +'" href="javascript:;" class="radioSim '+ radioClass +'"></a></span>';
				}
				oLi.html( html );
			}

			// 绑定radio事件
			lmCheckBoxFun();

			// 赔率加载完成后事件
			_this.oddsLoadEndHander();

			// 綁定连码下單提交按鈕事件
			bindLmOrderHandle( bid );
		},
		// 赔率加载完成后事件
		oddsLoadEndHander: function () {
			var _this = this;
			// 将第一次DOM好的模板缓存
			// _this.gamePage[ _this.playpage ] = _this.gameBoxObj().html();
			// 隐藏游戏页面Loading对象
			_this.gameLoadingObj().hide();
			// 显示玩法页面
			_this.gameBoxObj().show();
			// 不执行回零操作
			if(_this.isFirst){
				p.isScroll = false;
			}else{
				p.isScroll = true;
			}
			// 重设Iframe高度
			top.setHeight();
			// 每加载一次递增
			_this.isFirst++;
		},
		// 页面滚动
		pageScrollTop: function (sTop){
			var _this = this;
			var obj = $(".top_info");
			if(sTop >= 91){
				obj.addClass("sticky_top").css({
					'top': sTop - 91
				});
			}else{
				obj.removeClass("sticky_top").css({'top': 0});
			}
		},
		// 历史开奖
		addHistoryEvent: function (btn, wrap) {
			var isHistoryShow = false;
			var _this = this;
			var oBtn = $('.look_history_btn');
			var oWrap = $('.history_wrap');
			oBtn.unbind('click').bind('click', function () {
				var t = $(this);
				var objH = parseInt( oWrap.find('table').height() );
				if( !isHistoryShow ){
					oWrap.animate({"height" : objH}, 150, function () {
						top.setHeight();
					});
					isHistoryShow = true;
					t.addClass("active").html("\u5173\u95ed\u8fd1\u671f\u958b\u734e");

				}else{
					oWrap.animate({"height" : "0"}, 150, function () {
						top.setHeight();
					});
					isHistoryShow = false;
					t.removeClass("active").html("\u67e5\u770b\u8fd1\u671f\u958b\u734e");
				}
			});
		},
		// 获取杂项数据
		rankList: function () {
			var _this = this;
			var b = new getBaseDataAjax({
				url: root + '/handler/handler.html',
				_type: 'POST',
				dataType: 'json',
				postData: {
					action: 'get_ranklist'
				},
				completeCallBack:function () {},
				successCallBack:function (d) {
					if (_this.playpage == d.data.playpage) {
						// 处理封盘
						_this.rankListHandlers(d.data);
					}
				},
				errorCallBack:function () {}
			});
		},
		// 渲染其他杂项
		rankListHandlers: function (d) {
			var _this = this;
			// 六合彩近期开奖生肖转换
			// if(p.GamePath == 'L_SIX'){
			// 	var zm = [];
			// 	var tm = '';
			// 	var zmAttr = [];
			// 	var tmStr = '';
			// 	for(var i=0; i<d.jqkj.length; i++){
			// 		zm = d.jqkj[i].total[0].split(',');
			// 		tm = d.jqkj[i].total[1];
			// 		zmAttr = [];
			// 		tmStr = p.returnAnimal(p.zodiacData[Number(tm)]);
			// 		for(var j=0; j<zm.length; j++){
			// 			zmAttr.push(p.returnAnimal(p.zodiacData[Number(zm[j])]));
			// 		}
			// 		d.jqkj[i].total[0] = zmAttr.join('、');
			// 		d.jqkj[i].total[1] = tmStr;
			// 	}
			// }
			// 近期开奖
			if(d.jqkj){
				var jqkjHtml = juicer($("#tpl_history").html(), d);
				$("#historyResult").html(jqkjHtml);
			}
			var tab_btn = $(".rightBox .tab_btn");
			var tab_item = $(".rightBox .tab_item");
			// 两面长龙
			if(d.lmcl){
				var lmclHtml = juicer($("#tpl_lmcl").html(), d);
				$("#lmResult").html(lmclHtml);
				tab_btn.eq(0).click();
			}else{
				tab_btn.eq(1).addClass('active');
				tab_item.eq(1).addClass('active');
				tab_btn.eq(0).removeClass('active').hide();
				tab_item.eq(0).removeClass('active').hide();
			}
			// 出球率
			var cqlResult = $("#cqlResult");
			if(d.cql && d.cql.hasOwnProperty('title')){
				var cqlHtml = juicer($("#tpl_cql").html(), d);
				cqlResult.html(cqlHtml).addClass('active').show();
			}else{
				cqlResult.removeClass('active').hide();
			}
			// 冷热遗漏
			var lrylResult = $("#lrylResult");
			var hot_Cool = $(".hot_Cool");
			if(d.lryl){
				var lrylHtml = juicer($("#tpl_lryl").html(), d);
				lrylResult.html(lrylHtml).addClass('active');
				hot_Cool.show();
			}else{
				hot_Cool.hide();
				lrylResult.removeClass('active');
			}

			top.setHeight(false);
		},
		// 全局 选项卡 绑定事件
		tabChange: function () {
			var _this = this;
			$(document).delegate(".tab_box .tab_btn", 'click', function () {
				var t = $(this), i = t.index(), box = $(this).parents('.tab_box');
				box.find(".tab_item").removeClass("active").eq(i).addClass("active");
				box.find(".tab_btn").removeClass("active");
				t.addClass("active");
				top.setHeight(false);
			});
		},
		pourlock: 1,
		// 下单ajax
		orderLoadAjax: function (callBack) {
			var _this = this;

			if ( _this.pourlock ) {
				_this.pourlock = 0;
				var b = new getBaseDataAjax({
					url: root + '/handler/handler.html',
					_type: 'POST',
					dataType: 'json',
					postData: optionsData('order'),
					completeCallBack:function () {
						_this.pourlock = 1;
					},
					successCallBack:function (d) {
						tip = tips.msgTips({
							msg: d.tipinfo,
							type : "success"
						});
						callBack(d, "success");
						// 加载赔率接口
						_this.oddsLoadAjax();
						// 开始倒计时
						_this.updateFun(_this.updateTimeInit());
						$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
						_this.lmDtData = {};
						_this.lmActiveData = {};
						_this.orderInputData = {};
						_this.lmGroup = 0;
						$("#clearBtn").click();
						subInit.isEnterSubmit = true;
						_this.pourlock = 1;
					},
					portionSuccessCallBack: function (d) {
						// 更新右侧
						subInit.putinfo();
						$(".rightBox .tab_btn").eq(1).click();
						// 渲染列表
						var trClass = '';
						var spanClass = '';
						var tbodyHtml = '';
						var tbodyClass = '';
						var retrunList = d.data.returnlist;
						var retrunListLen = retrunList.length;
						var okLen = 0;
						var errorLen = 0;
						for(var i=0; i<retrunListLen; i++){
							if(retrunList[i]['success'] == '1'){
								spanClass = 'blue';
								okLen++;
							}else{
								spanClass = 'red';
								errorLen++;
							}
							tbodyHtml += '<tr class="'+ trClass +'" style="height:30px;">'+
						'<td width="150">'+ retrunList[i].playname +'-'+ retrunList[i].putamount +'</td>'+
						'<td width="120"><div class="plShow">'+ retrunList[i].pl +'</div></td>'+
						'<td width="80">'+
						retrunList[i].amount +
						'</td>'+
						'<td width="60"><span class="'+ spanClass +'">'+ retrunList[i].message +'</span></td>'+
						'</tr>';
						}
						if( retrunListLen > 8 ){
							tbodyClass = 'overHidden';
						}else{
							tbodyClass = '';
						}
						//	部分成功提示信息
						var _tpls = '<div class="tpl_order">'+
							'<table class="order">'+
								'<thead>'+
									'<tr>'+
										'<th width="150">注單</th>'+
										'<th width="120">賠率</th>'+
										'<th width="80">下註金額</th>'+
										'<th width="60">操作</th>'+
									'</tr>'+
								'</thead>'+
							'</table>'+
							'<div id="orderWrap" class="'+ tbodyClass +'">'+
							'<table class="order">'+
								'<tbody>'+
									tbodyHtml+
								'</tbody>'+
							'</table>'+
							'</div>'+
							'<table class="order">'+
							'<thead class="zjWrap">'+
							'<tr>'+
							'<th colspan="4">成功：<span id="zj">'+ okLen +'</span> 筆&nbsp&nbsp&nbsp&nbsp失敗：<span id="zjm" class="blue">'+ errorLen +'</span>筆</th>'+
							'</tr>'+
							'</thead>'+
							'</table>'+
							'</div>';

						$('body').myLayer({
							title: '下單結果',
							content: _tpls,
							isMiddle: true,
							okText: '知道了',
							isShowBtn: true,
							isCancelBtn: false,
							okCallBack: function (obj) {
								$.myLayer.close(true);
							}
						});
						// callBack(d, "success");
						// 加载赔率接口
						_this.oddsLoadAjax();

						// 开始倒计时
						_this.updateFun(_this.updateTimeInit());
						$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
						_this.lmDtData = {};
						_this.lmActiveData = {};
						_this.orderInputData = {};
						_this.lmGroup = 0;
						$("#clearBtn").click();
						_this.pourlock = 1;
					},
					otherErrorCallBack: function (d) { // 400 500
						tip = tips.msgTips({
							msg: d.tipinfo,
							type : "error"
						});
						callBack(d, "error");
						_this.pourlock = 1;
					},
					errorCallBack: function () {
						$.myLayer.close(true);
						tip = tips.msgTips({
							msg: '系统有误，请联系管理员，5秒后自动刷新页面!',
							type : "error"
						});
						_this.pourlock = 1;
						setTimeout(function () {
							window.location.reload(true);
						}, 5000);
					},
					oddsErrorCallBack: function (d) { // 600
						callBack(d, "error");
						_this.pourlock = 1;
					}
				});
			}

		},
		// 近期下注
		putinfo: function () {
			var _this = this;
			var b = new getBaseDataAjax({
				url: root + '/handler/handler.html',
				_type: 'POST',
				dataType: 'json',
				postData: {
					action: 'get_putinfo'
				},
				completeCallBack:function () {},
				successCallBack:function (d) {
					var item = d.data.item;
					var name = d.data.name;
					var order_num = d.data.order_num;
					var nn = d.data.nn;
					var money = d.data.money;
					var group = d.data.group;
					var lmtype = d.data.lmtype;
					var odds = d.data.odds;
					var conHtml = '';
					if(item && item.length>0){
						if(p.GamePath != 'L_SIX'){
							var endMoney = '';
							var endLmType = '';
							for(var i=0; i<item.length; i++){
								endMoney = '';
								endLmType = '';
								if(group[i] == '0' || group[i] == ''){
									endMoney = parseInt( money[i] );
									endLmType = '';
								}else{
									endMoney = parseInt( money[i] ) +'×'+ parseInt( group[i] ) + '=' +  parseInt( Number(money[i])*Number(group[i]) );
									endLmType = '復式'+ '『'+ group[i] +'组』' + '<br>';
								}
								itemHtml = item[i]['play_name'] + '@<strong class="red">'+ odds[i] +'</strong><br />【' + item[i]['bet_val'] + '】';

								if(i%2){
									conHtml += '<li><p>【'+name[i]+'】<br />【第'+nn[i]+'期】<br />'+itemHtml+'<br />'+ endLmType +'下注金额:<strong class="blue">'+endMoney+'</strong></p></li>';
								}else{
									conHtml += '<li class="on"><p>【'+name[i]+'】<br />【第'+nn[i]+'期】<br />'+itemHtml+'<br />'+ endLmType +'下注金额:<strong class="blue">'+endMoney+'</strong></p></li>';
								}
							}
							$("#putResult").html(conHtml);
						}else{
							sixBet.setPutResult(d);
						}
					}
				},
				otherErrorCallBack: function (d) {
					tip = tips.msgTips({
						msg: d.tipinfo,
						type : "error"
					});
				},
				errorCallBack:function () {}
			});
		},
		// 工具条 函数
		toolYs: function () {
			var that = this, oInput = $("#tool_ys_input"), b = true, wrap = $("#tool_ys_wrap"), a = wrap.find('a');
			var closeBtn = $("#close");
			//Tool's a bind click event
			a.unbind('click').bind('click',function () {
				var t = $(this).text() - 0;
				oInput.val(t);
				closeBtn.show();
			});
			//Tool's '+' bind click event
			wrap.find('b').unbind('click').bind('click',function (event) {
				var p = $(this).parent();
				if (b) {
					p.find('strong').show();
					p.find('input[type=text]').each(function (i) {
						$(this).val(a.eq(i).text());
					});
					b = false;
				} else {
					p.find('strong').hide();
					b = true;
				}
			});

			//Tool's alertLayer's btn bind click event
			wrap.find('.btn').unbind('click').bind('click',function () {
				var t = $(this);
				a.each(function (i) {
					var oInput = t.siblings("input[type=text]").eq(i);
					var v = oInput.val();
					if (v) {
						$(this).text(v);
					}
				});
				t.parent().hide();
				b = true;
			});

			closeBtn.unbind('click').bind('click',function () {
				oInput.val('');
				$(this).hide();
			});
		}
	};
	// 开封盘对象
	var closedMarket = {
		_isRun: false,
		_init: function (d) {
			var _this = this;
			var closeText = $('#closeText');
			var profit = $("#profit");
			var NowJq = $("#NowJq");
			// 今日输赢
			profit.html(d.profit);
			// 当前奖期
			NowJq.html(d.nn).attr("data-id", d.p_id);

			// 设置开封盘文字
			if (d['openning'] == 'y') {
				closeText.html('\u5c01\u76e4');
			} else {
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				closeText.html('\u958b\u734e');
			}
			// 格式化时间
			var n = _this.closeTimeInit(d['stop_time']);
			// 当时间非法时alert，当时间正确时启动开封盘倒计时
			if (n <= 0 || isNaN(n)) {
				// alert('ClosedMarketTime is Error!');
				setTimeout(function () {
					$.myLayer.close(true);
					window.location.reload();
				}, 1000);
			} else {
				_this.closedMarketFun(n);
			}
			//console.log(Number(NowJq.html()), Number($("#newPhase").text()));
			if (Number(NowJq.html()) > (Number($("#newPhase").text()) + 1)) {
				// _this.openball();
				_this.openBallByAd();
			}else{
				clearTimeout(_this.openballTimer);
			}
		},
		openballTimer:  null,
		//公告驱动开奖拉取
		openBallByAd:function() {
			var _this = this;
			var NowJq = $("#NowJq");
			clearTimeout(_this.openballTimer);
		   // console.log(Number(NowJq.html()), Number($("#newPhase").text()));
			 if (Number(NowJq.html()) > (Number($("#newPhase").text()) + 1)) {
				_this.openballTimer = setTimeout(function () {
					_this.openball();
					_this.openBallByAd();
				}, 3000);
			}
		},
		// 开奖接口
		openball: function () {
			var _this = this;
			var b = new getBaseDataAjax({
				url: root + '/handler/handler.html',
				_type: 'POST',
				dataType: 'json',
				postData: {
					action: 'get_openball'
				},
				completeCallBack: function () { },
				successCallBack: function (d) {
					_this.setOpenBall(d.data);
				},
				errorCallBack: function () { }
			});
		},
		// 设置上期开奖号码
		setOpenBall: function (d) {
			var prevBall = $("#prevBall");
			var newPhase = $("#newPhase");
			var phase1 = $("#phase1");
			var phase2 = $("#phase2");
			var aItem = "";
			var index = '';
			var drawResultLen = d.draw_result.length;
			for (var i = 0; i < drawResultLen; i++) {
				index = d.draw_result[i];
				if(p.GamePath == 'L_PCDD'){
					if(i == 3){
						aItem += '<span class="addFH">=</span><span class="No_' + index + '"></span>';
					}else if(i == 2){
						aItem += '<span class="No_' + index + '"></span>';
					}else{
						aItem += '<span class="No_' + index + '"></span><span class="addFH">+</span>';
					}
				} else if (p.GamePath == 'L_SIX') {
					if (i == 6) {
						aItem += '<span class="addFH">+</span><span class="No_' + index + '"></span><span class="addFH">' + d.upopennumberzodiac[i] + '</span>';
					} else {
						aItem += '<span class="No_' + index + '"></span><span class="addFH">' + d.upopennumberzodiac[i] + '</span>';
					}
				} else {
					aItem += '<span class="No_' + index + '"></span>';
				}
			}

			function sound() {
				var soundObj = $("#Sound");
				if (soundObj.length == 0) {
					$("body").append('<div id="Sound"></div>');
				}
				var IE = !-[1,];
				if(IE){
					soundObj.html("<embed src='../images/ClewSound.swf' loop=false autostart=false mastersound hidden=true width=0 height=0></embed>");
				}else{
					soundObj.html('<audio controls="controls" autoplay="autoplay" style="display:none"><source src="../images/ClewSound.ogg" type="audio/ogg"><source src="../images/ClewSound.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>');
				}				
			}


			if ((Number(d.draw_phase) + 1) == Number($("#NowJq").html())) {
				// 更新近期下注
				if (p.GamePath != 'L_SIX') {
					$("#putResult").html();
					subInit.putinfo();
				}
				if (p.soundSwitch) {
					sound();
				}
				if (p.GamePath != 'L_SIX') {
					subInit.rankList();
				}
			}

			prevBall.removeClass("time_loading");
			prevBall.html(aItem);

			newPhase.html(d.draw_phase);
			if (p.GamePath != 'L_SIX') {
				$("#intervaltime").html(d.phaseinfo['intervaltime']);
				$("#begintime").html(d.phaseinfo['begintime']);
				$("#endtime").html(d.phaseinfo['endtime']);
				phase1.html(d.phaseinfo['sold']);
				phase2.html(d.phaseinfo['surplus']);
			}
		},
		// 格式化 倒计时
		closeTimeInit: function (time) {
			var hms = time.split(":");
			var s = hms[2] - 0;
			var m = hms[1] - 0;
			var h = hms[0] - 0;
			return h * 3600 + m * 60 + s;
		},
		// 封盘倒计时
		closedMarketFun: function (num) {
			var _this = this;
			var wrap = $("#closedTime");
			var str = "";

			bTimer ? clearTimeout(bTimer) : bTimer = null;

			if (num >= 0) {
				wrap.removeClass('time_loading');
				domTime(num);
			}

			if (--num) {
				bTimer = setTimeout(function () {
					_this.closedMarketFun(num);
				}, 1000);
			} else {
				wrap.addClass('time_loading').html('');
				setTimeout(function () {
					subInit.oddsData = {};
					if ($('.myLayer').length > 0) {
						$.myLayer.close(true);
					}
					subInit.lmActiveData = {};
					subInit.lmDtData = {};
					isDt = false;
					subInit.orderInputData = {};
					wrap.removeClass('time_loading');
					// 重新启动倒计时
					subInit.updateFun(subInit.updateTimeInit);
					// 加载赔率接口
					subInit.oddsLoadAjax();
				}, 3000);
			}
			// domTime(num);
			function domTime(t) {
				var h = parseInt(t / 60 / 60) + '', m = parseInt(t / 60) - 60 * h + '', s = t % 60 + '';
				var s = t % 60 + '';
				var mh = '';
				var sh = '';
				h < 10 ? hh = '<span>0</span><span>' + h + '</span>時' : hh = '<span>' + h.substr(0, 1) + '</span><span>' + h.substr(1, 1) + '</span>時';
				if (h >= 100) {
					hh = '<span>' + h.substr(0, 1) + '</span><span>' + h.substr(1, 1) + '</span><span>' + h.substr(2, 1) + '</span>時';
				}
				m < 10 ? mh = '<span>0</span><span>' + m + '</span>分' : mh = '<span>' + m.substr(0, 1) + '</span><span>' + m.substr(1, 1) + '</span>分';
				s < 10 ? sh = '<span>0</span><span>' + s + '</span>秒' : sh = '<span>' + s.substr(0, 1) + '</span><span>' + s.substr(1, 1) + '</span>秒';
				wrap.html(p.GamePath == 'L_SIX' ? hh + mh + sh : mh + sh);
			}
		}
	};

	// 接口参数对象返回
	function optionsData(type) {
		var Data = {};
		// 赔率请求接口参数对象
		if(type == 'odds'){
			switch(parent.GamePath)
			{
				case "L_KL10":
				case "L_CQSC":
				case "L_K8SC":
				case "L_PCDD":
				case "L_PK10":
				case "L_XYFT5":
				case "L_JSCAR":
				case "L_SPEED5":
				case "L_XYNC":
				case "L_K3":
				case "L_KL8":
				case "L_SIX":
				case "L_XJSC":
				case "L_TJSC":
				case "L_JSCQSC":
				case "L_JSPK10":
			    case "L_JSSFC":
			    case "L_JSFT2":
			    case "L_CAR168":
			    case "L_SSC168":
			    case "L_VRCAR":
			    case "L_VRSSC":
					Data.action = 'get_oddsinfo';
					Data.playid = $("#playids").val();
					break;
				default:
			}
		}else if(type == 'order'){ // 下单请求接口参数对象
			switch(parent.GamePath)
			{
				case "L_CQSC":
				case "L_K8SC":
				case "L_PK10":
				case "L_XYFT5":
				case "L_JSCAR":
				case "L_SPEED5":
				case "L_K3":
				case "L_KL8":
				case "L_XJSC":
				case "L_TJSC":
				case "L_JSCQSC":
			    case "L_JSPK10":
			    case "L_JSFT2":
			    case "L_CAR168":
			    case "L_SSC168":
			    case "L_VRCAR":
			    case "L_VRSSC":
					Data = {
						action: 'put_money',
						phaseid: subInit.orderData['phaseid'],
						oddsid: subInit.orderData['oddsid'],
						uPI_P: subInit.orderData['uPI_P'],
						uPI_M: subInit.orderData['uPI_M'],
						i_index: subInit.orderData['i_index'],
						JeuValidate: JeuValidate
					};
					break;
				case "L_XYNC":
				case "L_KL10":
				case "L_PCDD":
				case "L_JSSFC":
					if (subInit.playpage == 'xync_lm' || subInit.playpage == 'kl10_lm' || subInit.playpage == 'pcdd_lm' || subInit.playpage == 'jssfc_lm') {
						Data = {
							action: 'put_money',
							phaseid: subInit.orderData['phaseid'],
							oddsid: subInit.orderData['oddsid'],
							uPI_P: subInit.orderData['uPI_P'],
							uPI_M: subInit.orderData['uPI_M'],
							uPI_TM:subInit.orderData['uPI_TM'],
							LM_Type: subInit.orderData['LM_Type'],
							NoS: subInit.orderData['NoS'],
							JeuValidate: JeuValidate
						};
					}else{
						Data = {
							action: 'put_money',
							phaseid: subInit.orderData['phaseid'],
							oddsid: subInit.orderData['oddsid'],
							uPI_P: subInit.orderData['uPI_P'],
							uPI_M: subInit.orderData['uPI_M'],
							i_index: subInit.orderData['i_index'],
							JeuValidate: JeuValidate
						};
					}
					break;
				case "L_SIX":
					if(subInit.playpage == 'six_lm' || subInit.playpage == 'six_lm_b' || subInit.playpage == 'six_bz' || subInit.playpage == 'six_lx' || subInit.playpage == 'six_ws'){
						Data = {
							action: 'put_money',
							phaseid: subInit.orderData['phaseid'],
							oddsid: subInit.orderData['oddsid'],
							uPI_P: subInit.orderData['uPI_P'],
							uPI_M: subInit.orderData['uPI_M'],
							uPI_TM:subInit.orderData['uPI_TM'],
							uPI_WT:subInit.orderData['uPI_WT'],
							lmtype: subInit.orderData['lmtype'],
							numbers: subInit.orderData['numbers'],
							JeuValidate: JeuValidate
						};
					}else{
						Data = {
							action: 'put_money',
							phaseid: subInit.orderData['phaseid'],
							oddsid: subInit.orderData['oddsid'],
							uPI_P: subInit.orderData['uPI_P'],
							uPI_M: subInit.orderData['uPI_M'],
							i_index: subInit.orderData['i_index'],
							JeuValidate: JeuValidate
						};
					}
					break;
				default:
			}
		}
		return Data;
	}

	// 處理六合彩
	var sixBet = {
		setSixLxlPage: function () {
			var znData = returnZodiacNumber(48, 'str');
			for(var key in znData){
				$("#znData_" + key).html( znData[key].join(',') )
			}
			var html = '不連' + p.returnAnimal(p.zodiacData[1]);
			$(".exlTitle").html( html ).siblings('a.oddsTrim').attr('data-name', html);
			$(".sx_"+p.zodiacData[1]).addClass('red');
		},
		// 六合彩连码radioIndex缓存
		radioIndex: 0,
		// 六合彩连码生肖，尾数勾选后号码缓存
		sixLmZMData: {},
		// 六合彩连码处理
		oddsDomSixLmHandler: function (data) {
			var _this = this;
			var that = subInit;
			var playOdds = data.play_odds;
			var lmBtn = null;
			var lmBtnOdds = null;
			for(var key in playOdds){

				lmBtn = $("#lm_" + key);
				lmBtnOdds = lmBtn.find('h4');
				if(playOdds[key]['pl'].indexOf(',') == -1 && lmBtn.attr('data-isDouble') == '0'){
					// 如果赔率缓存中与当前赔率不一致DOM新赔率
					if( !that.oddsData.hasOwnProperty( key ) ){
						lmBtnOdds.html( playOdds[key]['pl'] );
					}else{
						// 当赔率缓存数据与赔率接口数据不一样时
						if(that.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
							lmBtnOdds.html( playOdds[key]['pl'] );
						}
					}
				}else{
					// 如果赔率缓存中与当前赔率不一致DOM新赔率
					if( !that.oddsData.hasOwnProperty( key ) ){
						lmBtnOdds.find('span').eq(0).html( playOdds[key]['pl'].split(',')[0] );
						lmBtnOdds.find('span').eq(1).html( playOdds[key]['pl'].split(',')[1] );
					}else{
						// 当赔率缓存数据与赔率接口数据不一样时
						if(that.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
							lmBtnOdds.find('span').eq(0).html( playOdds[key]['pl'].split(',')[0] );
							lmBtnOdds.find('span').eq(1).html( playOdds[key]['pl'].split(',')[1] );
						}
					}
				}
				// 缓存每个赔率对象
				that.oddsData[ key ] = playOdds[ key ];
			}

			var gameSixLmTitle = $("#gameSixLmTitle>li");
			var gameSixLmBox = $("#gameSixLmBox>dd");
			var sixLmRadio = $("input[name=Six_Lm_Type]");
			// 初始化
			findBox( that.lmIndex, _this.radioIndex );
			// 绑定六合彩连码二级按钮点击事件
			gameSixLmTitle.unbind('click').bind('click', function () {
				// 缓存lmIndex
				that.lmIndex = $(this).index();
				// 禁用提交按钮
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				// 清空连码选中状态
				that.lmGroup = 0;
				that.lmActiveData = {};
				that.lmDtData = {};
				isDt = false;
				// 清空radioIndex
				_this.radioIndex = 0;

				_this.sixLmZMData={};
				// 显示当前GameBox
				findBox( that.lmIndex, 0 );
				// 关闭所有弹窗
				$.myLayer.close(true);
			});
			// 绑定Radio点击事件
			sixLmRadio.unbind('click').bind('click', function () {
				// 禁用提交按钮
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				// 清空连码选中状态
				that.lmGroup = 0;
				that.lmActiveData = {};
				that.lmDtData = {};
				_this.sixLmZMData={};

				isDt = false;
				// 关闭所有弹窗
				$.myLayer.close(true);
				switch($(this).val())
				{
					case '0':
						// 單註/復式
						_this.radioIndex = 0;
						break;
					case '1':
						// 膽拖
						_this.radioIndex = 1;
						break;
					case '2':
						// 生肖對碰
						_this.radioIndex = 2;
						break;
					case '3':
						// 尾數對碰
						_this.radioIndex = 3;
						break;
					case '4':
						// 混合對碰
						_this.radioIndex = 4;
						break;
				}
				findBox( that.lmIndex, _this.radioIndex );
			});
			// 点击连码按钮BOX处理
			function findBox(i, radioIndex) {
				// 改变连码按钮当前状态
				gameSixLmTitle.removeClass('active').eq( that.lmIndex ).addClass('active');
				// 切换显示内容
				var boxIndex = 0;
				var obj = gameSixLmTitle.eq(that.lmIndex);
				var bid = obj.attr('data-bid');
				var bigId = bid.split('_')[0];
				subInit.lmMin = ForDight(subInit.oddsData[bid]['min_amount']);
				subInit.lmMax = ForDight(subInit.oddsData[bid]['max_amount']);
				subInit.lmTopMax = ForDight(subInit.oddsData[bid]['top_amount']);
				subInit.lmTitle = obj.attr('data-name');
				subInit.lmOdds = subInit.oddsData[bid]['pl'];
				// 当radioIndex等于0 或 等于1的时候处理连码默认 否则处理生肖、尾数和混合
				if( !radioIndex || radioIndex == 1 ){
					boxIndex = that.lmIndex;
				}else{
					// +4 找到当前radio所对应的gameSixLmBox的索引
					boxIndex = radioIndex + 4;
				}

				// 执行切换
				gameSixLmBox.removeClass('active').eq( boxIndex ).addClass('active');

				if( !radioIndex || radioIndex == 1 ){
					// Dom六合彩连码微调赔率
					_this.domSixLmWtOdds( gameSixLmBox.eq( that.lmIndex ), gameSixLmTitle.eq( that.lmIndex ).attr('data-bid') );
				}else{
					// +4 找到当前radio所对应的gameSixLmBox的索引
					_this.domSixLmZodiacAndMant(gameSixLmBox.eq( boxIndex ), gameSixLmTitle.eq( that.lmIndex ).attr('data-bid'));
				}

				var SixLmLabel = $(".drop_down>label");
				SixLmLabel.removeClass('show').find('input').prop('checked', false);
				SixLmLabel.eq( radioIndex ).find('input').prop('checked', true);
				// 根据索引来显示radio
				switch( i )
				{
					case 0:
						// 三全中
						SixLmLabel.eq(0).addClass('show');
						SixLmLabel.eq(1).addClass('show');
						break;
					case 1:
						// 三中二/中三
						SixLmLabel.eq(0).addClass('show');
						SixLmLabel.eq(1).addClass('show');
						break;
					case 2: // 二全中
					case 3: // 二中特/中二
					case 4: // 特串
						SixLmLabel.addClass('show');
						break;
					case 5:
						// 四中一
						SixLmLabel.eq(0).addClass('show');
						break;
				}
			}

			// 赔率加载完成后事件
			that.oddsLoadEndHander();
		},
		// Dom六合彩连码微调赔率
		domSixLmWtOdds: function (wrap, bid) {
			var _this = this;
			var that = subInit;
			var aLi = $("#gameSixLmBox>dd.active").find('li');
			var aLiLen = aLi.length;
			// 获取缓存对象
			var thatOddsData = that.oddsData[bid];
			for(var i=1;i<=aLiLen;i++){
				var oLi = $("#six_" + bid.split('_')[0] + '_' + i);
				var nPl = '0';
				var radioClass = '';
				var NoClass = (Number(oLi.attr('data-name'))<10?'0'+Number(oLi.attr('data-name')):Number(oLi.attr('data-name')));
				var NoId = oLi.attr("data-bid");
				var plHtml = '';
				// 新赔率等于 基础赔率 + 微调值
				if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
					plHtml = '-';
					radioClass = 'radiodsable';
					that.isOpenOddr[bid] = false;
				}else{
					if(thatOddsData['pl'].indexOf(',') == -1){
						nPl = Number(thatOddsData['pl']) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						plHtml = ForDight4(nPl);
					}else{
						nPl = Number(thatOddsData['pl'].split(',')[0]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						nPl2 = Number(thatOddsData['pl'].split(',')[1]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						plHtml = ForDight4(nPl) + '/' + ForDight4(nPl2);
					}
					that.isOpenOddr[bid] = true;
					radioClass = '';
				}
				if(that.lmActiveData[NoId] && !radioClass){
					radioClass = 'radioPoint';
				}else if(that.lmActiveData[NoId] == false && !radioClass){
					radioClass = 'radiodsable';
				}
				if(that.lmDtData[NoId] && that.lmActiveData[NoId]){
					if(isDtType){
						radioClass = 'radioPoint radioDtPoint';
					}else{
						radioClass = 'radioPoint radioDtPoint radiodsable';
					}
				}else if(!that.lmDtData[NoId] && that.lmActiveData[NoId]){
					radioClass = 'radioPoint';
				}
				html = '<span class="name '+ 'No_' + NoClass +'"></span>'+
						'<span class="p"><a href="javascript:;">' + plHtml + '</a></span>'+
							'<span class="in"><a data-id="'+ NoId +'" href="javascript:;" class="radioSim '+ radioClass +'"></a></span>';
				oLi.html( html );
			}
			// 绑定radio事件
			lmCheckBoxFun();
			// 绑定连码下单按钮事件
			bindLmOrderHandle( bid );
		},
		// Dom六合彩连码生肖对碰
		domSixLmZodiacAndMant: function (wrap, bid) {
			var _this = this;
			var that = subInit;
			var plData = {};
			var bigId = bid.split('_')[0];
			// 获取缓存对象
			var thatOddsData = that.oddsData[bid];
			var nPl = '';
			for(var i=1;i<=49;i++){
				nPl = '0';
				plData[i] = '';
				// 新赔率等于 基础赔率 + 微调值
				if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
					plData[i]  = '-';
					that.isOpenOddr[bid] = false;
				}else{
					if(thatOddsData['pl'].indexOf(',') == -1){
						nPl = Number(thatOddsData['pl']) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						plData[i] = ForDight4( nPl );
					}else{
						nPl = Number(thatOddsData['pl'].split(',')[0]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						nPl2 = Number(thatOddsData['pl'].split(',')[1]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1]));
						plData[i] = ForDight4( nPl ) + '/' + ForDight4( nPl2 );
					}
					that.isOpenOddr[bid] = true;
				}
			}
			if(_this.radioIndex == 2){
				zodiacFun();
			}else if(_this.radioIndex == 3){
				mantFun();
			}else if(_this.radioIndex == 4){
				zodiacFun();
				mantFun();
			}

			function zodiacFun() {
				var radioClass = '';
				var oLi = null;
				var NoId = '';
				var html = '';
				for(var i=1; i<=12; i++){
					radioClass = '';
					oLi = $("#gameSixLmBox>dd.active").find(".zodiacBox>li").eq(i-1);
					oLi.attr("data-bid", bigId+'_'+i);
					NoId = oLi.attr("data-bid");
					if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
						radioClass = 'radiodsable';
					}else if(that.lmActiveData[NoId] && !radioClass){
						radioClass = 'radioPoint';
					}else if(that.lmActiveData[NoId] == false && !radioClass){
						radioClass = 'radiodsable';
					}else{
						radioClass = '';
					}
					html = '<span class="name">' + p.returnAnimal(i) + '</span>'+
								'<span class="No">'+
									p.zDataHtml[i]+
								'</span>'+
								'<a class="p clickPl" data-num="' + p.zNum[i].join(',') + '">'+
									'赔率'+
								'</a>'+
								'<span class="in">'+
									'<a data-num="' + p.zNum[i].join(',') + '" class="radioSim '+ radioClass +'" href="javascript:;" data-id="'+ (bid.split('_')[0] + '_' + i) +'"></a>'+
								'</span>';
					oLi.html( html );
				}
			}

			function mantFun() {
				var radioClass = '';
				var oLi = null;;
				var oRadio = null;
				var I = 0;
				for(var i=1; i<=10; i++){
					radioClass = '';
					oLi = $("#gameSixLmBox>dd.active").find(".mantBox>li").eq(i-1);
					oRadio = oLi.find(".radioSim");
					I = 0;
					oRadio.attr("data-num", p.mantData[i]);
					if(_this.radioIndex == 4){
						I = i + 12;
					}else{
						I = i;
					}
					oLi.attr("data-bid", bigId+'_'+I);
					oRadio.attr("data-id", bigId+'_'+I);
					var NoId = bigId+'_'+I;
					if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
						radioClass = 'radiodsable';
					}else if(that.lmActiveData[NoId] && !radioClass){
						radioClass = 'radioPoint';
					}else if(that.lmActiveData[NoId] == false && !radioClass){
						radioClass = 'radiodsable';
					}else{
						radioClass = '';
					}
					oRadio.attr('class', 'radioSim ' + radioClass );
				}
			}

			// 绑定radio事件
			lmCheckBoxFun();

			wrap.undelegate('.clickPl', 'click');
			wrap.delegate('.clickPl', 'click', function () {
				var _thisNum = $(this).attr('data-num').split(',');
				var _thisNumLen = _thisNum.length;
				var html = '';
				for(var i=0; i<_thisNumLen; i++){
					html += '<td>'+
								'<span class="NoCPl No_'+ (Number(_thisNum[i])<10?'0'+_thisNum[i]:_thisNum[i]) +'">'+
								'</span>'+
								'<span>'+
									plData[Number(_thisNum[i])]+
								'</span>'+
							'</td>';
				}
				$(this).myLayer({
					title: '当前赔率',
					isShowBtn: false,
					content: '<table class="aPlAlert">'+
								'<tbody>'+
									'<tr>'+
										html+
									'</tr>'+
								'</tbody>'+
							'</table>'
				});
			});

			// 绑定连码下单按钮事件
			bindLmOrderHandle( bid );
		},
		radioLxIndex: 0,
		// DOm六合彩六肖/生肖連/尾數連
		oddsDomSixLxHandler: function (data) {
			var _this = this;
			var that = subInit;
			var playOdds = data.play_odds;
			var sx = p.returnAnimal( p.zodiacData[1] );
			$(".nowYear").html( sx );

			var lmBtn = null;
			var lmBtnOdds = null;
			var bigId = '';
			for(var key in playOdds){
				lmBtn = $("#lm_" + key);
				lmBtnOdds = lmBtn.find('h4');
				bigId = key.split('_')[0];
				if(bigId == '91031' || bigId == '91032' || bigId == '91033' || bigId == '91058'){
					lmBtn.attr('data-name', '不連'+sx+',連'+sx);
				}

				if(playOdds[key]['pl'].indexOf(',') == -1){
					// 如果赔率缓存中与当前赔率不一致DOM新赔率
					if( !that.oddsData.hasOwnProperty( key ) ){
						lmBtnOdds.html( playOdds[key]['pl'] );
					}else{
						// 当赔率缓存数据与赔率接口数据不一样时plx
						if(that.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
							lmBtnOdds.html( playOdds[key]['pl'] );
						}
					}
				}else{
					// 如果赔率缓存中与当前赔率不一致DOM新赔率
					if( !that.oddsData.hasOwnProperty( key ) ){
						lmBtnOdds.find('span').eq(0).html( playOdds[key]['pl'].split(',')[0] );
						lmBtnOdds.find('span').eq(1).html( playOdds[key]['pl'].split(',')[1] );
					}else{
						// 当赔率缓存数据与赔率接口数据不一样时
						if(that.oddsData[ key ]['pl'] != playOdds[ key ]['pl']){
							lmBtnOdds.find('span').eq(0).html( playOdds[key]['pl'].split(',')[0] );
							lmBtnOdds.find('span').eq(1).html( playOdds[key]['pl'].split(',')[1] );
						}
					}
				}
				// 缓存每个赔率对象
				that.oddsData[ key ] = playOdds[ key ];
			}

			var gameSixLmTitle = $("#gameSixLmTitle>li");
			var gameSixLmBox = $("#gameSixLmBox>dd");
			var sixLmRadio = $("input[name=Six_Lm_Type]");

			// 初始化
			sixLxFun();

			// 绑定六合彩连码二级按钮点击事件
			gameSixLmTitle.unbind('click').bind('click', function () {
				// 缓存lmIndex
				that.lmIndex = $(this).index();
				// 禁用提交按钮
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				// 清空连码选中状态
				that.lmGroup = 0;
				that.lmActiveData = {};
				that.lmDtData = {};
				isDt = false;
				// 重置六肖radioLxIndex
				_this.radioLxIndex = 0;
				// 执行
				sixLxFun();
			});

			// 绑定六肖radio事件，保存当前radio索引
			sixLmRadio.unbind('click').bind('click', function () {
				_this.radioLxIndex = Number( $(this).val() );
				// 禁用提交按钮
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
				that.lmGroup = 0;
				that.lmActiveData = {};
				that.lmDtData = {};
				isDt = false;
				// 执行
				sixLxFun();
			});

			function sixLxFun () {
				var bid = gameSixLmTitle.eq(that.lmIndex).attr('data-bid');
				var title = gameSixLmTitle.eq(that.lmIndex).attr('data-name');
				// console.log(bid);
				that.lmMin = ForDight(that.oddsData[bid]['min_amount']);
				that.lmMax = ForDight(that.oddsData[bid]['max_amount']);
				that.lmTopMax = ForDight(that.oddsData[bid]['top_amount']);
				that.lmTitle = title;
				that.lmOdds = subInit.oddsData[bid]['pl'];
				// 改变六肖按钮active状态
				gameSixLmTitle.removeClass('active').eq( that.lmIndex ).addClass('active');
				// 执行切换
				gameSixLmBox.removeClass('active').eq( that.lmIndex ).addClass('active');
				// 保持radioLxIndex状态
				sixLmRadio.eq( _this.radioLxIndex ).prop('checked', true);
				// 显示当前GameBox
				_this.domSixLxWtOdds( gameSixLmBox.eq( that.lmIndex ), gameSixLmTitle.eq( that.lmIndex ).attr('data-bid') );

			}

			// 赔率加载完成后事件
			that.oddsLoadEndHander();
		},
		// 加载六肖微调值
		domSixLxWtOdds: function (wrap, bid) {
			var _this = this;
			var that = subInit;
			var bigId = bid.split('_')[0];
			var sixLxRadio = $("input[name=Six_Lm_Type]");
			var dropDown = $(".drop_down");
			var aLabel = $(".drop_down label");

			// 获取缓存对象
			var thatOddsData = that.oddsData[bid];

			switch( bigId )
			{
				case '91030':
					// 六肖一中
					zodiacFun();
					dropDown.hide();
					aLabel.removeClass('show');
					break;
				case '91031': // 二肖连
				case '91032': // 三肖连
				case '91033': // 四肖连
				case '91058': // 五肖连
					zodiacLmFun();
					dropDown.show();
					aLabel.addClass('show');
					break;
				case '91034': // 二尾连
				case '91035': // 三尾连
				case '91036': // 四尾连
				case '91059': // 五尾连
					mantFun();
					dropDown.show();
					aLabel.addClass('show');
					break;
			}
			// 处理六肖一中
			function zodiacFun() {
				var radioClass = '';
				var oLi = null;
				var NoId = '';
				var nPl = 0;
				for(var i=1; i<=12; i++){
					radioClass = '';
					oLi = $("#gameSixLmBox>dd.active").find("#zodiac_" + bigId + '_' + i);
					NoId = oLi.attr("data-bid");
					nPl = 0;
					if(thatOddsData['pl'] == '-'){
						that.isOpenOddr[bid] = false;
						radioClass = 'radiodsable';
					}else if(that.lmActiveData[NoId] && !radioClass){
						radioClass = 'radioPoint';
						that.isOpenOddr[bid] = true;
					}else if(that.lmActiveData[NoId] == false && !radioClass){
						radioClass = 'radiodsable';
						that.isOpenOddr[bid] = true;
					}else{
						radioClass = '';
						that.isOpenOddr[bid] = true;
					}
					if(thatOddsData['pl'] == '-'){
						nPl = '-';
					}else{
						nPl = ForDight4(Number(thatOddsData['pl']) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1])));
					}
					var html = '<span class="name">' + p.returnAnimal(i) + '</span>'+
								'<span class="No lxNo">'+
									p.zDataHtml2[i]+
								'</span>'+
								'<span class="p">'+
									nPl +
								'</span>'+
								'<span class="in">'+
									'<a class="radioSim '+ radioClass +'" href="javascript:;" data-id="'+ NoId +'"></a>'+
								'</span>';
					oLi.html( html );
				}
			}
			// 处理二肖连/三肖连/四肖连
			function zodiacLmFun() {
				var radioClass = '';
				var oLi = null;
				var NoId = '';
				var npl = 0;
				var html = '';
				for(var i=1; i<=12; i++){
					radioClass = '';
					oLi = $("#gameSixLmBox>dd.active").find("#zodiac_" + bigId + '_' + i);
					NoId = oLi.attr("data-bid");
					npl = 0;
					if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
						radioClass = 'radiodsable';
						that.isOpenOddr[bid] = false;
					}else if(that.lmActiveData[NoId] && !radioClass){
						radioClass = 'radioPoint';
						that.isOpenOddr[bid] = true;
					}else if(that.lmActiveData[NoId] == false && !radioClass){
						radioClass = 'radiodsable';
						that.isOpenOddr[bid] = true;
					}else{
						if(thatOddsData['pl'] != '-' && thatOddsData['pl'] != '-,-'){
							radioClass = '';
							that.isOpenOddr[bid] = true;
						}
					}
					if(that.lmDtData[NoId] && that.lmActiveData[NoId]){
						if(isDtType){
							radioClass = 'radioPoint radioDtPoint';
						}else{
							radioClass = 'radioPoint radioDtPoint radiodsable';
						}
					}else if(!that.lmDtData[NoId] && that.lmActiveData[NoId]){
						radioClass = 'radioPoint';
					}
					if(thatOddsData['pl'] != '-' && thatOddsData['pl'] != '-,-'){
						if(i == p.zodiacData[1]){
							// 处理连当年属相赔率
							npl = ForDight4(Number(thatOddsData['pl'].split(',')[1]));
						}else{
							// 处理其他属相赔率
							npl = ForDight4(Number(thatOddsData['pl'].split(',')[0]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1])));
						}
					}else{
						npl = '-';
					}
					html = '<span class="name">' + p.returnAnimal(i) + '</span>'+
								'<span class="No lxNo">'+
									p.zDataHtml[i]+
								'</span>'+
								'<span class="p">'+
									npl +
								'</span>'+
								'<span class="in">'+
									'<a class="radioSim '+ radioClass +'" href="javascript:;" data-id="'+ NoId +'"></a>'+
								'</span>';
					oLi.html( html );
				}
			}
			// 处理尾数连
			function mantFun() {
				var radioClass = '';
				var oLi = null;
				var oP = null;
				var npl = 0;
				var oRadio = null;
				var NoId = '';
				for(var i=0; i<10; i++){
					radioClass = '';
					oLi = $("#gameSixLmBox>dd.active").find("#mant_" + bigId + '_' + i);
					oP = oLi.find('.p');
					npl = 0;
					oRadio = oLi.find(".radioSim");
					NoId = oLi.attr("data-bid");
					if(thatOddsData['pl'] == '-' || thatOddsData['pl'] == '-,-'){
						radioClass = 'radiodsable';
						that.isOpenOddr[bid] = false;
					}else{
						radioClass = '';
						that.isOpenOddr[bid] = true;
					}
					if(that.lmActiveData[NoId] && !radioClass){
						radioClass = 'radioPoint';
					}else if(that.lmActiveData[NoId] == false && !radioClass){
						radioClass = 'radiodsable';
					}else{
						if(thatOddsData['pl'] != '-' && thatOddsData['pl'] != '-,-'){
							radioClass = '';
						}
					}
					if(that.lmDtData[NoId] && that.lmActiveData[NoId]){
						if(isDtType){
							radioClass = 'radioPoint radioDtPoint';
						}else{
							radioClass = 'radioPoint radioDtPoint radiodsable';
						}
					}else if(!that.lmDtData[NoId] && that.lmActiveData[NoId]){
						radioClass = 'radioPoint';
					}
					oRadio.attr('class', 'radioSim ' + radioClass);

					if(thatOddsData['pl'] != '-' && thatOddsData['pl'] != '-,-'){
						if(i == 0){
							// 处理连0
							npl = ForDight4(Number(thatOddsData['pl'].split(',')[1]));
						}else{
							// 处理非连0
							npl = ForDight4(Number(thatOddsData['pl'].split(',')[0]) + (isNaN(Number(thatOddsData['plx'][i-1])) ? 0 : Number(thatOddsData['plx'][i-1])));
						}
					}else{
						npl = '-';
					}
					oP.html( npl );
				}
			}

			// 绑定radio事件
			lmCheckBoxFun();

			// 绑定连码下单按钮事件
			bindLmOrderHandle( bid );
		},
		setPutResult: function (d) {
			var html = '';
			var prData = d.data;
			var item = d.data.item;
			var itemLen = item.length;
			var className = '';
			var oddsHtml = '';
			var oddrNumberHtml = '';
			var groupHtml = '';
			var typeHtml = '';
			var wtHtml = '';
			for(var i=0; i<itemLen; i++){
				className = '';
				oddsHtml = '';
				if(i%2){
					className = 'on';
				}
				if(prData['odds'][i]['odds2'] == ''){
					oddsHtml = prData['odds'][i]['oddstext1'] + ' @<strong class="red">'+ prData['odds'][i]['odds1'] +'</strong>';
				}else{
					oddsHtml = prData['odds'][i]['oddstext1'] + ' @<strong class="red">'+ prData['odds'][i]['odds1'] +'</strong><br>'+
								prData['odds'][i]['oddstext2'] + ' @<strong class="red">'+ prData['odds'][i]['odds2'] +'</strong>';
				}
				oddrNumberHtml = '';
				groupHtml = '';
				if(prData['group'][i] != '0' && prData['group'][i] != ''){
					groupHtml = prData['grouptext'][i] + '『'+ prData['group'][i] +'组』' + '<br>';
				}
				if(prData['lmtype'][i] == '0' || prData['lmtype'][i] == ''){
					oddrNumberHtml = groupHtml + item[i]['bet_val1'];
				}else{
					typeHtml = '';
					if(prData['lmtype'][i] == '1'){
						typeHtml = '<span class="blue">拖</span>';
					}else{
						typeHtml = '<span class="blue">對碰</span>';
					}
					oddrNumberHtml = groupHtml + item[i]['bet_val1'] +'<br>'+ typeHtml + '<br>' + item[i]['bet_val2'];
				}
				wtHtml = '';
				if(!objIsEmpty(prData['wtvalue'][i])){
					var keys = [];
					for(var key in prData['wtvalue'][i]){
						keys.push( key );
					}
					keys = quickSort(keys);
					var wtplhtml = 0;
					var oWt = '';
					for(var j=0; j<keys.length; j++){
						oWt = prData['wtvalue'][i][keys[j]];
						if(oWt.indexOf(',') > 0){
							wtplhtml = ForDight4(oWt.split(',')[0])+','+ForDight4(oWt.split(',')[1]);
						}else{
							wtplhtml = ForDight4(oWt);
						}
						wtHtml += '<p class="prWt">含<span>' + keys[j] + '</span>的單組賠率下調為<span>' + wtplhtml + '</span></p>';
					}
				}
				var money = '';
				if(prData['group'][i] == '0' || prData['group'][i] == ''){
					money = parseInt( prData['money'][i] );
				}else{
					money = parseInt(prData['money'][i]) +'×' + prData['group'][i] +'='+ parseInt(Number(prData['money'][i])*Number(prData['group'][i]));
				}
				html += '<dl class="'+ className +'" title="點擊查看詳細">'+
							'<dt>'+
							'<p>【'+ prData['name'][i] +'】<br>【第'+ prData['nn'][i] +'期】<br>'+
							'#' + prData['order_num'][i] +'<br>'+ oddsHtml +'<br>下注金额:<strong class="blue">'+ money +'</strong></p></dt>'+
							'<dd>下註號碼明細<br>'+ oddrNumberHtml +'<br>'+ wtHtml +'</dd>'+
						'</dl>';
			}
			$("#putResult").html(html);
			$("#putResult>dl").unbind('click');
			$("#putResult>dl").bind('click', function () {
				if($(this).hasClass('currt')){
					$(this).removeClass('currt');
				}else{
					$("#putResult>dl").removeClass('currt');
					$(this).addClass('currt');
					top.setHeight();
				}
			});
		},
		shortCutSubmitData: {},
		shortCutTitle: '',
		// 快捷菜单
		shortCut: function () {
			var _this = this;
			var d = {};
			var gameBox = $("#gameBox");
			var shortCutHtml = juicer($("#tpl_quickOrderW").html(), d);

			var znData = p.zNum;
			var firstId = '';
			// 找到第一球的id
			switch (subInit.playpage) {
				case 'six_tm_a':
					firstId = '91001_92001';
					break;
				case 'six_tm_b':
					firstId = '91002_92050';
					break;
				case 'six_zmt_1':
					firstId = '91010_92181';
					break;
				case 'six_zmt_2':
					firstId = '91025_92316';
					break;
				case 'six_zmt_3':
					firstId = '91026_92365';
					break;
				case 'six_zmt_4':
					firstId = '91027_92414';
					break;
				case 'six_zmt_5':
					firstId = '91028_92463';
					break;
				case 'six_zmt_6':
					firstId = '91029_92512';
					break;
				}
			// 根据第一球取maxData
			var maxData = {
				'min_amount': subInit.oddsData[ firstId ]['min_amount'],
				'max_amount': subInit.oddsData[ firstId ]['max_amount'],
				'top_amount': subInit.oddsData[ firstId ]['top_amount'],
				'dq_max_amount': subInit.oddsData[ firstId ]['dq_max_amount'],
				'dh_max_amount': subInit.oddsData[ firstId ]['dh_max_amount']
			}

			// 计算今年生肖对应号码
			for(var i=1; i<=12; i++){
				shortcutData['zodiac'+i] = znData[i+''].join(',').split(',');
			}
			// 计算今年生肖 家禽/野兽 2,7,8,10,11,12 || 1,3,4,5,6,9
			shortcutData['poultry'] = znData['2'].concat(znData['7']).concat(znData['8']).concat(znData['10']).concat(znData['11']).concat(znData['12']).join(',').split(',');
			shortcutData['beast'] = znData['1'].concat(znData['3']).concat(znData['4']).concat(znData['5']).concat(znData['6']).concat(znData['9']).join(',').split(',');

			gameBox.undelegate('#shortCutBtn', 'click');
			gameBox.delegate('#shortCutBtn', 'click', function () {
				_this.shortCutTitle = $(this).attr('data-title');
				// 创建快速投注弹窗
				$(this).myLayer({
					title: '快速投注',
					isShowBtn: true,
					isMiddle: true,
					content: shortCutHtml,
					openCallBack: function (obj) {
						// 弹窗打开后渲染快捷栏
						_this.setShortCut( maxData, obj );
					},
					okCallBack: function (obj) {
						obj.find('.myLayerLoading').show();
						// 生成下单对象
						_this.shortCutSubmitData = {
							'i_index': [],
							'oddsid': [],
							'uPI_M': [],
							'uPI_P': []
						}
						obj.find("#quickOrderList tr").each(function (index) {
							_this.shortCutSubmitData["i_index"].push(index);
							_this.shortCutSubmitData["oddsid"].push($(this).attr('data-bid'));
							_this.shortCutSubmitData["uPI_M"].push($(this).attr('data-amount'));
							_this.shortCutSubmitData["uPI_P"].push($(this).attr('data-pl'));
						});
						subInit.orderData['i_index'] = _this.shortCutSubmitData["i_index"].join(',');
						subInit.orderData['oddsid'] = _this.shortCutSubmitData["oddsid"].join(',');
						subInit.orderData['phaseid'] = $("#NowJq").attr('data-id');
						subInit.orderData['uPI_M'] = _this.shortCutSubmitData["uPI_M"].join(',');
						subInit.orderData['uPI_P'] = _this.shortCutSubmitData["uPI_P"].join(',');
						// 开始下单
						subInit.orderLoadAjax(function (d, isOk) {
							// obj.find('.myLayerLoading').show();
							if(isOk == 'success'){
								$.myLayer.close(true);
								subInit.putinfo();
								$(".rightBox .tab_btn").eq(1).click();
							}else{
								if(d.success == '600'){
									var aIndex = d.data.index;
									var aPl = d.data.newpl;
									var plBdHtml = '<p class="qoPTitle red">註意：該組合投註賠率已有下列變動：</p>';
									var oldPl = subInit.orderData['uPI_P'].split(',');
									// 生成弹窗註意：該組合投註賠率已有下列變動：
									for(var i=0; i<aIndex.length;i++){
										var oIndex = Number(aIndex[i]);
										var oTr = $("#quickOrderList tr").eq(oIndex);
										var oDel = oTr.find('.qoDelete');
										var dNum = oDel.attr("data-id");
										plBdHtml += '<p>' + _this.shortCutTitle +'【'+ dNum +'】'+ '賠率已經由<span class="red">' + oldPl[oIndex] + '</span>變為<span class="blue">' + aPl[i] + '</span>';
										// oDel.click();
									}
									$(".qoTipsCon").html( plBdHtml );
									$(".qoTips").show();
									// 如果用户点击 跳过变动项
									$("#allSkip").unbind('click').bind('click', function () {
										for(var i=0; i<aIndex.length; i++){
											var oIndex = Number(aIndex[i]);
											var oTr = $("#quickOrderList tr").eq(oIndex);
											var oDel = oTr.find('.qoDelete');
											oDel.click();
										}
										$(".qoTips").hide();
										obj.find(".myLayerOk").click();
									});
									// 如果用户点击 全部接受
									$("#allAgree").unbind('click').bind('click', function () {
										for(var i=0; i<aIndex.length; i++){
											var plIndex = Number(aIndex[i]);
											$("#quickOrderList tr").eq(plIndex).attr('data-pl', aPl[plIndex]);
										}
										$(".qoTips").hide();
										obj.find(".myLayerOk").click();
									});
									// 如果用户点击 全部取消
									$("#allCancel").unbind('click').bind('click', function () {
										obj.find('.myLayerCancel').click();
									});
								}
								if(d.success == '500'){
									if(d.data.hasOwnProperty('index')){
										var aIndex = d.data.index;
										var oTr = $("#quickOrderList tr").eq(Number(aIndex[0]));
										// 提示信息
										oTr.myxTips({
											content: d.tipinfo
										});
									}else{
										var tip = tips.msgTips({
											msg: d.tipinfo,
											type : "error"
										});
										$.myLayer.close(true);
									}
								}
								if(d.success == '400'){
									var tip = tips.msgTips({
										msg: d.tipinfo,
										type : "error"
									});
									$.myLayer.close(true);
								}
								obj.find('.myLayerLoading').hide();
							}
						});
					}
				});
			});
		},
		setShortCut: function ( maxData, obj ) {
			var _this = this;
			var newArr = [];
			var qoInput = $("#qoInput");
			var quickOrderList = $("#quickOrderList");
			var listArr = [];
			// 生成最大值
			$("#qoMinAmount").html( parseInt(maxData['min_amount']) );
			$("#qoMaxAmount").html( parseInt(maxData['max_amount']) );
			$("#qoTopAmount").html( parseInt(maxData['top_amount']) );
			$("#qoDqMaxAmount").html( parseInt(maxData['dq_max_amount']) );
			$("#qoDhMaxAmount").html( parseInt(maxData['dh_max_amount']) );
			// 选择号码
			$("#qoNumber").delegate('a', 'click', function () {
				var num = Number($(this).html());
				var numArr = [];
				numArr.push(num);
				if($(this).hasClass('active')){
					$(this).removeClass('active');
					newArr = Array.complement(newArr, numArr);
				}else{
					$(this).addClass('active');
					newArr.push( num );
				}
				setNumber();
			});
			// 选择类别
			$("#qoText").delegate('a:not(.qtBtn)', 'click', function () {
				var that = $(this);
				var num = shortcutData[that.attr('data-id')];
				if(that.hasClass('active')){
					that.removeClass('active');
					newArr = Array.minus(newArr, num);
				}else{
					that.addClass('active');
					newArr = newArr.concat( num );
				}
				setNumber();
			});
			// 反选
			$("#backOption").unbind('click').bind('click', function () {
				newArr = Array.complement(newArr, shortcutData['all']);
				setNumber();
			});
			// 取消
			$("#cancelOption").unbind('click').bind('click', function () {
				newArr = [];
				$("#qoText a").removeClass('active');
				$("#qoNumber a").removeClass('active');
			});
			// 清除列表
			$("#clearQoList").unbind('click').bind('click', function () {
				$("#qoText a").removeClass('active');
				$("#qoNumber a").removeClass('active');
				listArr = [];
				newArr = [];
				quickOrderList.html('');
				_this.shortCutSubmitData = {};
				countSum();
				okBtn.addClass('grayBtn1');
				$("#qoSum").html( 0 +'/'+ 0 + '筆' );
			});
			// 计算
			function setNumber() {
				// 去重
				newArr = newArr.uniquelize();
				var len = newArr.length;
				// 去掉所有号码样式
				$("#qoNumber a").removeClass('active');
				// 添加选中号码样式
				for(var i=0; i<len; i++){
					$("#qb_" + newArr[i]).addClass('active');
				}
			}
			// 绑定生成列表按钮事件
			$("#qoInputBtn").unbind('click').bind('click', function () {
				isShowBtn = false;
				if(qoInput.val() != ''){
					if(!isNaN(Number(qoInput.val()))){
						// 如果大于可用额度
						if(Number(qoInput.val()) > Number(maxData['max_amount'])){
							qoInput.myxTips({
								content: '單註額度不能大於：' + parseInt(maxData['max_amount'])
							});
						}else if(Number(qoInput.val()) < Number(maxData['min_amount'])){
							qoInput.myxTips({
								content: '單註額度不能小於：' + parseInt(maxData['min_amount'])
							});
						}else{
							// 生成列表
							createList();
							newArr = [];
							$(this).blur();
							$("#qoText a").removeClass('active');
							$("#qoNumber a").removeClass('active');
						}
					}else{
						qoInput.myxTips({
							content: '請輸入數字!'
						});
					}
				}else{
					qoInput.myxTips({
						content: '下注金額不能為空！'
					});
				}
			});
			quickOrderList.undelegate('tr', 'hover');
			quickOrderList.delegate('tr', 'mouseover', function () {
				$(this).css({
					'background': '#f7f7f7'
				});
			});
			quickOrderList.delegate('tr', 'mouseout', function () {
				$(this).css({
					'background': '#fff'
				});
			});
			// 删除
			quickOrderList.undelegate('.qoDelete', 'click');
			quickOrderList.delegate('.qoDelete', 'click', function () {
				$(this).parent().parent().remove();
				countSum();
				// $("#qb_" + $(this).attr('data-id')).click();
				// $("#qoInputBtn").click();
			});
			// 提交按钮
			var okBtn = obj.find(".myLayerOk");
			var isShowBtn = false;
			okBtn.addClass('grayBtn1');
			// 生成列表
			function createList () {
				var html = '';
				if(newArr.length != 0){
					for(var i=0; i<newArr.length;i++){
						var nIndex = (newArr[i]<10)?'0'+newArr[i]:newArr[i];
						var bigId = $("li[data-name="+ nIndex +"]").attr('data-bid');
						// 当列表中不包含某一项的时候再添加列表 
						if (!listArr.contains(newArr[i])) {
							listArr.push(newArr[i]);
							html += '<tr data-bid="'+ bigId.split('_')[1] +'" data-id="'+ nIndex +'" data-pl="'+ subInit.oddsData[ bigId ]['pl'] +'" data-amount="'+ Number(qoInput.val()) +'">'+
										'<td>'+ _this.shortCutTitle +'【'+ nIndex +'】 @ <strong class="red">' + subInit.oddsData[ bigId ]['pl'] + '</strong></td>'+
										'<td><span class="blue">'+ Number(qoInput.val()) +'</span></td>'+
										'<td><a href="javascript:;" title="删除" data-id="'+ nIndex +'" class="qoDelete deleteIcon"></a></td>'+
									'</td>';
						}
					}
				}else{
					qoInput.myxTips({
						content: '您未選擇下注號碼,請在上方選擇下注號碼!'
					});
				}
				// 插入
				quickOrderList.append( html );
				// 排序
				var Newhtml = quickOrderList.find('tr').sort(function(a,b){
					return parseInt($(a).attr("data-id")) - parseInt($(b).attr("data-id"))
				});
				quickOrderList.html(Newhtml);
				// 计算总额
				countSum();
			}
			// 计算总额
			function countSum() {
				var oddrSum = 0;
				var aTr = quickOrderList.find('tr');
				aTr.each(function () {
					oddrSum += Number($(this).attr('data-amount'));
				});
				if(oddrSum > Number(p.sixUsableCredit)){
					qoInput.myxTips({
						content: '可用額度不足!'
					});
					isShowBtn = false;
				}else if(oddrSum > Number(maxData['top_amount'])){
					qoInput.myxTips({
						content: '超出派彩額度!'
					});
					isShowBtn = false;
				}else if(aTr.length > 60){
					$("#qoSum").myxTips({
						content: '您選擇的號碼超過了最大60組，請重新選擇號碼！'
					});
					isShowBtn = false;
				}else if(newArr.length == 0 && aTr.length == 0){
					isShowBtn = false;
				}else{
					isShowBtn = true;
				}

				if(isShowBtn){
					okBtn.removeClass('grayBtn1');
				}else{
					okBtn.addClass('grayBtn1');
				}

				$("#qoSum").html( oddrSum +'/'+ aTr.length + '筆' );
			}
		}
	};
	// 连码模拟checkBox 下单
	function lmCheckBoxFun() {
		var _this = subInit;
		var gameBox = $("#gameBox");
		var dtNum = 0;

		gameBox.undelegate('.radioSim:not(.radiodsable)', 'click');
		gameBox.delegate('.radioSim:not(.radiodsable)', 'click', function () {
			var that = $(this);
			var bigId = $(this).attr('data-id').split('_')[0];
			if(bigId == '91058' || bigId == '91059'){
				dtNum = 4;
			}else if(bigId == '91033' || bigId == '91036'){
				dtNum = 3;
			}else if(bigId == '91016' || bigId == '91017' || bigId == '91032' || bigId == '91035' || bigId == '91060' || bigId == '91061'){
				dtNum = 2;
			}else{
				dtNum = 1;
			}
			setCheckBox(that);
			if(sixBet.radioIndex == 1 || sixBet.radioLxIndex == 1){
				var poCount = $("#gameSixLmBox>dd.active .radioPoint").length;
				// var dtCount = $(".radioDtPoint").length;
				if(poCount<=dtNum && isDt == true){
					isDtType = true;
					$(".radioSim.radioDtPoint").removeClass('radiodsable');
					setDtCheckBox(that);
				}else if(poCount<=dtNum && isDt == false){
					isDtType = true;
					$(".radioSim.radioDtPoint").removeClass('radiodsable');
					setDtCheckBox(that);
				}else{
					isDtType = false;
					$(".radioSim.radioDtPoint").addClass('radiodsable');
				}
			}
			if(sixBet.radioIndex == 2 || sixBet.radioIndex == 3 || sixBet.radioIndex == 4){
				sixBet.sixLmZMData[that.attr('data-id')] = that.attr('data-num');
			}
			retrunLmCount(bigId+'_'+ $('#menuText',window.parent.document).attr('data-id'));
		});

		function setCheckBox(that) {
			if(!that.hasClass('radioPoint')){
				that.addClass('radioPoint');
				_this.lmActiveData[that.attr('data-id')] = true;
				isDt = true;
			}else{
				that.removeClass('radioPoint');
				isDt = false;
				if(_this.lmActiveData.hasOwnProperty( that.attr('data-id') )){
					delete _this.lmActiveData[ that.attr('data-id') ];
				}
			}
		}
	}

	function setDtCheckBox(that) {
		if(isDt){
			that.addClass('radioDtPoint');
			subInit.lmDtData[that.attr('data-id')] = true;
		}else{
			that.removeClass('radioDtPoint');
			if(subInit.lmDtData.hasOwnProperty( that.attr('data-id') )){
				delete subInit.lmDtData[ that.attr('data-id') ];
			}
		}
	}

	// 绑定连码下单按钮事件
	function bindLmOrderHandle ( bid ) {
		var _this = subInit;
		// 綁定普通下單清空按鈕事件
		$("#clearBtn").unbind('click').bind('click', function () {
			if(!!subInit.isOpenOddr[bid]){
				var radio = $(".radioSim");
				radio.removeClass('radioPoint');
				radio.removeClass('radiodsable');
				radio.removeClass('radioDtPoint');
				_this.lmActiveData = {};
				_this.orderInputData = {};
				_this.lmDtData = {};
				_this.lmGroup = 0;
				isDt = false;
				$("#gameSubmit").attr('disabled', true).addClass('disSubmit');
			}
		});

		var game_box_tool = $(".game_box_tool");
		// 綁定普通下單提交按鈕事件
		game_box_tool.undelegate('#gameSubmit:not(.disSubmit)', 'click');
		game_box_tool.delegate('#gameSubmit:not(.disSubmit)', 'click', function () {
			// 判斷下單對象是否為空
			if(subInit.lmGroup >= 1){
				if(bid.split('_')[0] == '91030'){
					var lxNumber = returnLxNumber();
					if(lxNumber == '1,3,5,7,9,11'|| lxNumber == '2,4,6,8,10,12'){
						// 彈出錯誤提示
						var tip = tips.msgTips({
							msg: '抱歉！“六肖”禁止全單/雙路投注，該注單請投在“特碼單雙”項。',
							type : "error"
						});
						return;
					}
				}
				// 不為空打開并設置提交窗口
				$(this).orderLmLayer({
					bid: bid
				});
			}
		});

		function returnLxNumber() {
			var attr = [];
			for(var key in subInit.lmActiveData){
				if(!!_this.lmActiveData[key]){
					attr.push(Number(key.split('_')[1]));
				}
			}
			attr = attr.sort(function(a,b){return a>b?1:-1});
			return attr.join(',');
		}
	}

	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			factory( require('jquery') );
		} else {
			factory(jQuery);
		}
	}(function ($) {
		/*
		 * [赔率下单 弹窗]
		 */
		$.fn.oddsLayer = function (options) {
			var defaults = {};
			var opts = $.extend({}, defaults, options);
			var _this = $(this);
			// 从节点id上取得赔率id
			function findOddsId(str) {
				return str.replace(/odds_/, '');
			}
			// 获取赔率id
			var oddsId = findOddsId( _this.attr('id') );
			var oddsValue = _this.html();
			var bigName = _this.parents('.game_box').attr('data-title');
			var _tpl = '<div class="myLayerBox">'+
							'<p>賠率：<em>'+ oddsValue +'</em>下註金額：<input id="odds_pl" name="uPI_M" class="input onlyNum" type="text" value=""></p>'+
							'<p>可赢金额：<em id="valueOdds" class="blue">0</em></p>'+
							'<p>最高派彩：<i>'+ ForDight(subInit.oddsData[ oddsId ]['top_amount']) +'</i></p>'+
						'</div>';


			$("#myWarp").undelegate('#odds_pl');
			$("#myWarp").delegate('#odds_pl', 'keyup', function () {
				$("#valueOdds").html(ForDight(Number($(this).val())*Number(oddsValue)));
			});

			_this.myLayer({
				title: bigName +' 【'+ $("#g_" + oddsId).attr('data-name') + '】',
				content: _tpl,
				isShowBtn: true,
				okCallBack: function (obj) {
					var oddsPl = obj.find('#odds_pl');
					var oddsPlValue = oddsPl.val();
					if(!oddsPlValue){
						oddsPl.myxTips({
							content: '下注金額不能為空！'
						});
					}else if(oddsPlValue > Number(subInit.oddsData[ oddsId ]['max_amount'])){
						oddsPl.myxTips({
							content: '下注金額不能大於單注最大下注額度：' + ForDight(subInit.oddsData[ oddsId ]['max_amount'])
						});
					}else if(oddsPlValue < Number(subInit.oddsData[ oddsId ]['min_amount'])){
						oddsPl.myxTips({
							content: '下注金額不能小於單注最小下注額度：' + ForDight(subInit.oddsData[ oddsId ]['min_amount'])
						});
					}else{
						subInit.orderData = {};

						subInit.orderData['i_index'] = 0;
						subInit.orderData['oddsid'] = oddsId.split('_')[1];
						subInit.orderData['phaseid'] = $("#NowJq").attr('data-id');
						subInit.orderData['uPI_M'] = oddsPlValue;
						subInit.orderData['uPI_P'] = subInit.oddsData[ oddsId ]['pl'];
						obj.find('.myLayerLoading').show();
						subInit.orderLoadAjax(function (d, isOk) {
							if(isOk == 'success'){
								$.myLayer.close(true);
								subInit.putinfo();
								$(".rightBox .tab_btn").eq(1).click();
							}else{
								if(d.success == '600'){
									var oIndex = d.data.index;
									var newPl = d.data.newpl[oIndex];
									subInit.oddsData[ oddsId ]['pl'] = newPl;
									$("#odds_" + oddsId).html( newPl );
									$("#odds_pl").siblings('em').html(ForDight4(newPl));
									$("#odds_pl").myxTips({
										content: "賠率變動：" + newPl + " ，請確認後再提交!",
										times: 5000
									});
								}
								if(d.success == '500'){
									var tip = tips.msgTips({
										msg: d.tipinfo,
										type : "error"
									});
									$.myLayer.close(true);
								}
								if(d.success == '400'){
									var tip = tips.msgTips({
										msg: d.tipinfo,
										type : "error"
									});
									$.myLayer.close(true);
								}
								obj.find('.myLayerLoading').hide();
							}
						});
					}
					// obj.find('#myLayerLoading').show();
				},
				openCallBack: function (obj) {
					obj.find('input').eq(0).focus();
				}
			});
		};
		/*
		 * [普通下單]
		 */
		$.fn.orderSubmitLayer = function (options) {
			var defaults = {};
			var opts = $.extend({}, defaults, options);

			var tbodyHtml = '';
			var tbodyClass = '';

			var orderInput = $(".orderInput");
			var len = 0;
			var sumValue = 0;
			var keys = [];
			var keysData = {};
			var iData = subInit.orderInputData;

			
			// if (!isLastBtn) {
			// 	iData = jQuery.extend(true, {}, subInit.orderInputData);
			// }else{
			// 	iData = $.extend(true, top.lastData[top.GamePage], subInit.orderInputData);
			// }

			for(var key in iData){
				keys.push( Number(key.split("_")[1]) );
				keysData[Number(key.split("_")[1])] = key;
				len++;
			}
			keys = quickSort( keys );
			var keysLen = keys.length;
			for(var i=0; i<keysLen; i++){
				var key = keysData[keys[i]+""];
				// console.log(('123123').substring(0, keys[i].length-1))
				var oLi = $("#g_" + key);
				var gameBox = oLi.parents('.game_box');
				var oddsHtml = $("#odds_" + key).html();
				tbodyHtml += '<tr>'+
								'<td width="150">'+ gameBox.attr('data-title') +'-'+ oLi.attr("data-name") +'</td>'+
								'<td width="120"><div data-id="' + key +'" class="plShow">'+ oddsHtml +'</div></td>'+
								'<td width="80">'+
									'<input class="input onlyNum orderLayerInput" data-pl="'+ oddsHtml +'" data-id="'+ key +'" id="order_'+ key +'" value="'+ iData[key] +'" type="text">'+
								'</td>'+
								'<td width="60"><a class="deleteOrder deleteIcon" title="删除" data-id="'+ key +'" href="javascript:void(0)"></a></td>'+
							'</tr>';
			}

			if( len > 8 ){
				tbodyClass = 'overHidden';
			}else{
				tbodyClass = '';
			}

			var _this = $(this);
			var _tpls = '<div class="tpl_order">'+
							'<table class="order">'+
								'<thead>'+
									'<tr>'+
										'<th width="150">注單</th>'+
										'<th width="120">賠率</th>'+
										'<th width="80">下註金額</th>'+
										'<th width="60">操作</th>'+
									'</tr>'+
								'</thead>'+
							'</table>'+
							'<div id="orderWrap" class="'+ tbodyClass +'">'+
								'<table class="order">'+
									'<tbody>'+
										tbodyHtml+
									'</tbody>'+
								'</table>'+
							'</div>'+
							'<table class="order">'+
								'<thead class="zjWrap">'+
									'<tr>'+
										'<th colspan="4">注數：<span id="zj">'+ 0 +'</span> 筆&nbsp&nbsp&nbsp&nbsp合計金額：<span id="zjm" class="blue">'+ 0 +'</span>   </th>'+
									'</tr>'+
								'</thead>'+
							'</table>'+
						'</div>';
			var wrap = $("#myWarp");
			var aData = {};
			var sum = 0;
			wrap.undelegate('.deleteOrder', 'click');
			wrap.delegate('.deleteOrder', 'click', function () {
				// delete top.lastData[top.GamePage][$(this).attr('data-id')];
				delete subInit.orderInputData[$(this).attr('data-id')];
				$("#inw_"+$(this).attr('data-id')).find('input').val('');
				$(this).parents('tr').eq(0).remove();
				sumRun();
			});

			wrap.undelegate('.orderLayerInput', 'keyup');
			wrap.delegate('.orderLayerInput', 'keyup', function () {
				setTimeout(function () {
					sumRun();
				}, 10);
			});
			function sumRun() {
				sum = 0;
				aData = {
					'i_index': [],
					'oddsid': [],
					'uPI_M': [],
					'uPI_P': []
				};
				var trLen = $("#orderWrap tr").length;
				if(trLen <= 8){
					$("#orderWrap").removeClass('overHidden');
				}
				if(!trLen){
					$("#gameSubmit").addClass('disSubmit');
					$.myLayer.close(true);
				}
				$("#zj").html( trLen );
				$(".orderLayerInput").each(function (index) {
					var that = $(this);
					sum += Number(that.val());
					aData["i_index"].push(index);
					aData["oddsid"].push(that.attr('data-id').split('_')[1]);
					aData["uPI_M"].push(that.val());
					aData["uPI_P"].push(that.attr('data-pl'));
				});
				$("#zjm").html( sum );
				actionRun();
			}
			function actionRun (argument) {
				subInit.orderData['i_index'] = aData["i_index"].join(',');
				subInit.orderData['oddsid'] = aData["oddsid"].join(',');
				subInit.orderData['phaseid'] = $("#NowJq").attr('data-id');
				subInit.orderData['uPI_M'] = aData["uPI_M"].join(',');
				subInit.orderData['uPI_P'] = aData["uPI_P"].join(',');
			}
			_this.myLayer({
				title: '確認下單',
				content: _tpls,
				isMiddle: true,
				isShowBtn: true,
				okCallBack: function (obj) {
					top.lastData[top.GamePage] = jQuery.extend(true, {}, iData);
					// 普通下单验证
					var isOk = false;
					$(".orderLayerInput").each(function () {
						var inThat = $(this);
						var inBigId = inThat.attr('data-id');
						var inThatVal = Number(inThat.val());
						if(!inThatVal){
							inThat.myxTips({
								content: '下注金額不能為空！'
							});
							isOk = false;
						}else if(inThatVal > Number(subInit.oddsData[ inBigId ]['max_amount'])){
							inThat.myxTips({
								content: '下注金額不能大於單注最大下注額度：' + ForDight(subInit.oddsData[ inBigId ]['max_amount'])
							});
							isOk = false;
						}else if(inThatVal < Number(subInit.oddsData[ inBigId ]['min_amount'])){
							inThat.myxTips({
								content: '下注金額不能小於單注最小下注額度：' + ForDight(subInit.oddsData[ inBigId ]['min_amount'])
							});
							isOk = false;
						}else{
							isOk = true;
						}
						return isOk;
					});
					var balance = 0;
					if(p.GamePath == 'L_SIX'){
						balance = Number(p.sixUsableCredit);
					}else{
						balance = Number(p.kcUsableCredit);
					}
					if(Number(sum) > balance){
						$("#zjm").myxTips({
							content: '余額不足!'
						});
					// }else if(Number(sum) > Number(subInit.oddsData[ inBigId ]['dq_max_amount'])){
					// 	$("#zjm").myxTips({
					// 		content: '下注金額不能大於單期額度：' + ForDight(subInit.oddsData[ inBigId ]['dq_max_amount'])
					// 	});
					}else{
						if(isOk){
							// 普通下单
							obj.find('.myLayerLoading').show();
							subInit.orderLoadAjax(function (d, isOk) {
								if(isOk == 'success'){
									$.myLayer.close(true);
									subInit.putinfo();
									$(".rightBox .tab_btn").eq(1).click();
								}else{
									if(d.success == '600'){
										var aIndex = d.data.index;
										var aPl = d.data.newpl;
										for(var i=0; i<aIndex.length;i++){
											var oIndex = aIndex[i];
											var oTr = $("#orderWrap tr").eq(oIndex);
											var oPl = oTr.find('.plShow');
											var bid = oPl.attr('data-id');
											var oldPl = Number(aData["uPI_P"][oIndex]);
											var NewPl = Number(aPl[i]);
											if(NewPl > aData["uPI_P"][oIndex]){
												oPl.addClass('plDown');
											}else{
												oPl.addClass('plUp');
											}
											oPl.html( NewPl + '<span>(' + ForDight4(NewPl - aData["uPI_P"][oIndex]) +')</span>');
											$("#order_" + bid).attr('data-pl', aPl[i]).focus();
											subInit.oddsData[ bid ]['pl'] = aPl[i];
											$("#odds_" + bid).html( aPl[i] );
											// 重新生成提交數據
											sumRun();
											// 提示信息
											oTr.myxTips({
												content: d.tipinfo
											});
										}
									}
									if(d.success == '500'){
										if(d.data.hasOwnProperty('index')){
											var aIndex = d.data.index;
											var oTr = $("#orderWrap tr").eq(Number(aIndex[0]));
											var oPl = oTr.find('.plShow');
											var bid = oPl.attr('data-id');
											$("#order_" + bid).focus();
											// 提示信息
											oTr.myxTips({
												content: d.tipinfo
											});
										}else{
											var tip = tips.msgTips({
												msg: d.tipinfo,
												type : "error"
											});
											$.myLayer.close(true);
										}
									}
									if(d.success == '400'){
										var tip = tips.msgTips({
											msg: d.tipinfo,
											type : "error"
										});
										$.myLayer.close(true);
									}
									obj.find('.myLayerLoading').hide();
								}
							});
						}
					}
				},
				openCallBack: function (obj) {
					obj.find('input').eq(0).focus();
					sumRun();
				}
			});
		};
		/*
		 * [連碼下單]
		 */
		$.fn.orderLmLayer = function (options) {
			var defaults = {
				bid: ''
			};
			var opts = $.extend({}, defaults, options);
			var _this = $(this);
			var bigId = opts.bid.split('_')[0];
			var numData = returnLmNumber(bigId);
			var inputHtml = '';
			var numType = ''
			var bNumber = numData.ballNumber;
			var oddsData = subInit.oddsData;
			var oddsDataPl = oddsData[opts.bid]['pl'];
			var uPI_WTArr = [];

			lastLmData = jQuery.extend(true, [], bNumber);

			function retrunWthtml(oddsDataPl) {
				var wtHtml = '';
				var wtLen = 0;
				var dWtArr = [];
				var noddsDataPl = subInit.oddsData[opts.bid]['pl'];
				uPI_WTArr = [];
				// 增加赔率微调显示
				for(var i=0; i<bNumber.length; i++){
					var wt = subInit.oddsData[opts.bid]['plx'][Number(bNumber[i]-1)];
					var myWt = wt;
					if(typeof(myWt) == "undefined"){
						myWt = 0;
					}
					uPI_WTArr.push(myWt);
					var na = '';
					if(bigId == '91030' || bigId == '91031' || bigId == '91032' || bigId == '91033' || bigId == '91058'){
						na = p.returnAnimal(Number(bNumber[i]));
					}else if(bigId == '91034' || bigId == '91035' || bigId == '91036' || bigId == '91059'){
						na = bNumber[i] + '尾';
					}else{
						na = bNumber[i];
					}
					if(typeof(wt) != "undefined" && wt != 0){
						wtLen++;
						if (noddsDataPl.indexOf(',') != -1) {
							dWtArr = noddsDataPl.split(',');
							wtHtml += '<p>含<span>'+ na +'</span>的單組賠率下調為<span>' + ForDight4(Number(dWtArr[0])+Number(wt))+'/'+ForDight4(Number(dWtArr[1])+Number(wt)) + '</span></p>';
						}else{
							wtHtml += '<p>含<span>'+ na +'</span>的單組賠率下調為<span>' + ForDight4(Number(noddsDataPl)+Number(wt)) + '</span></p>';
						}
					}
				}
				if(wtLen!=0){
					wtHtml = '<div class="lmWtWarp">' + wtHtml + '</div>';
				}else{
					wtHtml = '';
				}
				return wtHtml;
			}
			

			if(subInit.lmOdds.indexOf(',') == -1){
				inputHtml = '<div><em>'+ subInit.lmTitle +' @</em><strong id="lmPl">'+ subInit.lmOdds +'</strong> 每註金額：<input id="odds_lm_pl" class="input onlyNum" type="text" value=""></div>';
			}else{
				inputHtml = '<div><em>'+ subInit.lmTitle.split(',')[0] +' @</em><strong id="lmPl1">'+ subInit.lmOdds.split(',')[0] +'</strong><i class="fg">/</i><em>'+ subInit.lmTitle.split(',')[1] +' @</em><strong id="lmPl2">'+ subInit.lmOdds.split(',')[1] +'</strong></div>'+
							'<div>每註金額：<input id="odds_lm_pl" class="input onlyNum" type="text" value=""></div>';
			}
			if(subInit.playpage == 'six_lx' || subInit.playpage == 'six_ws'){
				switch (sixBet.radioLxIndex) {
					case 0:
						numType = '復式';
						break;
					case 1:
						numType = '膽拖';
						break;
					}
			}else{
				switch (sixBet.radioIndex) {
					case 0:
						numType = '復式';
						break;
					case 1:
						numType = '膽拖';
						break;
					case 2:
						numType = '生肖對碰';
						break;
					case 3:
						numType = '尾數對碰';
						break;
					case 4:
						numType = '混合對碰';
						break;
					}
			}
			var t = '號碼';
			if(sixBet.radioIndex == 2){
				t = '生肖';
			}else if(sixBet.radioIndex == 3){
				t = '尾數';
			}else if(sixBet.radioIndex == 4){
				t = '混合';
			}
			var _tpls = '<div class="lmSubmitWrap">'+
							'<div class="lsw_top">'+
								'<p>下注號碼明細</p>'+
								'<p class="myNos">'+ numData.numInfo +'</p>'+
							'</div>'+
							'<div id="wtWrapLm">'+
								retrunWthtml(oddsDataPl) +
							'</div>'+
							'<div>您共選擇了<span>'+ numData.numLen +'</span>個'+ t +'<br>‘'+ numType +'’共分為<span>'+ subInit.lmGroup +'</span>組，每注最高可下注金額<span>'+ subInit.lmMax +'</span>元。 </div>'+
							 inputHtml +
							'<div>总金额：<span id="sumCount">0</span></div>'+
						'</div>';

			var wrap = $("#myWarp");
			wrap.undelegate('#odds_lm_pl');
			wrap.delegate('#odds_lm_pl', 'keyup', function () {
				var v = $(this).val();
				$("#sumCount").html( ForDight2(v*subInit.lmGroup));
			});
			_this.myLayer({
				title: '確認下單',
				content: _tpls,
				isMiddle: true,
				isShowBtn: true,
				okCallBack: function (obj) {
					var input = $("#odds_lm_pl");
					var inputVal = ForDight(input.val());
					var sumVal = inputVal*subInit.lmGroup;
					var lmtype = '';

					// 设置提交订单时所需赔率id
					if(parent.GamePath == 'L_SIX'){
						if(subInit.playpage == 'six_lm' || subInit.playpage == 'six_lm_b'){
							lmtype = sixBet.radioIndex;
						}else{
							lmtype = sixBet.radioLxIndex;
						}
						// 设置参数
						subInit.orderData['phaseid'] = $("#NowJq").attr('data-id');
						subInit.orderData['uPI_M'] = inputVal;
						subInit.orderData['uPI_P'] = subInit.lmOdds;
						subInit.orderData['uPI_TM'] = sumVal;
						subInit.orderData['uPI_WT'] = uPI_WTArr.join(',');
						subInit.orderData['lmtype'] = lmtype;
						subInit.orderData['numbers'] = numData.numSrc;
						subInit.orderData['oddsid'] = $("#gameSixLmTitle>li.active").attr('data-bid').split('_')[1];
					}else{
						// 设置参数
						subInit.orderData['phaseid'] = $("#NowJq").attr('data-id');
						subInit.orderData['uPI_M'] = inputVal;
						subInit.orderData['uPI_P'] = subInit.lmOdds;
						subInit.orderData['uPI_TM'] = sumVal;
						// subInit.orderData['uPI_WT'] = uPI_WTArr.join(',');
						subInit.orderData['LM_Type'] = 0;
						subInit.orderData['NoS'] = numData.numSrc;
						subInit.orderData['oddsid'] = $("#gameLmTitle>li.active").attr('data-bid').split('_')[1];
					}
					var UsableCredit = 0;
					if(p.GamePath == 'L_SIX'){
						UsableCredit = p.sixUsableCredit;
					}else{
						UsableCredit = p.kcUsableCredit;
					}
					if(input.val() == ''){
						input.myxTips({
							content: '下註金額不能為空!'
						});
					}else if(inputVal < subInit.lmMin){
						input.myxTips({
							content: '下注金額不能小於單注最小下注額度：' + subInit.lmMin
						});
					}else if(inputVal > subInit.lmMax){
						input.myxTips({
							content: '下注金額不能大於單注最大下注額度：' + subInit.lmMax
						});
					}else if(sumVal > subInit.lmTopMax){
						input.myxTips({
							content: '下註總金額不能大於最大下註總額度：' + subInit.lmTopMax
						});
					}else if(sumVal > Number(UsableCredit)){
						input.myxTips({
							content: '下註總金額不能大於可用金額：' + UsableCredit
						});
					}else{
						obj.find('.myLayerLoading').show();
						subInit.orderLoadAjax(function (d, isOk) {
							// subInit.oddsLoadAjax();
							if(isOk == 'success'){
								$.myLayer.close(true);
								subInit.putinfo();
								$(".rightBox .tab_btn").eq(1).click();
							}else{
								if(d.success == '600'){ 
									var aIndex = d.data.index;
									var aPl = d.data.newpl[0];
									if(d.data.newpl.length > 0){
										if(aPl.indexOf(',') == -1){
											$("#lmPl").html( aPl );
										}else{
											$("#lmPl1").html( aPl.split(',')[0] );
											$("#lmPl2").html( aPl.split(',')[1] );
										}
										subInit.lmOdds = aPl;
										subInit.oddsData[opts.bid]['pl'] = aPl;
									}

									if(d.data.hasOwnProperty('newwt')){
										var newwt = d.data.newwt.split('|');
										for(var i=0; i<newwt.length; i++){
											var newwtArr = newwt[i].split(',');
											subInit.oddsData[opts.bid]['plx'][Number(newwtArr[0]-1)] = newwtArr[1];
										}
									}

									$("#wtWrapLm").html(retrunWthtml(subInit.lmOdds));

									input.myxTips({
										content: d.tipinfo
									});

									subInit.oddsData[opts.bid]['pl'] = '';
									subInit.oddsLoadAjax();
								}
								if(d.success == '400'){
									var tip = tips.msgTips({
										msg: d.tipinfo,
										type : "error"
									});
									$.myLayer.close(true);
								}
								obj.find('.myLayerLoading').hide();
							}
						});
					}
				},
				openCallBack: function (obj) {
					obj.find('input').eq(0).focus();
				}
			});
		};
		/*
		 * [xTip插件]
		 */
		$.fn.myxTips = function (options) {
			var defaults = {
				content:'',
				times: 2000
			};
			var opts = $.extend({}, defaults, options);
			var _this = $(this);
			var _tpls = '<div id="myxTips">'+
							'<div id="myxTipsLeft"></div>'+
							'<div id="myxTipsContent">'+ opts.content +'</div>'+
						'</div>';

			var obj = $(_tpls);

			clearTimeout(xTipsTimer);

			$('#myxTips').remove();
			$('body').append( obj );

			var th = _this.innerHeight();
			var tw = _this.innerWidth();
			var ot = _this.offset().top;
			var oh = obj.height();
			var _top, _left;

			_top = ot - (oh-th)/2;
			_left = _this.offset().left + tw + 10;

			obj.css({
				left: _left,
				top: _top
			});

			_this.focus();

			xTipsTimer = setTimeout(function () {
				$('#myxTips').remove();
			}, opts.times);
		};
	}));

	function combination(b, a) {
		return factorial(b) / (factorial(a) * factorial(b - a));
	}
	function factorial(a) {
		if (a < 2) {
			return 1;
		} else {
			return a * factorial(a - 1);
		}
	}
	// 返回连码下注注数
	function retrunLmCount(bigId) {
		var data = subInit.lmActiveData;
		var count = 0;
		var index = [];
		subInit.lmGroup = 0;
		for(var key in data){
			if(!!data[key]){
				count++;
				index.push(key);
			}
		}
		// 获取连码配置
		var lmConfig = top.configLm[bigId];
		var myBigId = bigId.split('_')[0];
		// 获取组数
		switch( bigId )
		{
			case '73_0': // 选二连直
			case '73_3': // 选二连直
			case '73_14': // 选二连直
				for(var j=1; j<=20; j++){
					var k1 = data[myBigId+'_'+j] && j;
					for(var q=21; q<=40; q++){
						var k2 = data[myBigId+'_'+q] && q-20;
						if(k1 != k2 && (k1 && k2)){
							subInit.lmGroup++;
						}
					}
				}
				break;
			case '76_0': // 选三前直
			case '76_3': // 选三前直
			case '76_14': // 选三前直
				for(var j=1; j<=20; j++){
					var k1 = data[myBigId+'_'+j] && j;
					if (!k1){continue};
					for(var q=21; q<=40; q++){
						var k2 = data[myBigId+'_'+q] && q-20;
						if (!k2){continue};
						// if(k1 != k2 && (k1 && k2)){
							for(var m=41; m<=60; m++){
								var k3 = data[myBigId+'_'+m] && m-40;
								if (!k3){continue};
								if(k1 != k3 && k2 != k3 && k2 != k1){
									subInit.lmGroup++;
								}
							}
						// }
					}
				}
				break;
			case '91016_100':
			case '91017_100':
			case '91018_100':
			case '91019_100':
			case '91020_100':
			case '91060_100':
			case '91061_100':
			case '91062_100':
			case '91063_100':
			case '91064_100':
			case '91031_100':
			case '91032_100':
			case '91033_100':
			case '91058_100':
			case '91034_100':
			case '91035_100':
			case '91036_100':
			case '91059_100':
				if(sixBet.radioIndex == 2 || sixBet.radioIndex == 3 || sixBet.radioIndex == 4){
					if(index.length == 2){
						var a1 = sixBet.sixLmZMData[index[0]].split(',');
						var a2 = sixBet.sixLmZMData[index[1]].split(',');
						for(var j=0; j<a1.length; j++){
							for(var q=0; q<a2.length; q++){
								if(a1[j]!=a2[q]){
									subInit.lmGroup++;
								}
							}
						}
					}
				}else if(sixBet.radioIndex == 1 || sixBet.radioLxIndex == 1){
					var dtLen = 0;
					for(var key in subInit.lmDtData){
						dtLen++;
					}
					subInit.lmGroup = index.length - dtLen;
				}else{
					subInit.lmGroup = combination(count, Number(lmConfig['minLen']));
				}
				break;
			default:
				// 其他
				subInit.lmGroup = combination(count, Number(lmConfig['minLen']));
		}

		var sixObj = $("#gameSixLmBox>dd.active .radioSim:not(.radioPoint)");
		var obj = $(".radioSim:not(.radioPoint)");

		// 处理超限
		if(subInit.playpage == 'six_lm' || subInit.playpage == 'six_lm_b'){
			if(sixBet.radioIndex == 2 || sixBet.radioIndex == 3 || sixBet.radioIndex == 4){ // 对碰
				if(subInit.lmGroup >= 1){
					closeRadio(sixObj);
				}else{
					openRadio(sixObj);
				}
			}else{
				if(subInit.lmGroup >= lmConfig['maxLen']){
					closeRadio(sixObj);
				}else{
					openRadio(sixObj);
				}
			}
		}else{
			if(subInit.lmGroup >= lmConfig['maxLen']){
				closeRadio(obj);
			}else{
				openRadio(obj);
			}
		}
		console.log(subInit.lmGroup)
		isSubmitOk(subInit.lmGroup);
	}

	function isSubmitOk (group) {
		var gameSubmit = $("#gameSubmit");
		if (group>=1) {
			gameSubmit.removeAttr('disabled').removeClass('disSubmit');
		}else{
			gameSubmit.attr('disabled', true).addClass('disSubmit');
		}
	}

	function closeRadio(obj) {
		obj.each(function () {
			$(this).addClass('radiodsable');
			subInit.lmActiveData[$(this).attr('data-id')] = false;
		});
	}
	function openRadio(obj) {
		obj.each(function () {
			$(this).removeClass('radiodsable');
			delete subInit.lmActiveData[$(this).attr('data-id')];
		});
	}

	// 返回连码下注号码明细
	function returnLmNumber (bigId) {
		var numAttr = [];
		var numDtAttr =[];
		var numInfo = '';
		var numSrc = '';
		var numLen = 0;
		var numData = {};
		var bigIdAttr = [];
		var ballNumber = [];
		var numAttr1 = [];
		var numAttr2 = [];
		var numAttr3 = [];

		var data = subInit.lmActiveData;
		var dtData = subInit.lmDtData;
		for(var key in data){
			// var bigId = key.split('_')[0];
			var sId = Number(key.split('_')[1]);

			switch( bigId )
			{
				case '73':
					if(!!data[key]){
						if(sId>20){
							sId = sId - 20;
							numAttr2.push( sId );
						}else{
							numAttr1.push( sId );
						}
						numAttr.push( sId );
					}
					break;
				case '76':
					if(!!data[key]){
						if(sId>20 && sId<=40){
							sId = sId - 20;
							numAttr2.push( sId );
						}else if(sId>40){
							sId = sId - 40;
							numAttr3.push( sId );
						}else{
							numAttr1.push( sId );
						}
						numAttr.push( sId );
					}
					break;
				case '91016':
				case '91017':
				case '91018':
				case '91019':
				case '91020':
				case '91060':
				case '91061':
				case '91062':
				case '91063':
				case '91064':
				case '91031':
				case '91032':
				case '91033':
				case '91058':
				case '91034':
				case '91035':
				case '91036':
				case '91059':
					if(sixBet.radioIndex == 1 || sixBet.radioLxIndex == 1){
						// numAttr.push( sId );
						if(!!dtData[key]){
							numDtAttr.push( sId );
						}
						if(!!data[key]){
							numAttr.push( sId );
						}
					}else if(sixBet.radioIndex == 4 || sixBet.radioIndex == 3 || sixBet.radioIndex == 2){
						if(!!data[key]){
							numAttr.push( sId );
							bigIdAttr.push( sixBet.sixLmZMData[key] );
						}
					}else{
						if(!!data[key]){
							numAttr.push( sId );
						}
					}
					break;
				default:
					if(!!data[key]){
						numAttr.push( sId );
					}
			}
			if(!!data[key]){
				numLen++;
			}
		}
		var sxwsAttr = [];
		if(sixBet.radioIndex == 1 || sixBet.radioLxIndex == 1){ //胆拖
			var a = Array.complement(numDtAttr, numAttr);
			var nameAttr1 = [];
			var nameAttr2 = [];
			numDtAttr = quickSort(numDtAttr);
			a = quickSort(a.uniquelize());
			if(bigId == '91031' || bigId == '91032' || bigId == '91033' || bigId == '91058'){ //六肖-生肖连胆拖
				// numDtAttr = quickSort(numDtAttr);
				for(var i=0; i<numDtAttr.length; i++){
					nameAttr1.push(p.returnAnimal(Number(numDtAttr[i])));
				}
				// a = quickSort(a);
				for(var i=0; i<a.length; i++){
					nameAttr2.push(p.returnAnimal(Number(a[i])));
				}
				numInfo = nameAttr1.join('、')+'<span class="dtText">拖</span>'+ nameAttr2.join('、');
			}else if(bigId == '91034' || bigId == '91035' || bigId == '91036' || bigId == '91059'){ //六肖-尾数连胆拖
				// numDtAttr = quickSort(numDtAttr);
				for(var i=0; i<numDtAttr.length; i++){
					var z1 = Number(numDtAttr[i]);
					nameAttr1.push((z1==10?0:z1)+'尾');
				}
				// a = quickSort(a);
				for(var i=0; i<a.length; i++){
					var z2 = Number(a[i]);
					nameAttr2.push((z2==10?0:z2)+'尾');
				}
				numInfo = nameAttr1.join('、')+'<span class="dtText">拖</span>'+ nameAttr2.join('、');
			}else{
				numInfo = numDtAttr.join('、')+'<span class="dtText">拖</span>'+ a.join('、');
			}
			numSrc = numDtAttr.join(',')+'|'+a.join(',');
			ballNumber = numDtAttr.concat(a);
		}else if(sixBet.radioIndex == 4 || sixBet.radioIndex == 3 || sixBet.radioIndex == 2){
			var nameAttr = [];
			if(sixBet.radioIndex == 4){ //混合对碰
				for(var i=0;i<numAttr.length;i++){
					var lastNa = numAttr[i];
					if(lastNa>12){
						var z = Number(lastNa)-12;
						nameAttr[i] = ((z==10?0:z)+'尾');
					}else{
						nameAttr[i] = (p.returnAnimal(Number(lastNa)));
					}
				}
			}else if(sixBet.radioIndex == 3){ //尾数对碰
				for(var i=0;i<numAttr.length;i++){
					var lastNa = numAttr[i];
					var z = Number(lastNa);
					nameAttr[i] = ((z==10?0:z)+'尾');
				}
			}else if(sixBet.radioIndex == 2){ //生肖对碰
				for(var i=0;i<numAttr.length;i++){
					var lastNa = numAttr[i];
					nameAttr[i] = (p.returnAnimal(Number(lastNa)));
				}
			}
			numSrc = numAttr[0]+','+numAttr[1];

			var bia0 = $.map(bigIdAttr[0].split(','), function (value) {
				return Number(value);
			});
			var bia1 = $.map(bigIdAttr[1].split(','), function (value) {
				return Number(value);
			});

			bia0 = quickSort(bia0);
			bia1 = quickSort(bia1);

			numInfo = '『'+ nameAttr[0] +'』'+ bia0.join('、') + '<span class="dtText">对碰</span>' + '『'+ nameAttr[1] +'』'+ bia1.join('、');
			ballNumber = (bigIdAttr[0]+ ',' +bigIdAttr[1]).split(',');
		}else if( (sixBet.radioIndex == 0 || sixBet.radioLxIndex == 0) && (bigId == '91030' || bigId == '91031' || bigId == '91032' || bigId == '91033' || bigId == '91058') ){ //六肖生肖连，六肖一中
			numAttr = quickSort(numAttr);
			for(var i=0; i<numAttr.length;i++){
				sxwsAttr.push(p.returnAnimal(Number(numAttr[i])));
			}
			numInfo = sxwsAttr.join('、');
			numSrc = numAttr.uniquelize().join(',');
			ballNumber = numAttr;
		}else if( (sixBet.radioIndex == 0 || sixBet.radioLxIndex == 0) && (bigId == '91034' || bigId == '91035' || bigId == '91036' || bigId == '91059') ){ //六肖尾数连
			numAttr = quickSort(numAttr);
			for(var i=0; i<numAttr.length;i++){
				sxwsAttr.push((Number(numAttr[i])==10 ? 0 : numAttr[i]) +'尾');
			}
			numInfo = quickSort(sxwsAttr).join('、');
			numSrc = numAttr.uniquelize().join(',');
			ballNumber = numAttr;
		}else if(bigId == '73'){ // 快彩连码
			var na1 = quickSort(numAttr1);
			var na2 = quickSort(numAttr2);
			numInfo = na1.join('、')+'|'+na2.join('、');
			numSrc  = na1.join(',')+'|'+na2.join(',');
			ballNumber = na1.concat(na2);
		}else if(bigId == '76'){ // 快彩连码
			var na1 = quickSort(numAttr1);
			var na2 = quickSort(numAttr2);
			var na3 = quickSort(numAttr3);
			numInfo = na1.join('、')+'|'+na2.join('、')+'|'+na3.join('、');
			numSrc = na1.join(',')+'|'+na2.join(',')+'|'+na3.join(',');
			ballNumber = na1.concat(na2).concat(na3);
		}else{
			var na = quickSort(numAttr);
			numInfo = na.join('、');
			numSrc = na.join(',');
			ballNumber = na;
		}
		numData = {
			ballNumber: ballNumber.uniquelize(),
			numInfo: numInfo,
			numSrc: numSrc,
			numLen: numLen
		};
		return numData;
	}

	module.exports = subInit;
});

