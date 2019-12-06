define(function(require, exports, module){

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
					'top': 200 + $(top.document).scrollTop(),
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