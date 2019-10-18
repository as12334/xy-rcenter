/*!
 * popupjs
 * Date: 2014-01-15
 * https://github.com/aui/popupjs
 * (c) 2009-2013 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

    var $ = require('jquery');

    var _count = 0;
    var _isIE6 = !('minWidth' in $('html')[0].style);
    var _isFixed = !_isIE6;


    function Popup () {

        this.destroyed = false;


        this.__popup = $('<div />')
            .attr({
                tabindex: '-1'
            })
            .css({
                display: 'none',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 'auto',
                right: 'auto',
                margin: 0,
                padding: 0,
                outline: 0,
                border: '0 none',
                background: 'transparent'
            })
            .html(this.innerHTML)
            .appendTo('body');


        this.__backdrop = $('<div />');


        // 浣跨敤 HTMLElement 浣滀负澶栭儴鎺ュ彛浣跨敤锛岃€屼笉鏄� jquery 瀵硅薄
        // 缁熶竴鐨勬帴鍙ｅ埄浜庢湭鏉� Popup 绉绘鍒板叾浠� DOM 搴撲腑
        this.node = this.__popup[0];
        this.backdrop = this.__backdrop[0];

        _count ++;
    }


    $.extend(Popup.prototype, {

        /**
         * 鍒濆鍖栧畬姣曚簨浠讹紝鍦� show()銆乻howModal() 鎵ц
         * @name Popup.prototype.onshow
         * @event
         */

        /**
         * 鍏抽棴浜嬩欢锛屽湪 close() 鎵ц
         * @name Popup.prototype.onclose
         * @event
         */

        /**
         * 閿€姣佸墠浜嬩欢锛屽湪 remove() 鍓嶆墽琛�
         * @name Popup.prototype.onbeforeremove
         * @event
         */

        /**
         * 閿€姣佷簨浠讹紝鍦� remove() 鎵ц
         * @name Popup.prototype.onremove
         * @event
         */

        /**
         * 閲嶇疆浜嬩欢锛屽湪 reset() 鎵ц
         * @name Popup.prototype.onreset
         * @event
         */

        /**
         * 鐒︾偣浜嬩欢锛屽湪 foucs() 鎵ц
         * @name Popup.prototype.onfocus
         * @event
         */

        /**
         * 澶辩劍浜嬩欢锛屽湪 blur() 鎵ц
         * @name Popup.prototype.onblur
         * @event
         */

        /** 娴眰 DOM 绱犺妭鐐� */
        node: null,

        /** 閬僵 DOM 鑺傜偣 */
        backdrop: null,

        /** 鏄惁寮€鍚浐瀹氬畾浣� */
        fixed: false,

        /** 鍒ゆ柇瀵硅瘽妗嗘槸鍚﹀垹闄� */
        destroyed: true,

        /** 鍒ゆ柇瀵硅瘽妗嗘槸鍚︽樉绀� */
        open: false,

        /** close 杩斿洖鍊� */
        returnValue: '',

        /** 鏄惁鑷姩鑱氱劍 */
        autofocus: true,

        /** 瀵归綈鏂瑰紡 */
        align: 'bottom left',

        /** 璁剧疆閬僵鑳屾櫙棰滆壊 */
        backdropBackground: '#000',

        /** 璁剧疆閬僵閫忔槑搴� */
        backdropOpacity: 0.7,

        /** 鍐呴儴鐨� HTML 瀛楃涓� */
        innerHTML: '',

        /** 绫诲悕 */
        className: 'ui-popup',

        /**
         * 鏄剧ず娴眰
         * @param   {HTMLElement, Event}  鎸囧畾浣嶇疆锛堝彲閫夛級
         */
        show: function (anchor) {

            if (this.destroyed) {
                return this;
            }

            var that = this;
            var popup = this.__popup;

            this.__activeElement = this.__getActive();

            this.open = true;
            this.follow = anchor || this.follow;


            if (!this.__ready) {

                popup.addClass(this.className);

                if (this.modal) {
                    this.__lock();
                }


                if (!popup.html()) {
                    popup.html(this.innerHTML);
                }


                if (!_isIE6) {
                    $(window).on('resize', this.__onresize = function () {
                        that.reset();
                    });
                }


                this.__ready = true;
            }


            popup
                .addClass(this.className + '-show')
                .attr('role', this.modal ? 'alertdialog' : 'dialog')
                .css('position', this.fixed ? 'fixed' : 'absolute')
                .show();

            this.__backdrop.show();




            this.reset().focus();
            this.__dispatchEvent('show');

            return this;
        },


        /** 鏄剧ず妯℃€佹诞灞傘€傚弬鏁板弬瑙� show() */
        showModal: function () {
            this.modal = true;
            return this.show.apply(this, arguments);
        },


        /** 鍏抽棴娴眰 */
        close: function (result) {

            if (!this.destroyed && this.open) {

                if (result !== undefined) {
                    this.returnValue = result;
                }

                this.__popup.hide().removeClass(this.className + '-show');
                this.__backdrop.hide();
                this.open = false;
                this.blur();
                this.__dispatchEvent('close');
            }

            return this;
        },


        /** 閿€姣佹诞灞� */
        remove: function () {

            if (this.destroyed) {
                return this;
            }

            this.__dispatchEvent('beforeremove');

            if (Popup.current === this) {
                Popup.current = null;
            }

            this.__unlock();
            this.__popup.remove();
            this.__backdrop.remove();


            // 鎭㈠鐒︾偣锛岀収椤鹃敭鐩樻搷浣滅殑鐢ㄦ埛
            this.blur();

            if (!_isIE6) {
                $(window).off('resize', this.__onresize);
            }

            this.__dispatchEvent('remove');

            for (var i in this) {
                delete this[i];
            }

            return this;
        },


        /** 鎵嬪姩鍒锋柊浣嶇疆 */
        reset: function () {

            var elem = this.follow;

            if (elem) {
                this.__follow(elem);
            } else {
                this.__center();
            }

            this.__dispatchEvent('reset');

            return this;
        },


        /** 璁╂诞灞傝幏鍙栫劍鐐� */
        focus: function () {

            var node = this.node;
            var current = Popup.current;

            if (current && current !== this) {
                current.blur(false);
            }

            // 妫€鏌ョ劍鐐规槸鍚﹀湪娴眰閲岄潰
            if (!$.contains(node, this.__getActive())) {
                var autofocus = this.__popup.find('[autofocus]')[0];

                if (!this._autofocus && autofocus) {
                    this._autofocus = true;
                } else {
                    autofocus = node;
                }

                this.__focus(autofocus);
            }

            Popup.current = this;
            this.__popup.addClass(this.className + '-focus');
            this.__zIndex();
            this.__dispatchEvent('focus');

            return this;
        },


        /** 璁╂诞灞傚け鍘荤劍鐐广€傚皢鐒︾偣閫€杩樼粰涔嬪墠鐨勫厓绱狅紝鐓ч【瑙嗗姏闅滅鐢ㄦ埛 */
        blur: function () {

            var activeElement = this.__activeElement;
            var isBlur = arguments[0];


            if (isBlur !== false) {
                this.__focus(activeElement);
            }

            this._autofocus = false;
            this.__popup.removeClass(this.className + '-focus');
            this.__dispatchEvent('blur');

            return this;
        },


        /**
         * 娣诲姞浜嬩欢
         * @param   {String}    浜嬩欢绫诲瀷
         * @param   {Function}  鐩戝惉鍑芥暟
         */
        addEventListener: function (type, callback) {
            this.__getEventListener(type).push(callback);
            return this;
        },


        /**
         * 鍒犻櫎浜嬩欢
         * @param   {String}    浜嬩欢绫诲瀷
         * @param   {Function}  鐩戝惉鍑芥暟
         */
        removeEventListener: function (type, callback) {
            var listeners = this.__getEventListener(type);
            for (var i = 0; i < listeners.length; i ++) {
                if (callback === listeners[i]) {
                    listeners.splice(i--, 1);
                }
            }
            return this;
        },


        // 鑾峰彇浜嬩欢缂撳瓨
        __getEventListener: function (type) {
            var listener = this.__listener;
            if (!listener) {
                listener = this.__listener = {};
            }
            if (!listener[type]) {
                listener[type] = [];
            }
            return listener[type];
        },


        // 娲惧彂浜嬩欢
        __dispatchEvent: function (type) {
            var listeners = this.__getEventListener(type);

            if (this['on' + type]) {
                this['on' + type]();
            }

            for (var i = 0; i < listeners.length; i ++) {
                listeners[i].call(this);
            }
        },


        // 瀵瑰厓绱犲畨鍏ㄨ仛鐒�
        __focus: function (elem) {
            // 闃叉 iframe 璺ㄥ煙鏃犳潈闄愭姤閿�
            // 闃叉 IE 涓嶅彲瑙佸厓绱犳姤閿�
            try {
                // ie11 bug: iframe 椤甸潰鐐瑰嚮浼氳烦鍒伴《閮�
                if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                    elem.focus();
                }
            } catch (e) {}
        },


        // 鑾峰彇褰撳墠鐒︾偣鐨勫厓绱�
        __getActive: function () {
            try {// try: ie8~9, iframe #26
                var activeElement = document.activeElement;
                var contentDocument = activeElement.contentDocument;
                var elem = contentDocument && contentDocument.activeElement || activeElement;
                return elem;
            } catch (e) {}
        },


        // 缃《娴眰
        __zIndex: function () {

            var index = Popup.zIndex ++;

            // 璁剧疆鍙犲姞楂樺害
            this.__popup.css('zIndex', index);
            this.__backdrop.css('zIndex', index - 1);
            this.zIndex = index;
        },


        // 灞呬腑娴眰
        __center: function () {

            var popup = this.__popup;
            var $window = $(window);
            var $document = $(document);
            var fixed = this.fixed;
            var dl = fixed ? 0 : $document.scrollLeft();
            var dt = fixed ? 0 : $document.scrollTop();
            var ww = $window.width();
            var wh = $window.height();
            var ow = popup.width();
            var oh = popup.height();
            var left = (ww - ow) / 2 + dl;
            var top = (wh - oh) * 382 / 1000 + dt;// 榛勯噾姣斾緥
            var style = popup[0].style;


            style.left = Math.max(parseInt(left), dl) + 'px';
            style.top = Math.max(parseInt(top), dt) + 'px';
        },


        // 鎸囧畾浣嶇疆 @param    {HTMLElement, Event}  anchor
        __follow: function (anchor) {

            var $elem = anchor.parentNode && $(anchor);
            var popup = this.__popup;


            if (this.__followSkin) {
                popup.removeClass(this.__followSkin);
            }


            // 闅愯棌鍏冪礌涓嶅彲鐢�
            if ($elem) {
                var o = $elem.offset();
                if (o.left * o.top < 0) {
                    return this.__center();
                }
            }

            var that = this;
            var fixed = this.fixed;

            var $window = $(window);
            var $document = $(document);
            var winWidth = $window.width();
            var winHeight = $window.height();
            var docLeft =  $document.scrollLeft();
            var docTop = $document.scrollTop();


            var popupWidth = popup.width();
            var popupHeight = popup.height();
            var width = $elem ? $elem.outerWidth() : 0;
            var height = $elem ? $elem.outerHeight() : 0;
            var offset = this.__offset(anchor);
            var x = offset.left;
            var y = offset.top;
            var left =  fixed ? x - docLeft : x;
            var top = fixed ? y - docTop : y;


            var minLeft = fixed ? 0 : docLeft;
            var minTop = fixed ? 0 : docTop;
            var maxLeft = minLeft + winWidth - popupWidth;
            var maxTop = minTop + winHeight - popupHeight;


            var css = {};
            var align = this.align.split(' ');
            var className = this.className + '-';
            var reverse = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};
            var name = {top: 'top', bottom: 'top', left: 'left', right: 'left'};


            var temp = [{
                top: top - popupHeight,
                bottom: top + height,
                left: left - popupWidth,
                right: left + width
            }, {
                top: top,
                bottom: top - popupHeight + height,
                left: left,
                right: left - popupWidth + width
            }];


            var center = {
                left: left + width / 2 - popupWidth / 2,
                top: top + height / 2 - popupHeight / 2
            };


            var range = {
                left: [minLeft, maxLeft],
                top: [minTop, maxTop]
            };


            // 瓒呭嚭鍙鍖哄煙閲嶆柊閫傚簲浣嶇疆
            $.each(align, function (i, val) {

                // 瓒呭嚭鍙虫垨涓嬭竟鐣岋細浣跨敤宸︽垨鑰呬笂杈瑰榻�
                if (temp[i][val] > range[name[val]][1]) {
                    val = align[i] = reverse[val];
                }

                // 瓒呭嚭宸︽垨鍙宠竟鐣岋細浣跨敤鍙虫垨鑰呬笅杈瑰榻�
                if (temp[i][val] < range[name[val]][0]) {
                    align[i] = reverse[val];
                }

            });


            // 涓€涓弬鏁扮殑鎯呭喌
            if (!align[1]) {
                name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
                temp[1][align[1]] = center[name[align[1]]];
            }

            className += align.join('-');

            that.__followSkin = className;


            if ($elem) {
                popup.addClass(className);
            }


            css[name[align[0]]] = parseInt(temp[0][align[0]]);
            css[name[align[1]]] = parseInt(temp[1][align[1]]);
            popup.css(css);

        },


        // 鑾峰彇鍏冪礌鐩稿浜庨〉闈㈢殑浣嶇疆锛堝寘鎷琲frame鍐呯殑鍏冪礌锛�
        // 鏆傛椂涓嶆敮鎸佷袱灞備互涓婄殑 iframe 濂楀祵
        __offset: function (anchor) {

            var isNode = anchor.parentNode;
            var offset = isNode ? $(anchor).offset() : {
                left: anchor.pageX,
                top: anchor.pageY
            };


            anchor = isNode ? anchor : anchor.target;
            var ownerDocument = anchor.ownerDocument;
            var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

            if (defaultView == window) {// IE <= 8 鍙兘浣跨敤涓や釜绛変簬鍙�
                return offset;
            }

            // {Element Ifarme}
            var frameElement = defaultView.frameElement;
            var $ownerDocument = $(ownerDocument);
            var docLeft =  $ownerDocument.scrollLeft();
            var docTop = $ownerDocument.scrollTop();
            var frameOffset = $(frameElement).offset();
            var frameLeft = frameOffset.left;
            var frameTop = frameOffset.top;

            return {
                left: offset.left + frameLeft - docLeft,
                top: offset.top + frameTop - docTop
            };
        },


        // 璁剧疆灞忛攣閬僵
        __lock: function () {

            var that = this;
            var popup = this.__popup;
            var backdrop = this.__backdrop;
            var backdropCss = {
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                userSelect: 'none',
                opacity: 0,
                background: this.backdropBackground
            };


            popup.addClass(this.className + '-modal');


            // 閬垮厤閬僵涓嶈兘鐩栦綇涓婁竴娆＄殑瀵硅瘽妗�
            // 濡傛灉褰撳墠瀵硅瘽妗嗘槸涓婁竴涓璇濇鍒涘缓锛岀偣鍑荤殑閭ｄ竴鐬棿瀹冧細澧為暱 zIndex 鍊�
            Popup.zIndex = Popup.zIndex + 2;
            this.__zIndex();


            if (!_isFixed) {
                $.extend(backdropCss, {
                    position: 'absolute',
                    width: $(window).width() + 'px',
                    height: $(document).height() + 'px'
                });
            }


            backdrop
                .css(backdropCss)
                .animate({opacity: this.backdropOpacity}, 150)
                .insertAfter(popup)
                // 閿佷綇妯℃€佸璇濇鐨� tab 绠€鍗曞姙娉�
                // 鐢氳嚦鍙互閬垮厤鐒︾偣钀藉叆瀵硅瘽妗嗗鐨� iframe 涓�
                .attr({tabindex: '0'})
                .on('focus', function () {
                    that.focus();
                });

        },


        // 鍗歌浇灞忛攣閬僵
        __unlock: function () {

            if (this.modal) {
                this.__popup.removeClass(this.className + '-modal');
                this.__backdrop.remove();
                delete this.modal;
            }
        }

    });


    /** 褰撳墠鍙犲姞楂樺害 */
    Popup.zIndex = 1024;


    /** 椤跺眰娴眰鐨勫疄渚� */
    Popup.current = null;


    return Popup;

});