var EventEmitter = require('events');

function Input(...types){
	this.emitter = new EventEmitter();

	this.events = {};
	this.components = {};

	var that = this;

	// create a mapping of all the event types each component supports
	types.forEach(function(type){
		// pass this input's emitter
		var tobj = new type(that.emitter);

		tobj.event_types.forEach(function(ev){
			that.events[ev] = tobj;
		});

		// add to components list
		that.components[tobj.constructor.name] = tobj;
	});
}

Input.prototype.on = function(event, listener){
	if( Object.keys(this.events).indexOf(event) == -1 ){
		return;
	}

	this.emitter.addListener(event, listener);
}

Input.prototype.update = function(id, ...args){
	this.components[id].update(...args);
}

module.exports = Input;