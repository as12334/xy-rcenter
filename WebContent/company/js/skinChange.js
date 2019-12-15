define(function(require, exports, module){

    // 引入jQuery模块
    var $ = require('jquery');

    var skinChange = function (attr) {

        var sCssObj = $("#Iframe_skin");

        sCssObj.attr('href', setUrl(sCssObj.attr('href'), attr));

        function setUrl(src, str) {
            var a = src.split("/");
            a[a.length-2] = str;
            return a.join('/');
        }
    };

    // 设置皮肤
    skinChange(top.skinPath);

    module.exports = skinChange;
});