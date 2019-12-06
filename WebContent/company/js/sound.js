define(function (require, exports, module) {
	// 引入jQuery
	var $ = require('jquery');

	var console = console || {log:function(){return false;}};

	function sound(src) {
		if($("#Sound").length == 0){
			$("body").append('<div id="Sound"></div>');
		}
		if(src == 'jp'){
			if(top.soundSwitch2){
				var IE = !-[1,];
				if(IE){
					$("#Sound").html("<embed src='../images/sound_"+ src +".swf' loop=false autostart=false mastersound hidden=true width=0 height=0></embed>");
				}else{
					$("#Sound").html('<audio controls="controls" autoplay="autoplay" style="display:none"><source src="'+resRoot+'/images/sound_'+ src +'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>');
				}	
			}
		}else{
			if(top.soundSwitch){
				var IE = !-[1,];
				if(IE){
					$("#Sound").html("<embed src='../images/sound_"+ src +".swf' loop=false autostart=false mastersound hidden=true width=0 height=0></embed>");
				}else{
					$("#Sound").html('<audio controls="controls" autoplay="autoplay" style="display:none"><source src="../images/sound_'+ src +'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>');
				}	
			}
		}
	}

	module.exports = sound;
});