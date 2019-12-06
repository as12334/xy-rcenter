define(function(require,exports,moudles){
	 return function(jquery){
		 (function($) {
			/*
			 * [弹窗控件]
			 */
			var ie6 = !-[1,]&&!window.XMLHttpRequest;
			Array.prototype.indexOf = function(val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i; } return -1; };
			Array.prototype.remove = function(val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1); } };
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

			
			// mylayer 构造函数 
			$.fn.myLayer = function (options) {
				var defaults = {
					title: '提示信息',
					content: '',
					url: '',
					isMiddle: false,
					isShowBtn: true,
					okText: '提交',
					width: '',
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
				window.top.myLayerIndex++;
				var mli = window.top.myLayerIndex;
				window.top.myLayerIndexArr.push(mli+'');
				$.myLayer.that = _this;
				var titleClass = '';
				var dh = $(document).height();
				$.myLayer.oMyLayerContentWidth = 0;
				$.myLayer.oMyLayerContentHeight = opts.height ? opts.height : 0;

				$('.myLayer[data-isMiddle=false]').remove();

				if($("#myWarp").length == 0){
					$("body").append('<div id="myWarp"></div>');
				}
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
				var oMyLayerContent = $(".myLayerContent");


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
						$.myLayer.setSize(opts.isMiddle, true, false, window.top.myLayerIndex);
						if($(this)[0].contentWindow.fixed){
							$(this)[0].contentWindow.fixed();
						}
					});
				}
				$.myLayer.width = opts.width;
				$.myLayer.setSize(opts.isMiddle, false, false, window.top.myLayerIndex);
				$(window.top).unbind('myScroll');
				if(opts.isMiddle){
					var isIframe = false;
					if(!!opts.url){
						isIframe = true;
					}

					if(!isMobile) {
						$(window.top).bind('scroll',function () {
							$(this).trigger('myScroll');
						});
						$(window.top).bind('myScroll', function () {
							$.myLayer.setSize(opts.isMiddle, isIframe, true, window.top.myLayerIndex);
						});
					}
				}

				var topMask = '<div id="iframeTopMask" style="width:'+ $(document).width() +'px"></div>';

				if(opts.openCallBack){
					opts.openCallBack(obj);
					if(top != self && opts.isMiddle){
						if($("#iframeTopMask", top.document).length == 0){
							$("body", top.document).append(topMask);
						}
					}
				}

				oMyLayer.find(".myLayerCancel, .myLayerClose").unbind('click').bind('click', function (event) {
					var i = $(this).parents('.myLayer').eq(0).attr('data-index');
					$.myLayer.close(true, i);
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

			};

			// mylayer方法

			$.myLayer = {
				that: null,
				isFirst: true,
				oMyLayerContentWidth: 0,
				oMyLayerContentHeight: 0,
				width: '',
				showLoading: function () {
					$('#myLayer_'+ window.top.myLayerIndex + " .myLayerLoading").show();
				},
				hideLoading: function () {
					$('#myLayer_'+ window.top.myLayerIndex + " .myLayerLoading").hide();
				},
				close: function (b, mli) {
					if (mli == undefined) {
						mli = window.top.myLayerIndex;
					}
					if (mli) {
						window.top.myLayerIndexArr.remove(mli);
					}
					var am = window.top.myLayerIndexArr;
					if(top.location != self.location && am.length == 0){
						$("#iframeTopMask", top.document).remove();
					}
					if(b && mli == undefined){
						if(top.location != self.location){
							$("#iframeTopMask", top.document).remove();
						}
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
					if (am.length == 0) {
						$("#myWarp").html('');
						$("#myWarp", parent.document).html('');
						$(window.top).unbind('myScroll');
						// $(document).unbind('mousemove');
						// $(document).unbind('mouseup');
					}else{
						var a = window.top.myLayerIndex, c = 19841011;
						for (var i = 0; i < am.length; i++) {
							c = am[i];
							if (c > a) {
								c = a;
							}
						};
						top.myLayerIndex = c;
					}
					$.myLayer.oMyLayerContentHeight = 0;
				},
				setSize:function(isMiddle, isIframe, isMyScroll, mli) {
					if (mli == undefined) {
						mli = window.top.myLayerIndex;
					}
					var oMyLayer = $('#myLayer_'+ mli);
					var oMyLayerContent = oMyLayer.find(".myLayerContent");
					var wh = $(top).height();
					var dh = $(document).height();
					var dw = $(document).width();
					var _this = $.myLayer.that;
					var th = _this.innerHeight();
					var tw = _this.innerWidth();
					var isSetWH = false;
					var ch = $.myLayer.oMyLayerContentHeight;

					if ($.myLayer.width) {
						isSetWH = true;
						oMyLayerContent.css({
							'width': dw * $.myLayer.width
						});
					}
					// if (!isMyScroll) {

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
							if (!isMyScroll) {
								oIframe.css({
									'width': oIframeWidth,
									'height': oIframeHeight
								});
							}
							if (ch > oIframeHeight) {
								ch = 0;
							}
							if (!isSetWH) {
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
								if (!isMyScroll) {
									oMyLayerContent.css({
										'height': ch ? ch : 'auto',
										'width': cw
									});
								}
							}else{
								if(oIframeHeight >= (wh - 200)){
									cw = dw * $.myLayer.width + 18;
								}else{
									cw = dw * $.myLayer.width;
								}
								if (!isMyScroll) {
									oMyLayerContent.css({
										'height': ch ? ch : 'auto',
										'width': cw
									});
									oIframe.css({
										'width': dw * $.myLayer.width
									});
								}
							}
						}else{
							if(!isMyScroll && !isSetWH){
								var layerWidth = oMyLayerContent.outerWidth();
								if(oMyLayerContent.height() >= (wh-200)){
									oMyLayerContent.css({
										// 'width': oMyLayerContent.outerWidth() + 18
										'width': layerWidth
									});
								}
							}
						}
					// }
					// if (!isSetWH) {
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
					// }
					var _top, _left, _mTop, _mLeft;

					var oh = oMyLayer.height();
					var ow = oMyLayer.width();
					if(!isMiddle){
						var ot = _this.offset().top;
						if(wh - ot - th <= oh){
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
					if (isMobile) {
						if ($.myLayer.isFirst) {
							oMyLayer.css({
								'left': _left + _mLeft,
								'top': '20px'
							});
						}
					}else{
						oMyLayer.css({
							'left': _left + _mLeft,
							'top': _top + _mTop
						}).show();
					}
					if (ie6) {
						oMyLayer.find(".myLayerLoading").css({
							'height': oMyLayer.height()
						});
					}
					$.myLayer.isFirst = false;
			
					oMyLayer.find(".myLayerOk").focus();
				}
			};
		})(jquery);
	};
});
