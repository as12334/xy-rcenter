/*!
 * drag.js
 * Date: 2013-12-06
 * https://github.com/aui/artDialog
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

    var $ = require('jquery');


    var $window = $(window);
    var $document = $(document);
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
// var isTouch = 'createTouch' in document;
    var isTouch = isMobile;
    var html = document.documentElement;
    var isIE6 = !('minWidth' in html.style);
    var isLosecapture = !isIE6 && 'onlosecapture' in html;
    var isSetCapture = 'setCapture' in html;


    var types = {
        start: isTouch ? 'touchstart' : 'mousedown',
        over: isTouch ? 'touchmove' : 'mousemove',
        end: isTouch ? 'touchend' : 'mouseup'
    };


    var getEvent = isTouch ? function (event) {
        if (!event.touches) {
            event = event.originalEvent.touches.item(0);
        }
        return event;
    } : function (event) {
        return event;
    };


    var DragEvent = function () {
        this.start = $.proxy(this.start, this);
        this.over = $.proxy(this.over, this);
        this.end = $.proxy(this.end, this);
        this.onstart = this.onover = this.onend = $.noop;
    };

    DragEvent.types = types;

    DragEvent.prototype = {

        start: function (event) {
            event = this.startFix(event);

            $document
                .on(types.over, this.over)
                .on(types.end, this.end);

            this.onstart(event);
            return false;
        },

        over: function (event) {
            event = this.overFix(event);
            this.onover(event);
            return false;
        },

        end: function (event) {
            event = this.endFix(event);

            $document
                .off(types.over, this.over)
                .off(types.end, this.end);

            this.onend(event);
            return false;
        },

        startFix: function (event) {
            event = getEvent(event);

            this.target = $(event.target);
            this.selectstart = function () {
                return false;
            };

            $document
                .on('selectstart', this.selectstart)
                .on('dblclick', this.end);

            if (isLosecapture) {
                this.target.on('losecapture', this.end);
            } else {
                $window.on('blur', this.end);
            }

            if (isSetCapture) {
                this.target[0].setCapture();
            }

            return event;
        },

        overFix: function (event) {
            event = getEvent(event);
            return event;
        },

        endFix: function (event) {
            event = getEvent(event);

            $document
                .off('selectstart', this.selectstart)
                .off('dblclick', this.end);

            if (isLosecapture) {
                this.target.off('losecapture', this.end);
            } else {
                $window.off('blur', this.end);
            }

            if (isSetCapture) {
                this.target[0].releaseCapture();
            }

            return event;
        }

    };


    /**
     * 鍚姩鎷栨嫿
     * @param   {HTMLElement}   琚嫋鎷界殑鍏冪礌
     * @param   {Event} 瑙﹀彂鎷栨嫿鐨勪簨浠跺璞°€傚彲閫夛紝鑻ユ棤鍒欑洃鍚� elem 鐨勬寜涓嬩簨浠跺惎鍔�
     */
    DragEvent.create = function (elem, event) {
        var $elem = $(elem);
        var dragEvent = new DragEvent();
        var startType = DragEvent.types.start;
        var noop = function () {};
        var className = elem.className
                .replace(/^\s|\s.*/g, '') + '-drag-start';

        var minX;
        var minY;
        var maxX;
        var maxY;

        var api = {
            onstart: noop,
            onover: noop,
            onend: noop,
            off: function () {
                $elem.off(startType, dragEvent.start);
            }
        };


        dragEvent.onstart = function (event) {
            var isFixed = $elem.css('position') === 'fixed';
            var dl = $document.scrollLeft();
            var dt = $document.scrollTop();
            var w = $elem.width();
            var h = $elem.height();

            minX = 0;
            minY = 0;
            maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
            maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

            var offset = $elem.offset();
            var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
            var top = this.startTop = isFixed ? offset.top - dt  : offset.top;

            this.clientX = event.clientX;
            this.clientY = event.clientY;

            $elem.addClass(className);
            api.onstart.call(elem, event, left, top);
        };


        dragEvent.onover = function (event) {
            var left = event.clientX - this.clientX + this.startLeft;
            var top = event.clientY - this.clientY + this.startTop;
            var style = $elem[0].style;

            left = Math.max(minX, Math.min(maxX, left));
            top = Math.max(minY, Math.min(maxY, top));

            style.left = left + 'px';
            style.top = top + 'px';

            api.onover.call(elem, event, left, top);
        };


        dragEvent.onend = function (event) {
            var position = $elem.position();
            var left = position.left;
            var top = position.top;
            $elem.removeClass(className);
            api.onend.call(elem, event, left, top);
        };


        dragEvent.off = function () {
            $elem.off(startType, dragEvent.start);
        };


        if (event) {
            dragEvent.start(event);
        } else {
            $elem.on(startType, dragEvent.start);
        }

        return api;
    };

    return DragEvent;

});