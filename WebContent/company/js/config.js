seajs.config({
	'base': resRoot + '/js',
	'alias':{
		'jquery':'jquery.js',
		'Betimes': 'Betimes.pack.js'
	},
    // 'alias':{
    //     'jquery':'jquery-1.10.2',
    //     'dialog':'dialog-plus-min',
    //     'getBaseDataAjax':'getBaseDataAjax',
    //     'array':'array',
    //     'plus': 'plus',
    //     'fastFlyAway': 'fastFlyAway',
    //     'tips': 'tips',
    //     'fullmask': 'fullmask',
    //     'Betimes': 'Betimes.js'
    // },
	'map': [
		[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + top.jsver ]
	]
});
setTimeout(function () {
	setScript();
}, 10);

var initTimer = null;
function setScript(isInit) {
	seajs.use(['jquery','Betimes'], function (jquery, Betimes) {
		if(isInit){
			clearTimeout(initTimer);
			initTimer = null;
			initTimer = setTimeout(function () {
				Betimes._init();
			}, 10);
		}
	});
}
