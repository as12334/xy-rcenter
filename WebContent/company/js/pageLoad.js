 define(function(require, exports, module) {

    var $ = require('jquery');
    var percentage = 0;
    function loadPage(per) {
      percentage = percentage + per;
      var loadHtml = '<div id="loadPage"></div>';
      if ($("#loadPage").length == 0) {
        $("body").append(loadHtml);
      }
      $("#loadPage").stop(true,false).animate({
        "width" : percentage + "%"
      }, 500, function  () {
        if (percentage == 100) {
          $("#loadPage").hide(100);
        }
      });
    }

    $(function  () {
      loadPage(100);
    });


});
