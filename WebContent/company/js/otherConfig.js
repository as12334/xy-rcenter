seajs.config({
    'base': resRoot + '/js',
	'alias':{
        'jquery': 'plugin/jquery-1.10.2',
		'login': 'login',
		'plus':'plus',
		'alert': 'alert',
		'tabEvent': 'tabEvent',
		'wdatePicker': '/Plus/My97DatePicker/WdatePicker',
		'index': 'index',
		'sub': 'sub',
		'myLayer': 'myLayer',
		'news': 'news',
		'listHover': 'listHover',
		'awardPeriod': 'awardPeriod',
		'lottery_add': 'lottery_add',
		'hy_profit': 'hy_profit',
		'lotteryConfig': 'lotteryConfig',
		'pageLoad': 'pageLoad',
		'dialog': 'dialog-plus',
		'checkPwd': 'checkPwd',
		'reportCurrentphase': 'reportCurrentphase',
		'doubleMyLayer': 'doubleMyLayer',
		'sound': 'sound'
	},
	'map': [
		[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + top.jsver ]
	]
});

function closeDialg () {
	$.myLayer.close(true);
}