seajs.config({
    'base': resRoot + '/js',
	'alias':{
        'jquery': 'plugin/jquery-1.10.2',
		'json2': 'json2',
		'pkbjl': 'pkbjl',
		'layer': 'layer/layer',
		// 'tips': 'tips',
		// 'getBaseDataAjax': 'getBaseDataAjax',
		// 'myLayer': 'myLayer',
		// 'skinChange': 'skinChange',
		// 'game_global': 'game_global'
		'game_global': 'game_global.pack'
	},
	'map': [
		[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + top.jsver ]
	]
});