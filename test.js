var SteamController = require('./index.js');

var controller = new SteamController(1);

var presses = [
	'x','y','a','b',
	'home','back','forward',
	'ltrigger','rtrigger',
	'lgrip','rgrip',
	'lshoulder','rshoulder',
	'stick',
	'lpad','rpad'
];

presses.forEach(function(name){
	controller[name].on('press', function(ev){
		console.log(name,'press',ev);
	})

	controller[name].on('release', function(ev){
		console.log(name,'release',ev);
	})
});

['ltrigger','rtrigger', 'stick', 'lpad', 'rpad'].forEach(function(name){
	['move start', 'move stop', 'move'].forEach(function(type){
		controller[name].on(type, function(ev){
			console.log(name,type, ev);
		});
	});
});

['lpad','rpad'].forEach(function(name){
	['touch', 'untouch'].forEach(function(type){
		controller[name].on(type, function(ev){
			console.log(name,type, ev);
		});
	});
});

['up', 'down', 'left', 'right'].forEach(function(name){
	controller.lpad.on( name + ' press', function(ev){
		console.log('lpad press', name, ev);
	});

	controller.lpad.on( name + ' release', function(ev){
		console.log('lpad releases', name, ev);
	});
});

controller.connect();