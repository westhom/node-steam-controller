function DPad(em){
	this.emitter = em;
	
	this.state = {
		up: { state: 0, release_time: 0, press_time: 0 },
		down: { state: 0, release_time: 0, press_time: 0 },
		left: { state: 0, release_time: 0, press_time: 0 },
		right: { state: 0, release_time: 0, press_time: 0 }
	};

	this.press_time = 0;
	this.release_time = 0;

	this.event_types = [
		'up press', 'up release',
		'down press', 'down release',
		'left press', 'left release',
		'right press', 'right release'
	];
}

DPad.prototype._updateGeneric = function(id, next_state){
	if( this.state[id].state == next_state ){
		return;
	}

	if( this.state[id].state == 0 && next_state == 1 ){
		this.state[id].press_time = Date.now();
		this.state[id].state = next_state;

		this.emitter.emit(id + ' press', {
			timestamp: this.state[id].press_time
		});
	}
	else {
		this.state[id].release_time = Date.now();
		this.state[id].state = next_state;

		this.emitter.emit( id + ' release', {
			timestamp: this.state[id].release_time,
			duration: this.state[id].release_time - this.state[id].press_time
		});
	}
}

DPad.prototype.update = function(up, down, left, right){
	this._updateGeneric('up', up);
	this._updateGeneric('down', down);
	this._updateGeneric('left', left);
	this._updateGeneric('right', right);
}

module.exports = DPad;