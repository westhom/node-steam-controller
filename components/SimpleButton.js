function SimpleButton(em){
	this.emitter = em;
	
	this.state = 0;

	this.press_time = 0;
	this.release_time = 0;

	this.event_types = ['press', 'release'];
}

SimpleButton.prototype.update = function(next_state){
	if( this.state == next_state ){
		return;
	}

	if( this.state == 0 && next_state == 1 ){
		this.press_time = Date.now();
		this.state = next_state;

		this.emitter.emit('press', {
			timestamp: this.press_time
		});
	}
	else {
		this.release_time = Date.now();
		this.state = next_state;

		this.emitter.emit('release', {
			timestamp: this.release_time,
			duration: this.release_time - this.press_time
		});
	}
}

module.exports = SimpleButton;