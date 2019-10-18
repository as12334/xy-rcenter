/*!
 * artDialog-plus
 * Date: 2013-11-09
 * https://github.com/aui/artDialog
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

    var $ = require('jquery');
    var dialog = require('./dialog');
    var drag = require('./drag');

    dialog.oncreate = function (api) {

        var options = api.options;
        var originalOptions = options.original;

        // 椤甸潰鍦板潃
        var url = options.url;
        // 椤甸潰鍔犺浇瀹屾瘯鐨勪簨浠�
        var oniframeload = options.oniframeload;

        var $iframe;


        if (url) {
            this.padding = options.padding = 0;

            $iframe = $('<iframe />');

            $iframe.attr({
                src: url,
                name: api.id,
                width: '100%',
                height: '100%',
                allowtransparency: 'yes',
                frameborder: 'no',
                scrolling: 'no'
            })
                .on('load', function () {
                    var test;

                    try {
                        // 璺ㄥ煙娴嬭瘯
                        test = $iframe[0].contentWindow.frameElement;
                    } catch (e) {}

                    if (test) {

                        if (!options.height) {
                            $iframe.height(10);
                            api.height($iframe.contents().height());
                        }

                        if (!options.width) {
                            $iframe.width(10);
                            api.width($iframe.contents().width());
                        }

                        $iframe.height($iframe.contents().find('body').height());
                        $iframe.width($iframe.contents().width());
                    }

                    if (oniframeload) {
                        oniframeload.call(api);
                    }

                });

            api.addEventListener('beforeremove', function () {

                // 閲嶈锛侀渶瑕侀噸缃甶frame鍦板潃锛屽惁鍒欎笅娆″嚭鐜扮殑瀵硅瘽妗嗗湪IE6銆�7鏃犳硶鑱氱劍input
                // IE鍒犻櫎iframe鍚庯紝iframe浠嶇劧浼氱暀鍦ㄥ唴瀛樹腑鍑虹幇涓婅堪闂锛岀疆鎹rc鏄渶瀹规槗瑙ｅ喅鐨勬柟娉�
                $iframe.attr('src', 'about:blank').remove();


            }, false);

            api.content($iframe[0]);

            api.iframeNode = $iframe[0];

        }


        // 瀵逛簬瀛愰〉闈㈠懠鍑虹殑瀵硅瘽妗嗙壒娈婂鐞�
        // 濡傛灉瀵硅瘽妗嗛厤缃潵鑷� iframe
        if (!(originalOptions instanceof Object)) {

            var un = function () {
                api.close().remove();
            };

            // 鎵惧埌閭ｄ釜 iframe
            for (var i = 0; i < frames.length; i ++) {
                try {
                    if (originalOptions instanceof frames[i].Object) {
                        // 璁� iframe 鍒锋柊鐨勬椂鍊欎篃鍏抽棴瀵硅瘽妗嗭紝
                        // 闃叉瑕佹墽琛岀殑瀵硅薄琚己鍒舵敹鍥炲鑷� IE 鎶ラ敊锛氣€滀笉鑳芥墽琛屽凡閲婃斁 Script 鐨勪唬鐮佲€�
                        $(frames[i]).one('unload', un);
                        break;
                    }
                } catch (e) {}
            }
        }

        // 鎷栨嫿鏀寔
        $(api.node).on(drag.types.start, '[i=title]', function (event) {
            // 鎺掗櫎姘旀场绫诲瀷鐨勫璇濇
            if (!api.follow) {
                api.focus();
                drag.create(api.node, event);
            }
        });

    };



    dialog.get = function (id) {

        // 浠� iframe 浼犲叆 window 瀵硅薄
        if (id && id.frameElement) {
            var iframe = id.frameElement;
            var list = dialog.list;
            var api;
            for (var i in list) {
                api = list[i];
                if (api.node.getElementsByTagName('iframe')[0] === iframe) {
                    return api;
                }
            }
            // 鐩存帴浼犲叆 id 鐨勬儏鍐�
        } else if (id) {
            return dialog.list[id];
        }

    };


    return dialog;

});