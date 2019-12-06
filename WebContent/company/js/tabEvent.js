define(function(require, exports, module) {

	var $  = require('jquery');
	// var myFixed = require('fixed');
	// tabEvent插件
	var tabEvent = function (i, callBack) {
		var pt = window.top;
		var p = window.parent;
		var dialog = top.dialog.get(window);
		(function (i) {
			if($(".tabBtn").eq(0).attr('data-show') == 'true'){
				i = 0;
			}
			$(".tabBtn").removeClass('on');
			$(".tabBtn").eq(i).addClass("on");
			$(".tabBox").eq(i).show().addClass('tabBoxOn');
			if(!!dialog){
				// p.$.myLayer.setSize(true, true, false, top.myLayerIndex);
				dialog.height($('body').height());
				dialog.width($('body').width());
				$(dialog.iframeNode).height($('body').height());
				dialog.reset();     // 重置对话框位置
			}else{
				pt.setIframeHeight();
			}
			// myFixed();
		})(i);

		$(".tabBtn").click(function () {
			var i = $(this).index();
			$('#myxTips').remove();
			$(".tabBtn").removeClass('on');
			$(this).addClass("on");
			$(".tabBox").hide().removeClass('tabBoxOn');
			$(".tabBox").eq(i).show().addClass('tabBoxOn');
			if (typeof callBack == 'function' ) {
				callBack(i);
			}
			if(!!dialog){
				// p.$.myLayer.setSize(true, true, false, top.myLayerIndex);
				dialog.height($('body').height());
				dialog.width($('body').width());
				$(dialog.iframeNode).height($('body').height());
				dialog.reset();     // 重置对话框位置
			}else{
				pt.setIframeHeight();
			}
			// myFixed();
		});
	};

	module.exports = tabEvent;

});
