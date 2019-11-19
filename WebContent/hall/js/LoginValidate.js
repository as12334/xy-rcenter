define(function(require, exports, module) {


    var $  = require('jquery');
    require('myLayer')($);


    if (massage) {
        $("body").myLayer({
            title: '公告',
            isShowBtn: false,
            isMiddle: true,
            content: '<div style="max-width:500px;">' + massage + '</div>'
        });
    }
});