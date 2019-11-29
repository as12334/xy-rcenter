
define(function(require, exports, module) {

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
				if(data.status == 600){
					window.location.reload();
				}
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
