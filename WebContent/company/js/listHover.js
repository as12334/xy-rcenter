define(function(require,exports,moudles){

	var $ = require('jquery');
	// require('myLayer')($);
	var dialog = top.dialog;
	// if (dialog) {
	// 	dialog = require('dialog');
	// }

	var list_hover = $(".list_hover");

	list_hover.delegate('tr', 'mouseover', function () {
		$(this).addClass('trhover');
	});

	list_hover.delegate('tr', 'mouseout', function () {
		$(this).removeClass('trhover');
	});

	list_hover.delegate('tr', 'click', function () {
		if($(this).hasClass('tractive')){
			$(this).removeClass('tractive');
		}else{
			list_hover.find('tr').removeClass('tractive');
			$(this).addClass('tractive');
		}
	});


	list_hover.each(function () {
		$(this).find("tr").each(function (i) {
			if(i%2){
				$(this).addClass('eachColor');
			}
		});
	});

    $("#btnopendate1").click(function () {
        var that = $(this);
		dialog({
			title: that.html(),
			url: '/SixOpenSchedule/six_open_date.aspx',
			fixed: false,
			onshow: function () {
			},
			onclose: function () {
			}
		}).show();
        // that.myLayer({
        //     title: that.html(),
        //     isShowBtn: false,
        //     isMiddle: true,
        //     url: '/SixOpenSchedule/six_open_date.aspx'
        // });
    });

    $("#btnvrcaropenvideo").click(function () {
        var that = $(this);
        dialog({
            title: that.html(),
            url: '/VRVIDEO/vrcar_open_video.aspx',
            fixed: false,
            onshow: function () {
            },
            onclose: function () {
            }
        }).show();
    });

    $("#btnvrsscopenvideo").click(function () {
        var that = $(this);
        dialog({
            title: that.html(),
            url: '/VRVIDEO/vrssc_open_video.aspx',
            fixed: false,
            onshow: function () {
            },
            onclose: function () {
            }
        }).show();
    });


});