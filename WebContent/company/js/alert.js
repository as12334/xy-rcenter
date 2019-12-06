define(function(require, exports, module) {

	var $  = require('jquery');

	// 引入myLayer插件
	require('myLayer')($);

	var myAlert = function (opts) {
		var defaults = {
			content: opts.content || '',
			okCallBack: opts.okCallBack || function () {},
			closeCallBack: opts.closeCallBack || function () {},
			openCallBack: opts.openCallBack || function () {},
			isShowBtn: opts.isShowBtn,
			url: opts.url,
			title: opts.title || '提示信息'
		}

		$("body").myLayer({
			title: defaults.title,
			content: defaults.content,
			isShowBtn: defaults.isShowBtn,
			isMiddle: true,
			url: defaults.url,
			okText: '確定',
			okCallBack: function () {
				if(typeof defaults.okCallBack == "function"){
					defaults.okCallBack();
				}
				$.myLayer.close(true);
			},
			closeCallBack: function () {
				if(typeof defaults.closeCallBack == "function"){
					defaults.closeCallBack();
				}
			},
			openCallBack: function () {
				if(typeof defaults.openCallBack == "function"){
					defaults.openCallBack();
				}
			}
		});
	};

	module.exports = myAlert;
});
