/*!
 * artDialog
 * Date: 2014-11-09
 * https://github.com/aui/artDialog
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

    var $ = require('jquery');
    var Popup = require('./popup');
    var defaults = require('./dialogConfig');
    var css = defaults.cssUri;


// css loader: RequireJS & SeaJS
    if (css) {
        var fn = require[require.toUrl ? 'toUrl' : 'resolve'];
        if (fn) {
            css = fn(css);
            css = '<link rel="stylesheet" href="' + css + '" />';
            if ($('base')[0]) {
                $('base').before(css);
            } else {
                $('head').append(css);
            }
        }
    }


    var _count = 0;
    var _expando = new Date() - 0; // Date.now()
    var _isIE6 = !('minWidth' in $('html')[0].style);
    var _isMobile = 'createTouch' in document && !('onmousemove' in document)
        || /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
    var _isFixed = !_isIE6 && !_isMobile;


    var artDialog = function (options, ok, cancel) {

        var originalOptions = options = options || {};


        if (typeof options === 'string' || options.nodeType === 1) {

            options = {content: options, fixed: !_isMobile};
        }


        options = $.extend(true, {}, artDialog.defaults, options);
        options.original = originalOptions;

        var id = options.id = options.id || _expando + _count;
        var api = artDialog.get(id);


        // 濡傛灉瀛樺湪鍚屽悕鐨勫璇濇瀵硅薄锛屽垯鐩存帴杩斿洖
        if (api) {
            return api.focus();
        }

        // 鐩墠涓绘祦绉诲姩璁惧瀵筬ixed鏀寔涓嶅ソ锛岀鐢ㄦ鐗规€
        // _isFixed = false;
        if (!_isFixed) {
            options.fixed = false;
        }


        // 蹇嵎鍏抽棴鏀寔锛氱偣鍑诲璇濇澶栧揩閫熷叧闂璇濇
        if (options.quickClose) {
            options.modal = true;
            options.backdropOpacity = 0;
        }


        // 鎸夐挳缁�
        if (!$.isArray(options.button)) {
            options.button = [];
        }


        // 鍙栨秷鎸夐挳
        if (cancel !== undefined) {
            options.cancel = cancel;
        }

        if (options.cancel) {
            options.button.push({
                id: 'cancel',
                value: options.cancelValue,
                callback: options.cancel,
                display: options.cancelDisplay
            });
        }


        // 纭畾鎸夐挳
        if (ok !== undefined) {
            options.ok = ok;
        }

        if (options.ok) {
            options.button.push({
                id: 'ok',
                value: options.okValue,
                callback: options.ok,
                autofocus: true
            });
        }


        return artDialog.list[id] = new artDialog.create(options);
    };

    var popup = function () {};
    popup.prototype = Popup.prototype;
    var prototype = artDialog.prototype = new popup();

    artDialog.create = function (options) {
        var that = this;

        $.extend(this, new Popup());

        var originalOptions = options.original;
        var $popup = $(this.node).html(options.innerHTML);
        var $backdrop = $(this.backdrop);

        this.options = options;
        this._popup = $popup;


        $.each(options, function (name, value) {
            if (typeof that[name] === 'function') {
                that[name](value);
            } else {
                that[name] = value;
            }
        });


        // 鏇存柊 zIndex 鍏ㄥ眬閰嶇疆
        if (options.zIndex) {
            Popup.zIndex = options.zIndex;
        }


        // 璁剧疆 ARIA 淇℃伅
        $popup.attr({
            'aria-labelledby': this._$('title')
                .attr('id', 'title:' + this.id).attr('id'),
            'aria-describedby': this._$('content')
                .attr('id', 'content:' + this.id).attr('id')
        });


        // 鍏抽棴鎸夐挳
        this._$('close')
            .css('display', this.cancel === false ? 'none' : '')
            .attr('title', this.cancelValue)
            .on('click', function (event) {
                that._trigger('cancel');
                event.preventDefault();
            });


        // 娣诲姞瑙嗚鍙傛暟
        this._$('dialog').addClass(this.skin);
        this._$('body').css('padding', this.padding);


        // 鐐瑰嚮浠绘剰绌虹櫧澶勫叧闂璇濇
        if (options.quickClose) {
            $backdrop
                .on(
                    'onmousedown' in document ? 'mousedown' : 'click',
                    function () {
                        that._trigger('cancel');
                        return false;// 闃绘鎶㈠ず鐒︾偣
                    });
        }


        // 閬僵璁剧疆
        this.addEventListener('show', function () {
            $backdrop.css({
                opacity: 0,
                background: options.backdropBackground
            }).animate(
                {opacity: options.backdropOpacity}
                , 150);
        });


        // ESC 蹇嵎閿叧闂璇濇
        this._esc = function (event) {
            var target = event.target;
            var nodeName = target.nodeName;
            var rinput = /^input|textarea$/i;
            var isTop = Popup.current === that;
            var keyCode = event.keyCode;

            // 閬垮厤杈撳叆鐘舵€佷腑 ESC 璇搷浣滃叧闂�
            if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
                return;
            }

            if (keyCode === 27) {
                that._trigger('cancel');
            }
        };

        $(document).on('keydown', this._esc);
        this.addEventListener('remove', function () {
            $(document).off('keydown', this._esc);
            delete artDialog.list[this.id];
        });


        _count ++;

        artDialog.oncreate(this);

        return this;
    };


    artDialog.create.prototype = prototype;



    $.extend(prototype, {

        /**
         * 鏄剧ず瀵硅瘽妗�
         * @name artDialog.prototype.show
         * @param   {HTMLElement Object, Event Object}  鎸囧畾浣嶇疆锛堝彲閫夛級
         */

        /**
         * 鏄剧ず瀵硅瘽妗嗭紙妯℃€侊級
         * @name artDialog.prototype.showModal
         * @param   {HTMLElement Object, Event Object}  鎸囧畾浣嶇疆锛堝彲閫夛級
         */

        /**
         * 鍏抽棴瀵硅瘽妗�
         * @name artDialog.prototype.close
         * @param   {String, Number}    杩斿洖鍊硷紝鍙 onclose 浜嬩欢鏀跺彇锛堝彲閫夛級
         */

        /**
         * 閿€姣佸璇濇
         * @name artDialog.prototype.remove
         */

        /**
         * 閲嶇疆瀵硅瘽妗嗕綅缃�
         * @name artDialog.prototype.reset
         */

        /**
         * 璁╁璇濇鑱氱劍锛堝悓鏃剁疆椤讹級
         * @name artDialog.prototype.focus
         */

        /**
         * 璁╁璇濇澶辩劍锛堝悓鏃剁疆椤讹級
         * @name artDialog.prototype.blur
         */

        /**
         * 娣诲姞浜嬩欢
         * @param   {String}    浜嬩欢绫诲瀷
         * @param   {Function}  鐩戝惉鍑芥暟
         * @name artDialog.prototype.addEventListener
         */

        /**
         * 鍒犻櫎浜嬩欢
         * @param   {String}    浜嬩欢绫诲瀷
         * @param   {Function}  鐩戝惉鍑芥暟
         * @name artDialog.prototype.removeEventListener
         */

        /**
         * 瀵硅瘽妗嗘樉绀轰簨浠讹紝鍦� show()銆乻howModal() 鎵ц
         * @name artDialog.prototype.onshow
         * @event
         */

        /**
         * 鍏抽棴浜嬩欢锛屽湪 close() 鎵ц
         * @name artDialog.prototype.onclose
         * @event
         */

        /**
         * 閿€姣佸墠浜嬩欢锛屽湪 remove() 鍓嶆墽琛�
         * @name artDialog.prototype.onbeforeremove
         * @event
         */

        /**
         * 閿€姣佷簨浠讹紝鍦� remove() 鎵ц
         * @name artDialog.prototype.onremove
         * @event
         */

        /**
         * 閲嶇疆浜嬩欢锛屽湪 reset() 鎵ц
         * @name artDialog.prototype.onreset
         * @event
         */

        /**
         * 鐒︾偣浜嬩欢锛屽湪 foucs() 鎵ц
         * @name artDialog.prototype.onfocus
         * @event
         */

        /**
         * 澶辩劍浜嬩欢锛屽湪 blur() 鎵ц
         * @name artDialog.prototype.onblur
         * @event
         */


        /**
         * 璁剧疆鍐呭
         * @param    {String, HTMLElement}   鍐呭
         */
        content: function (html) {

            var $content = this._$('content');

            // HTMLElement
            if (typeof html === 'object') {
                html = $(html);
                $content.empty('').append(html.show());
                this.addEventListener('beforeremove', function () {
                    // $('body').append(html.hide());
                });
                // String
            } else {
                $content.html(html);
            }

            return this.reset();
        },


        /**
         * 璁剧疆鏍囬
         * @param    {String}   鏍囬鍐呭
         */
        title: function (text) {
            this._$('title').text(text);
            this._$('header')[text ? 'show' : 'hide']();
            return this;
        },


        /** 璁剧疆瀹藉害 */
        width: function (value) {
            var $width = value;
            if ($(this._$('content')).hasClass('ui-dialog-scrollBarShow')) {
                $width = value + 17;
            }
            this._$('content').css('width', $width);
            return this.reset();
        },


        /** 璁剧疆楂樺害 */
        height: function (value) {
            var $height = value;
            var $con = this._$('content');
            $con.removeClass('ui-dialog-scrollBarShow');
            if($height > $(window).height() - 100){
                $height = $(window).height() - 100;
                $con.addClass('ui-dialog-scrollBarShow');
            }
            $con.css('height', $height);
            return this.reset();
        },


        /**
         * 璁剧疆鎸夐挳缁�
         * @param   {Array, String}
         * Options: value, callback, autofocus, disabled
         */
        button: function (args) {
            args = args || [];
            var that = this;
            var html = '';
            var number = 0;
            this.callbacks = {};


            if (typeof args === 'string') {
                html = args;
                number ++;
            } else {
                $.each(args, function (i, val) {

                    var id = val.id = val.id || val.value;
                    var style = '';
                    that.callbacks[id] = val.callback;


                    if (val.display === false) {
                        style = ' style="display:none"';
                    } else {
                        number ++;
                    }

                    html +=
                        '<button'
                        + ' type="button"'
                        + ' i-id="' + id + '"'
                        + style
                        + (val.disabled ? ' disabled' : '')
                        + (val.autofocus ? ' autofocus class="ui-dialog-autofocus"' : '')
                        + '>'
                        +   val.value
                        + '</button>';

                    that._$('button')
                        .on('click', '[i-id=' + id +']', function (event) {
                            var $this = $(this);
                            if (!$this.attr('disabled')) {// IE BUG
                                that._trigger(id);
                            }

                            event.preventDefault();
                        });

                });
            }

            this._$('button').html(html);
            this._$('footer')[number ? 'show' : 'hide']();

            return this;
        },


        statusbar: function (html) {
            this._$('statusbar')
                .html(html)[html ? 'show' : 'hide']();

            return this;
        },


        _$: function (i) {
            return this._popup.find('[i=' + i + ']');
        },


        // 瑙﹀彂鎸夐挳鍥炶皟鍑芥暟
        _trigger: function (id) {
            var fn = this.callbacks[id];

            return typeof fn !== 'function' || fn.call(this) !== false ?
                this.close().remove() : this;
        }

    });



    artDialog.oncreate = $.noop;



    /** 鑾峰彇鏈€椤跺眰鐨勫璇濇API */
    artDialog.getCurrent = function () {
        return Popup.current;
    };



    /**
     * 鏍规嵁 ID 鑾峰彇鏌愬璇濇 API
     * @param    {String}    瀵硅瘽妗� ID
     * @return   {Object}    瀵硅瘽妗� API (瀹炰緥)
     */
    artDialog.get = function (id) {
        return id === undefined
            ? artDialog.list
            : artDialog.list[id];
    };

    artDialog.list = {};



    /**
     * 榛樿閰嶇疆
     */
    artDialog.defaults = defaults;



    return artDialog;

});

