function SingleAxis(em){
	this.emitter = em;

	this.move_state = 0;
	this.prev_move_state = 0;

	this.move_start = 0;
	this.move_stop = 0;

	this.event_types = ['move start', 'move', 'move stop'];
}

SingleAxis.prototype.update = function(next_state){
	// not moving
	if( (this.move_state == 0 || this.move_state == 255) && (next_state == 0 || next_state == 255) ){
		return;
	}

	var ctime = Date.now();

	// just started
	if( (this.move_state == 0 || this.move_state == 255) && (next_state != 0 && next_state != 255 ) ){
		this.move_start = ctime;

		this.prev_move_state = this.move_state;
		this.move_state = next_state;

		this.emitter.emit('move start', {
			timestamp: ctime
		});

		return;
	}

	// just stopped
	if( (this.move_state != 0 && this.move_state != 255)  && (next_state == 0 || next_state == 255 ) ){
		this.move_stop = ctime;

		this.prev_move_state = this.move_state;
		this.move_state = next_state;

		this.emitter.emit('move stop', {
			timestamp: ctime,
			duration: this.move_stop - this.move_start,
			state: next_state == 0 ? 'released' : 'pressed'
		});

		return;
	}

	this.prev_move_state = this.move_state;
	this.move_state = next_state;

	this.emitter.emit('move', {
		timestamp: ctime,
		val: next_state,
		normval: next_state / 255,
		delta: this.move_state - this.prev_move_state
	});
}

module.exports = SingleAxis;