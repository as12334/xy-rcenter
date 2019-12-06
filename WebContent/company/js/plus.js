var xTipsTimer = null;

var timerID = null;
/* plus */
define(function(require, exports, moudles) {
	return function(jquery) { (function($) {

			// 賠率loading
			$.fn.addAndSubLoading = function(options) {
				var opts = $.extend({},
				$.fn.addAndSubLoading.defaults, options);
				var _tmp = '<div class="addSubLoading"><img src="../Images/loading27.gif"></div>';
				$(this).parent('div').append(_tmp);
			};

			// 賠率工具
			$.fn.oddsTool = function(options) {
				var defaults = {
					aValue: [0.1, 0.5, 1]
				};
				var opts = $.extend(defaults, options);
				if ($.cookie('oddsTool')) {
					opts.aValue = $.cookie('oddsTool').split(',');
				}
				var oddsToolVal = '';
				if ($.cookie('oddsToolVal')) {
					oddsToolVal = $.cookie('oddsToolVal');
				} else {
					oddsToolVal = opts.aValue[0];
				}
				var wrap = $(this);
				var _tmp = '<label for="tool_input">' + '設置賠率金額：' + '</label>'+
						'<input id="tool_input" class="text" type="text" value="' + oddsToolVal + '" />'+
						'<span>'+
							'<a href="javascript:;">' + opts.aValue[0] + '</a>'+
							'<a href="javascript:;">' + opts.aValue[1] + '</a>'+
							'<a href="javascript:;">' + opts.aValue[2] + '</a>'+
						'</span>'+
						'<em>'+
							'<b>+</b>'+
							'<strong>'+
								'<p>設按鈕</p>'+
								'<input class="text" type="text" value="' + opts.aValue[0] + '" />'+
								'<input class="text" type="text" value="' + opts.aValue[1] + '" />'+
								'<input class="text" type="text" value="' + opts.aValue[2] + '" />'+
								'<input class="btn" type="button" value="確定">'+
							'</strong>'+
						'</em>';

				if (parent.isopt == '1') {
					wrap.html(_tmp);

					var baseInput = wrap.find('#tool_input');
					var baseA = wrap.find('a');
					var baseB = wrap.find('b');
					var baseS = wrap.find('strong');
					var aInput = baseS.find('input[type=text]');
					var btn = baseS.find('input[type=button]');
					var num = 0;
					var aCookie = [];
					var sCookie = '';

					baseA.click(function() {
						var baseAHtml = $(this).html();
						baseInput.val(baseAHtml);
						$.cookie('oddsToolVal', baseAHtml);
					});

					baseB.click(function(e) {
						if (num++%2 == 0) {
							baseS.show();
						} else {
							baseS.hide();
						}
					});

					btn.click(function() {
						for (var i = 0; i < baseA.length; i++) {
							if (!aInput.eq(i).val()) {
								tip = tips.msgTips({
									msg: '設置有誤，請輸入有效微調值！',
									type: "error"
								});
								aInput.eq(i).focus();
								return false;
							}
							baseA.eq(i).html(aInput.eq(i).val());
							aCookie.push(aInput.eq(i).val());
						}
						baseS.hide();
						num++;
						sCookie = aCookie.join(',');
						$.cookie('oddsTool', sCookie);
						baseInput.val(aInput.eq(0).val());
					});

				} else {
					return;
				}
			};

			// 排序
			$.fn.mySort = function(options) {
				return $(this).each(function() {
					var defaults = {
						attribute: '',
						descOrAsc: 'asc',
						dataLen: -1,
						dataObj: null
					};
					var opts = $.extend({}, defaults, options);

					var obj = $(this);
					var tr = opts.dataObj.find('tr').clone();
					var oAb = opts.attribute;
					if (opts.dataLen == -1) {
						opts.dataLen = tr.length;
					}
					// 冒泡排序
					function bubble(arr) {
						var narr = [];
						// var len = arr.length;
						// for (var i = 0; i < len - 1; i++) {
						//     for (j = i + 1; j < len; j++) {
						//         if (opts.descOrAsc == 'asc') {
						//             if (parseInt($(arr[i]).attr(oAb)) > parseInt($(arr[j]).attr(oAb))) {
						//                 var temp = arr[i];
						//                 arr[i] = arr[j];
						//                 arr[j] = temp;
						//             }
						//         } else {
						//             if (parseInt($(arr[i]).attr(oAb)) < parseInt($(arr[j]).attr(oAb))) {
						//                 var temp = arr[i];
						//                 arr[i] = arr[j];
						//                 arr[j] = temp;
						//             }
						//         }
						//     }
						// }
						// return arr;
						if (opts.descOrAsc == 'asc') {
							narr = arr.sort(function(a, b){
								return parseInt($(a).attr(oAb)) - parseInt($(b).attr(oAb))
							});
						} else {
							narr = arr.sort(function(a, b){
								return parseInt($(b).attr(oAb)) - parseInt($(a).attr(oAb))
							});
						}
						return narr;
					}
					var newTr = bubble(tr).slice(0, opts.dataLen);
					$(newTr).each(function() {
						var obj = $(this);
						var odds = obj.find('.oddsTrim');
						var oddsId = odds.attr('id');
						odds.attr('id', oddsId.replace(/odds/, 'codds'));
						var amount = obj.find('.clearAmout');
						var amountId = amount.attr('id');
						amount.attr('id', amountId.replace(/amount/, 'camount'));
						var szsz = obj.find('.clearSzsz');
						var szszId = szsz.attr('id');
						szsz.attr('id', szszId.replace(/szsz/, 'cszsz'));
					});
					obj.html(newTr);
				});
			};

			// 修改皮肤
			$.fn.skinChange = function(skinPath) {
				var that = $(this);
				that.attr('href', setUrl(that.attr('href'), skinPath));

				function setUrl(src, skinPath) {
					var a = src.split("/");
					a[a.length - 2] = skinPath;
					return a.join('/');
				}
			};

			// cookie
			var pluses = /\+/g;

			function encode(s) {
				return config.raw ? s: encodeURIComponent(s);
			}

			function decode(s) {
				return config.raw ? s: decodeURIComponent(s);
			}

			function stringifyCookieValue(value) {
				return encode(config.json ? JSON.stringify(value) : String(value));
			}

			function parseCookieValue(s) {
				if (s.indexOf('"') === 0) {
					s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
				}
				try {
					s = decodeURIComponent(s.replace(pluses, ' '));
					return config.json ? JSON.parse(s) : s;
				} catch(e) {}
			}

			function read(s, converter) {
				var value = config.raw ? s: parseCookieValue(s);
				return $.isFunction(converter) ? converter(value) : value;
			}
			var config = $.cookie = function(key, value, options) {
				if (value !== undefined && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);
					if (typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setTime(+t + days * 864e+5);
					}
					return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
				}
				var result = key ? undefined: {};
				var cookies = document.cookie ? document.cookie.split('; ') : [];

				for (var i = 0,
				l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var name = decode(parts.shift());
					var cookie = parts.join('=');
					if (key && key === name) {
						result = read(cookie, value);
						break;
					}
					if (!key && (cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}
				return result;
			};
			config.defaults = {};
			$.removeCookie = function(key, options) {
				if ($.cookie(key) === undefined) {
					return false;
				}
				$.cookie(key, '', $.extend({},
				options, {
					expires: -1
				}));
				return ! $.cookie(key);
			};

			// 只允许输入数字
			function onlyNumber(ev) {
				var code = ev.keyCode || ev.which;
				if ((ev.ctrlKey && code == 97) || (ev.ctrlKey && code == 65)) { // Ctrl+A
					return true;
				} else if ((ev.ctrlKey && code == 120) || (ev.ctrlKey && code == 88)) { // Ctrl+X
					return true;
				} else if ((ev.ctrlKey && code == 99) || (ev.ctrlKey && code == 67)) { // Ctrl+C
					return true;
				} else if ((ev.ctrlKey && code == 122) || (ev.ctrlKey && code == 90)) { // Ctrl+Z
					return true;
				} else if ((ev.ctrlKey && code == 118) || (ev.ctrlKey && code == 86) || (ev.shiftKey && code == 45)) { // Ctrl+V, Shift+Ins
					return true;
				} else if ((code >= 48 && code <= 57)) { // number (keypress no smallKey)
					return true;
				} else if (code == 8 || code == 9 || code == 37 || code == 39) { //backspace, tab, left, right
					return true;
				} else if (code == 13) { // enter
					return true;
				} else if (code == 46 || code == 45) { // del(.), minus(-)
					return true;
				} else {
					if (ev && ev.preventDefault) ev.preventDefault(); //阻止默认浏览器动作(W3C)
					else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
					return false;
				}
			}

			function getTxtCursorPosition(oTxt){
				var cursurPosition=-1;
				if (oTxt.value.length == 0) {
					cursurPosition = 0;
				}else{
					
					if(oTxt.selectionStart){//非IE浏览器
						cursurPosition = oTxt.selectionStart;
					}else{//IE
						var range = document.selection.createRange();
						range.moveStart("character", -oTxt.value.length);
						cursurPosition = range.text.length;
					}
				}
				return cursurPosition;
			}


			function setCursorPosition(elem, index) {
				var val = elem.value;
				var len = val.length;
			 
				// 超过文本长度直接返回
				if (len < index) return;
				setTimeout(function() {
					elem.focus();
					if (elem.setSelectionRange) { // 标准浏览器
						elem.setSelectionRange(index, index); 
					} else { // IE9-
						var range = elem.createTextRange();
						range.moveStart("character", -len);
						range.moveEnd("character", -len);
						range.moveStart("character", index);
						range.moveEnd("character", 0);
						range.select();
					}
				}, 10);
			}

			// 校验
			function checkNumber(ev, isDecimal, isMinus) {
				var v = ev.target.value;
				v = v.replace(/\s/g, "");
				var dot = $.inArray('.', v.split(''));
				var minus = $.inArray('-', v.split(''));
				var length = v.length;
				var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

				var cp = getTxtCursorPosition(ev.target);

				if (isDecimal) {
					validChars.push('.');
				}
				if (isMinus) {
					validChars.push('-');
				}
				if (v && length > 0) {
					if (isDecimal) {
						if (dot === 0) {
							v = '0' + v;
							cp = cp + 1;
						} else {
							for (var i = length - 1; i >= 0; i--) {
								var ch = v.charAt(i);
								var validChar = false;
								for (var j = 0; j < validChars.length; j++) {
									if (ch == validChars[j]) {
										validChar = true;
										break;
									}
								}
								if (!validChar || ch == " ") {
									v = v.substring(0, i) + v.substring(i + 1);
								}
								var firstDecimal = $.inArray('.', v.split(''));
								if (firstDecimal > 0) {
									for (var k = length - 1; k > firstDecimal; k--) {
										var chch = v.charAt(k);
										if (chch == '.') {
											v = v.substring(0, k) + v.substring(k + 1);
										}
									}
								}
							}
						}
					}
					if (isMinus) {
						if (minus >= 0) {
							v = '-' + v.replace(/-/g, '');
							cp = cp + 1;
						}
					}
					if (isMinus && !isDecimal) {
						if (dot >= 0) {
							v = v.replace(/\./g, '');
						}
					}
					if (isMinus && isDecimal) {
						if (dot === 1 && minus === 0 && length >= 2) {
							v = '-0.' + v.replace(/\-\./g, '');
							cp = cp + 1;
						}
					}
					if (!isDecimal && !isMinus) {
						for (var i = length - 1; i >= 0; i--) {
							var ch = v.charAt(i);
							var validChar = false;
							for (var j = 0; j < validChars.length; j++) {
								if (ch == validChars[j]) {
									validChar = true;
									break;
								}
							}
							if (!validChar || ch == " ") {
								v = v.substring(0, i) + v.substring(i + 1);
							}
						}
					}
				} else {
					v = '';
				}
				ev.target.value = v;
				setCursorPosition(ev.target, cp);
			}

			$.fn.onlyNumber = function(options) {
				var defaults = {
					className: '',
					isDecimal: true,
					isMinus: true
				};
				var opts = $.extend({}, defaults, options);
				var oBody = $(this);
				oBody.delegate(opts.className, 'keypress', function(e) {
					onlyNumber(e);
				});
				oBody.delegate(opts.className, 'input', function(e) {
					checkNumber(e, opts.isDecimal, opts.isMinus);
				});
				return this;
			};


			/*
			 * [xTip插件]
			 */
			$.fn.myxTips = function(options) {
				var defaults = {
					content: '',
					ishide: true,
					isFocus: false
				};
				var opts = $.extend({},defaults, options);
				var _this = $(this);

				var ww = $(window).width();

				var _tpls = '<table id="myxTips" cellpadding="0" cellspacing="0"><tr><td>' + '<div id="myxTipsLeft"></div>' + '<div id="myxTipsContent">' + opts.content + '</div>' + '<td><tr></table>';

				var obj = $(_tpls);

				clearTimeout(xTipsTimer);

				$('#myxTips').remove();
				$('body').append(obj);
				
				var th = _this.innerHeight();
				var tw = _this.innerWidth();
				var ot = _this.offset().top;
				var ol = _this.offset().left;
				var oh = obj.height();
				var ow = obj.width();
				var dh = $('body').height();
				var _top, _left;

				_top = ot - (oh - th) / 2;

				switch (_this.attr("data-simpletooltip-position")) {
					case "bottom":
						_top = ot + th;
						_left = ol;
						$("#myxTipsLeft").remove();
						break;
					default:
						if ((_this.offset().left + tw + ow + 10) > ww) {
							_left = ol - ow - 15;
							obj.addClass('myxTipsLeft');
						} else {
							_left = ol + tw + 10;
						}
						if ((_top+oh+20)>dh) {
							_top = dh - oh - 20;
						}
						if(_top<0){
							_top = 0;
						}
				}

				obj.css({
					'left': _left,
					'top': _top
				});

				$("#myxTipsLeft").css({
					'top': ot - _top + ( th - 7 ) / 2
				});
				if( !opts.isFocus ){
					_this.focus();
				}

				if (opts.ishide) {
					xTipsTimer = setTimeout(function() {
						$('#myxTips').remove();
					},
					2000);
				}
			};

			/**
			 * [pageLoading]
			 */

			 

		})(jquery);
	};
});
