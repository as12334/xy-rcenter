seajs.config({
	'base': resRoot + '/js',
	'alias':{
		'jquery': 'plugin/jquery-1.10.2',
        'myLayer': 'plugin/myLayer',
		'juicer': 'juicer-min',
		'json2': 'json2',
		'tips': 'tips',
		'getBaseDataAjax': 'getBaseDataAjax',

		'checkPwd': 'checkPwd',
		'Bet': 'Bet',
		'reportCurrentphase': 'reportCurrentphase',
		'LoginValidate': 'LoginValidate',
		'login': 'login',
		'layer': 'layer/layer',
		'dialog': 'dialog-plus',
		'gameHall': 'gameHall',
		'global': 'global'
	},
	'map': [
		[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + top.jsver ]
	]
});
