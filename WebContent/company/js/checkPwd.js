define(function(require, exports, module) {

	var $ = require('jquery');

	// /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/.test()
	if (isOpenUpper == '1') {
		$(".passwordTip").html('8-20位,且必需包含大写字母、小写字母和数字！');
	}else{
		$(".passwordTip").html('8-20位,且必需包含字母和数字！');
	}
	
	(function($) {
		window.PasswordUtil = {
				M_STR: {
					UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
					LOWER: "abcdefghijklmnopqrstuvwxyz",
					NUMBER: "0123456789",
					CHARACTER: "!@#$%^&*?_~/\\(){}[]<>.-+=|,"
				},
				analyzePwd:function(password){
					var score = this.getScore(password);
					//修改样式
					var target =  $('.passwordStrength');
					target.find("span").removeClass("bgStrength");
					if(score < 25 && score >= 0){
						target.find("span:first").addClass("bgStrength");
					}else if(score >=25 && score <= 45){
						target.find("span:lt(2)").addClass("bgStrength");
					}else if(score > 45){
						target.find("span:lt(3)").addClass("bgStrength");
					}
					target.show();
				},
				getScore:function(password){
					var score = 0;
					var lenght = password.length;
					if(lenght >= 8 && lenght < 9){
						score += lenght;
					}else if(lenght >= 9 && lenght <= 10){
						score += 12;
					}else if(lenght > 10){
						score += 18;
					}
					var upper = this.countContain(password, this.M_STR.UPPER);
					if(upper > 0) score += 5;
					var lower = this.countContain(password, this.M_STR.LOWER);
					if(lower > 0) score += 1;
					var number = this.countContain(password, this.M_STR.NUMBER);
					if(number > 0) score += 5;
					if(number > 3) score += 7;
					var character = this.countContain(password, this.M_STR.CHARACTER);
					if(character > 0){
						if(character == 1){
							score += 5;
						}else{
							score += 12;
						}
					}
					if(upper > 0 && lower > 0) score += 2;
					if(upper > 0 && lower > 0 && number > 0) score += 3;
					if(upper > 0 && lower > 0 && number > 0 && character > 0) score += 3;
					return score;
				 },
				 countContain:function(password, m_str){
					var count = 0;
					for (i = 0; i < password.length; i++) m_str.indexOf(password.charAt(i)) > -1 && count++;
					return count;
				 }
		 };

		// 创建 PassPortUtil 的别名
		window.$pwd = window.PasswordUtil;
	})(window.jQuery);


	//TODO 验证密码
	var checkPwd = {
		/**
		 * str 字符串常量
		 * @private
		 */
		str: {
			UPPER : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			LOWER : "abcdefghijklmnopqrstuvwxyz",
			NUMBER : "0123456789",
			CHARACTER : "~`!@#$%^&*()_-+={}[]|;:,<>.?/"
		},
		msg: {
			msg0 : "请输入8-20个字符",
			msg1 : "只能包含字母、数字以及标点符号（除空格）",
			msg2 : "必需包含字母、数字！",
			msg3 : "输入特殊符号，增加密码强度!",
			msg4 : "必需包含大写字母、小写字母和数字！"
		},
		allStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()_-+={}[]|;:,<>.?/",
		/**
		 * 对应校验条目
		 * @type {Object}
		 */
		checkItem1: function(value){
			if(value == ""){
				return 0;
			}else{
				if(value.length < 8 || value.length > 20){
					return 0;
				}else{
					return 1;
				}
			}
		},
		checkItem2: function(value){
			if(value == ""){
				return 0;
			}else{
				var item2Result = true;
				for (i = 0; i < value.length; i++) {
					if (this.allStr.indexOf(value.charAt(i)) < 0) {
						item2Result = false;
					}
				}
				if(item2Result){
					return 1;
				}else{
					return 0;
				}
			}
		},
		checkItem3: function(value){
			if(value == ""){
				return 0;
			}else{
				var item3Result = {UPPER:0,LOWER:0,NUMBER:0,CHARACTER:0};
				for (j in this.str) {
					var strKey = j;
					var strValue = this.str[strKey];
					for (k = 0; k < value.length; k++) {
						if (strValue.indexOf(value.charAt(k)) > -1) {
							item3Result[strKey] = 1;
						}
					}
				}
				if (isOpenUpper == '1') {
					if(item3Result.LOWER + item3Result.NUMBER + item3Result.UPPER == 3){
						return 1;
					}else{
						return 0;
					}	
				}else{
					if(item3Result.LOWER + item3Result.NUMBER == 2){
						return 1;
					}else{
						return 0;
					}	
				}
			}
		},
		init : function(obj){
			var that = this;
			var value = obj.val();
			var endMsg = '';
			if (isOpenUpper == '1') {
				endMsg = that.msg.msg4;
			}else{
				endMsg = that.msg.msg2;
			}

			if ( obj.attr("data-empty") == "true" && value == '' ) {
				$(".passwordTip").html(endMsg).removeClass("tipsWrong");
				$('.passwordStrength span').removeClass("bgStrength");
				return true;
			}else{
				if(that.checkItem1(value) == 0){
					$(".passwordTip").html(that.msg.msg0).removeClass("tipsRight").addClass("tipsWrong");
					$('.passwordStrength span').removeClass("bgStrength");
					return false;
				}else if(that.checkItem2(value) == 0){
					$(".passwordTip").html(that.msg.msg1).removeClass("tipsRight").addClass("tipsWrong");
					return false;
				}else if( that.checkItem3(value) == 0){
					$(".passwordTip").html(endMsg).removeClass("tipsRight").addClass("tipsWrong");
					return false;
				}else{
					$(".passwordTip").html(that.msg.msg3).removeClass("tipsWrong");
					$pwd.analyzePwd(value);
					return true;
				}
			}
		}
	};
	// checkPwd.init();

	module.exports = checkPwd;

});
