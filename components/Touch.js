var util = require('../util.js');

function Touch(em){
	this.emitter = em;
	
	this.state = 0;

	this.press_time = 0;
	this.release_time = 0;

	this.event_types = ['touch', 'untouch'];
}

Touch.prototype.update = function(next_state, tx, ty){
	if( this.state == next_state ){
		return;
	}

	if( this.state == 0 && next_state == 1 ){
		this.press_time = Date.now();
		this.state = next_state;

		this.emitter.emit('touch', {
			timestamp: this.press_time,
			x: tx,
			y: ty,
			normx: util.map([-32768, 32767], [-1, 1], tx),
			normy: util.map([-32768, 32767], [-1, 1], ty)
		});
	}
	else {
		this.release_time = Date.now();
		this.state = next_state;

		this.emitter.emit('untouch', {
			timestamp: this.release_time,
			duration: this.release_time - this.press_time
		});
	}
}

module.exports = Touch;