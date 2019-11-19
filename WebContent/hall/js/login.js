define(function(require, exports, module) {


		var $  = require('jquery');
		require('myLayer')($);
	
		var myDate = new Date();
		var myYear = myDate.getFullYear();

		$("#year").html(myYear);
		var pic_input = $("#pic_input");
		var oLi = pic_input.parents('li').eq(0);

		
		$("#pic_code").click(function () {
			$(this).attr("src", '/Handler/ValidateImgHandler.ashx?' + Math.random())
		});
		var src = '';
		if (isDisplayCode) {
			oLi.show();
			$("#pic_code").click().show();
		}else{
			oLi.hide();
		}
		$("input[data-type=text]").attr('data-isSubmit', '1');
		pic_input.attr('data-isSubmit', '0');

		var url = '/Handler/LoginHandler.ashx?action=user_login';
		$("#login_btn").click(function () {
			var objBtn = $(this);
			if (CheckText()) {
				objBtn.prop('disabled', 'disabled').html('登錄中...').addClass('btnD');
				$.ajax({
					type: 'POST',
					url: url,
					dataType: "json",
					data: $("#login").serialize(),
					async: true,
					success: function (d) {
						// Requset Handlers d typeof json
						// that.requsetHandlers(d)
						if (d.data) {
							if (d.data.hasOwnProperty('is_display_code')) {
								if (d.data.is_display_code == '1') {
									objBtn.prop('disabled', false).html('登錄').removeClass('btnD');
									pic_input.attr('data-isSubmit', '1');
									oLi.show();
									$("#pic_code").click().show();
									$("#pic_input").focus()
								}
							}
						}

						$("#pic_input").val("");
						if (d.success == 200) {
							if (d.tipinfo == '') {
								window.location.href = "./LoginValidate.aspx";
							}else{
								$("body").myLayer({
									title: '提示',
									isMiddle: true,
									isShowBtn: true,
									content: d.tipinfo,
									okText: '確定',
									isCancelBtn: false,
									okCallBack: function () {
										window.location.href = "./LoginValidate.aspx";
									}
								});
							}
						} else if (d.success == 550) {
							objBtn.prop('disabled', false).html('登錄').removeClass('btnD');
							$("body").myLayer({
								title: '錯誤提示',
								isMiddle: true,
								isShowBtn: true,
								content: d.tipinfo,
								okText: '確定',
								isCancelBtn: false,
								okCallBack: function () {
									if(sysver == 0){
										// 老版
										window.location.href = "/oldWeb/ResetPasswd1.aspx";
									}else{
										// 新版
										window.location.href = "./ResetPasswd1.aspx";
									}
								}
							});
						} else if (d.success == 560) {
							objBtn.prop('disabled', false).html('登錄').removeClass('btnD');
							$("body").myLayer({
								title: '錯誤提示',
								isMiddle: true,
								isShowBtn: true,
								content: d.tipinfo,
								okText: '確定',
								isCancelBtn: false,
								okCallBack: function () {
									$("#pic_code").click().show();
									$("#pic_input").focus().val('');
									$.myLayer.close(true);
								}
							});
						} else {
							objBtn.prop('disabled', false).html('登錄').removeClass('btnD');
							if (d.tipinfo != '') {
								$("body").myLayer({
									title: '錯誤提示',
									isMiddle: true,
									isShowBtn: true,
									content: d.tipinfo,
									okText: '確定',
									isCancelBtn: false,
									okCallBack: function () {
										$("#pic_code").click().show();
										$("#pic_input").focus().val('');
										$.myLayer.close(true);
									}
								});
							}
						}
					},
					error: function (message) {
					}
				});
			}
		});

		function CheckText() {
			var isOk = true;
			$("input[data-type=text]").each(function () {
				var that = $(this);
				if (that.val() == '' && that.attr('data-isSubmit') == '1' ) {
					$("body").myLayer({
						title: '錯誤提示',
						isMiddle: true,
						isShowBtn: true,
						content: that.attr('placeholder'),
						okText: '確定',
						isCancelBtn: false,
						okCallBack: function () {
							$.myLayer.close(true);
							that.focus();
						}
					});
					isOk = false;
					return false;
				}
			});
			return isOk;
		}

		$("input[data-type=text]").bind('keypress', function (ev) {
			var code = ev.keyCode || ev.which;
			if (code == 13) {
				$("#login_btn").click();
			}
		});

		// pic_input.focus(function () {
		// 	$("#pic_code").attr("src", '/Handler/ValidateImgHandler.ashx?' + Math.random()).show();
		// });

		// pic_input.blur(function () {
		// 	$("#pic_code").hide();
		// });


		$("#pic_code").click(function () {
			$(this).attr("src", '/Handler/ValidateImgHandler.ashx?' + Math.random())
		});
		var src = '';




		$("input[type=password]").bind('keypress, focus', function () {
			$(this).myxTips({
				content: '密碼區分大小寫'
			});
		});


		var xTipsTimer = null;
		(function (factory) {
			if (typeof define === 'function' && define.amd) {
				define(['jquery'], factory);
			} else if (typeof exports === 'object') {
				factory(require('jquery'));
			} else {
				factory(jQuery);
			}
		}(function ($) {

			/*
			 * [xTip插件]
			 */
			$.fn.myxTips = function (options) {
				var defaults = {
					content:''
				};
				var opts = $.extend({}, defaults, options);
				var _this = $(this);
				var _tpls = '<div id="myxTips">'+
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

				// _this.focus();

				xTipsTimer = setTimeout(function () {
					$('#myxTips').remove();
				}, 2000);
			};

		}));


});