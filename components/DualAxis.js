var util = require('../util.js');

function DualAxis(em){
	this.emitter = em;

	this.move_state = { x: 0, y: 0 };
	this.prev_move_state = { x: 0, y: 0 };

	this.move_start = 0;
	this.move_stop = 0;

	this.last_pressed_state = 0;

	this.event_types = ['move start', 'move', 'move stop'];
}

DualAxis.prototype._swapState = function(x,y){
	this.prev_move_state.x = this.move_state.x;
	this.prev_move_state.y = this.move_state.y;

	this.move_state.x = x;
	this.move_state.y = y;
}

DualAxis.prototype.update = function(next_x, next_y, pressed){
	var ctime = Date.now();

	if( !pressed ){
		// just stopped moving
		if( this.last_pressed_state == 1 ){
			this.move_stop = ctime;

			this._swapState(next_x, next_y);

			this.emitter.emit('move stop', {
				timestamp: ctime,
				duration: this.move_stop - this.move_start
			});
		}

		this.last_pressed_state = pressed;

		return;
	}

	// just started moving
	if( this.last_pressed_state == 0 ){
		this.move_start = ctime;

		this._swapState(next_x, next_y);

		this.emitter.emit('move start', {
			timestamp: ctime
		});
	}
	// been moving
	else {
		this._swapState(next_x, next_y);

		this.emitter.emit('move', {
			timestamp: ctime,
			x: this.move_state.x,
			y: this.move_state.y,
			normx: util.map([-32768, 32767], [-1, 1], this.move_state.x),
			normy: util.map([-32768, 32767], [-1, 1], this.move_state.y),
			deltax: this.move_state.x - this.prev_move_state.x,
			deltay: this.move_state.y - this.prev_move_state.y
		});
	}

	this.last_pressed_state = pressed;
}

module.exports = DualAxis;