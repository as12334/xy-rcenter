define(function(require, exports, module) {

	var $ = require('jquery');
	// 引入tips插件
	var tips = require('tips');
	
	var ajaxObj = {};
	var console = console || {log:function(){return false;}};

	(function($) {

		// jQuery on an empty object, we are going to use this as our Queue
		var ajaxQueue = $({});

		$.ajaxQueue = function( ajaxOpts ) {
			var jqXHR,
				dfd = $.Deferred(),
				promise = dfd.promise();

			// run the actual query
			function doRequest( next ) {
				jqXHR = $.ajax( ajaxOpts );
				jqXHR.done( dfd.resolve )
					.fail( dfd.reject )
					.then( next, next );
			}

			// queue our ajax request
			ajaxQueue.queue( doRequest );

			// add the abort method
			promise.abort = function( statusText ) {

				// proxy abort to the jqXHR if it is active
				if ( jqXHR ) {
					return jqXHR.abort( statusText );
				}

				// if there wasn't already a jqXHR we need to remove from queue
				var queue = ajaxQueue.queue(),
					index = $.inArray( doRequest, queue );

				if ( index > -1 ) {
					queue.splice( index, 1 );
				}

				// and then reject the deferred
				dfd.rejectWith( ajaxOpts.context || ajaxOpts, [ promise, statusText, "" ] );
				return promise;
			};

			return promise;
		};

	})(jQuery);
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
		this._type = params._type || "POST";
		this.dataType = params.dataType;
		this.completeCallBack = params.completeCallBack || function () {};
		this.successCallBack = params.successCallBack || function () {};
		this.errorCallBack = params.errorCallBack || function () {};
		this.otherErrorCallBack = params.otherErrorCallBack || function () {};
		this.oddsErrorCallBack = params.oddsErrorCallBack || function () {};
		this.endCallBack = params.endCallBack || function () {};
		this.async = params.async || true;
		this.getBaseDataAjaxHandle();
	}
	getBaseDataAjax.prototype.getBaseDataAjaxHandle = function () {
		var that = this, tip = null, thatUrl = '', obj;
		var self = arguments.callee;
		that.postData.oldId = top.oldId;
		that.postData.playpage = top.playpage;
		that.postData.browserCode = top.browserCode;

		if(!!window.isNewBet){
			// 处理实时滚单
			thatUrl = that.url;
		}else{
			// 处理其他接口
			thatUrl = '/'+ top.pathFolder +'/' + that.url;
		}
		if (ajaxObj.hasOwnProperty(that.postData.action) && (that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad') && ajaxObj[that.postData.action].readyState != 4 && ajaxObj[that.postData.action].readyState != 'undefined') {
			ajaxObj[that.postData.action].abort();
		}
		ajaxObj[that.postData.action] = $.ajaxQueue({
			url: thatUrl,
			data: that.postData,
			type: that._type,
			cache: false,
			dataType: that.dataType,
			timeout: 5000,
			async: that.async,
			complete: function(XMLHttpRequest, status){
				if(status == 'timeout'){
					if(typeof that.completeCallBack == "function"){
						that.completeCallBack();
					}else{
						console.log('Plaese add completeCallBack Function for getBaseDataAjaxHandle!');
					}
				}
				if(status == 'timeout'){
					if (that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad') {
						setTimeout(function () {
							self.call(that);
						}, 5000);
					}
				}
			},
			success: function(data) {
				try{
					if(data.data){
						if(data.data.hasOwnProperty('maxidvalid')){
							top.oldId = data.data.maxidvalid;
						}
					}
					if(typeof that.successCallBack == "function" || typeof that.otherErrorCallBack == "function" || typeof that.oddsErrorCallBack == "function" ){

						// 公用
						// 200:成功
						// 300:未登录
						// 400:失败,错误信息提示时关闭当前窗口
						// 600:赔率有变动
						// 500:错误信息显示当前窗口
						//
						// (删)700:密碼已經被修改，請重新登陸！
						// (删)800:您的賬號已經被停用，請聯繫管理員！
						// (删)900:賬號已經被凍結!
						// (增)100:踢人,冻结,停用
						// (增)150:同一个用户不同时登录,需要跳转到指定页面

						if (data.success == 200) {
							that.successCallBack( data );
						}else if(data.success == 100){ // 踢人,冻结,停用
							top.location.href = "/";
						}else if(data.success == 150){ // 同一个用户不能同时登录,跳转到指定页面
							top.location.href = data.data.turl.url;
						}else if(data.success == 300){ //300 未登錄
							top.location.href = "/";
						}else if(data.success == 400){ //400 其他错误单独处理
							that.otherErrorCallBack( data );
						}else if(data.success == 500){ //500 错误信息显示当前窗口
							tip = tips.msgTips({
								msg: data.tipinfo,
								type : "error"
							});
						}else if(data.success == 600){ //600 赔率变动
							that.oddsErrorCallBack( data );
						}else{
							tip = tips.msgTips({
								msg: data.tipinfo,
								type : "error"
							});
						}
					}else{
						console.log('Plaese add successCallBack otherErrorCallBack and oddsErrorCallBack Function for getBaseDataAjaxHandle!');
					}
				}catch(error){

					if (top.ajaxErrorLogSwitch) {
						$.ajax({
							url: '/ViewLog/LogAjaxException.aspx',
							data: {
								'url': that.url,
								'action': that.postData.action,
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
				if (that.postData.action == 'get_oddsinfo' || that.postData.action == 'get_ad') {
					setTimeout(function () {
						self.call(that);
					}, 5000);
				}
				
			}
		}).done(function () {
			if(!that.endCallBack){
				return;
			}
			if(typeof that.endCallBack == "function"){
				that.endCallBack();
			}else{
				console.log('Plaese add endCallBack Function for getBaseDataAjaxHandle!');
			}
		});

		return obj;
	};

	module.exports = getBaseDataAjax;

});
