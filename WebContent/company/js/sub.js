define(function (require, exports, module) {
	var $  = require('jquery');
	require('plus')($);

	var t = window.top;
	var oBody = $("body");
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

	oBody.onlyNumber({
		className: '.onlyMinNum',
		isDecimal: false,
		isMinus: true
	});

	t.setIframeHeight();

	var ajaxLoading = {
		// 设置
		setAjaxLoading: function () {
			var wh = $(document).height();
			var html = '<div id="ajaxLoading" style="height:'+ wh +'px; top:100px"></div>';
			var h = top.document.getElementById("mainIframe").contentWindow.location.href;
			h = h.toLowerCase();
			// 针对报表查询单独处理
			if (h.indexOf("report.aspx") != -1 || h.indexOf("awardperiod.aspx") != -1) {
				if ($("#ajaxLoading").length == 0) {
					$('body').append('<div id="ajaxLoading" style="height:'+ wh +'px;"></div>');
				}
			}else{
				if($("#ajaxLoading", top.document).length == 0){
					$('body', top.document).append(html);
				}
			}
		},
		setIframeLoading: function () {
			var wh = $(document).height();
			var html = '<div id="ajaxLoading" style="height:'+ wh +'px;"></div>';
			if($("#ajaxLoading").length == 0){
				$('body').append(html);
			}
		},
		// 删除
		removeAjaxLoading: function () {
			$("#ajaxLoading", top.document).remove();
			$("#ajaxLoading").remove();
		},
		dialogReset: function () {

			try{
				var dialog = top.dialog.get(window);
				dialog.height($('body').height());
		    	dialog.width($('body').width());
				$(dialog.iframeNode).height($('body').height());
				dialog.reset();     // 重置对话框位置
			}catch(error){}
		}
	};

	module.exports = ajaxLoading;

});
