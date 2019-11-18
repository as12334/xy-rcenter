seajs.config({
	'base':'/Scripts',
	'alias':{
		'jquery':'jquery-1.10.2',
		'juicer': 'juicer-min',
		'json2': 'json2',
		'tips': 'tips',
		'getBaseDataAjax': 'getBaseDataAjax',
		'myLayer': 'myLayer',
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
