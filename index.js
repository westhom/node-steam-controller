var HID = require('node-hid');
var EventEmitter = require('events');

var Input = require('./components/Input.js');

var SimpleButton = require('./components/SimpleButton.js');
var SingleAxis = require('./components/SingleAxis.js');
var DualAxis = require('./components/DualAxis.js');
var Touch = require('./components/Touch.js');
var DPad = require('./components/DPad.js');

var product_id = 0x1142;

var platforms = {
	win32: function(dev){
		return dev.productId == product_id && dev.path.includes('&mi_01');
	},
	darwin: function(dev){
		return dev.productId == product_id && dev.path.includes('IOUSBHostInterface@1');
	},
	linux: function(dev){
		return dev.productId == product_id && dev.path.includes(':01');
	}
};

function SteamController(dindex){
	this.hid;
	this.controller_device;

	if( Object.keys(platforms).indexOf(process.platform) > -1 ){
		this.controller_device = HID.devices().find( platforms[process.platform] );
	}
	else {
		throw 'node-steam-controller: platform unsupported';
	}

	if( !this.controller_device ){
		throw 'node-steam-controller: controller device not found';
	}

	this.x = new Input(SimpleButton);
	this.y = new Input(SimpleButton);
	this.a = new Input(SimpleButton);
	this.b = new Input(SimpleButton);

	this.back = new Input(SimpleButton);
	this.forward = new Input(SimpleButton);
	this.home = new Input(SimpleButton);

	this.ltrigger = new Input(SimpleButton, SingleAxis);
	this.rtrigger = new Input(SimpleButton, SingleAxis);

	this.lshoulder = new Input(SimpleButton);
	this.rshoulder = new Input(SimpleButton);

	this.lgrip = new Input(SimpleButton);
	this.rgrip = new Input(SimpleButton);

	this.stick = new Input(SimpleButton, DualAxis);

	this.lpad = new Input(SimpleButton, Touch, DualAxis, DPad);
	this.rpad = new Input(SimpleButton, Touch, DualAxis);
}

SteamController.prototype.connect = function(){
	this.hid = new HID.HID(this.controller_device.path);
	this.hid.on('data', this._onData.bind(this));
}

SteamController.prototype._debugButtons = function(buttons){
	var b = buttons.toString(2);

	if( b.length < 32 ){
		b = (new Array(33 - b.length)).join('0') + b;
		console.log(b);
	}
}

SteamController.prototype._debugData = function(data){
	console.log(data.toString('hex').match(/.{1,2}/g).join(' '));
}

SteamController.prototype._onData = function(data){
	// keep alive frame? sent every 1000ms~
	if( data.readUInt16BE(13) == 0x0C64 ){
		return;
	}

	var buttons = data.readUInt32BE(7);

	//
	// basic buttons
	//
	this.x.update( 'SimpleButton', buttons >> 22 & 1 );
	this.a.update( 'SimpleButton', buttons >> 23 & 1 );
	this.b.update( 'SimpleButton', buttons >> 21 & 1 );
	this.y.update( 'SimpleButton', buttons >> 20 & 1 );

	this.lshoulder.update( 'SimpleButton', buttons >> 19 & 1 );
	this.rshoulder.update( 'SimpleButton', buttons >> 18 & 1 );

	this.lgrip.update( 'SimpleButton', buttons >> 15 & 1 );
	this.rgrip.update( 'SimpleButton', buttons & 1 );

	this.back.update( 'SimpleButton', buttons >> 12 & 1 );
	this.forward.update( 'SimpleButton', buttons >> 14 & 1 );
	this.home.update( 'SimpleButton', buttons >> 13 & 1 );

	//
	// triggers
	//
	this.ltrigger.update( 'SingleAxis', data.readUInt8(11) );
	this.rtrigger.update( 'SingleAxis', data.readUInt8(12) );

	this.ltrigger.update( 'SimpleButton', buttons >> 17 & 1 );
	this.rtrigger.update( 'SimpleButton', buttons >> 16 & 1 );

	//
	// stick
	//
	this.stick.update( 'SimpleButton', (buttons >> 6 & 1) && (buttons >> 1 & 1) );

	var LX = data.readInt16LE(16);
	var LY = data.readInt16LE(18);
	var RX = data.readInt16LE(20);
	var RY = data.readInt16LE(22);

	var Ltouched = buttons >> 3 & 1;
	var Rtouched = buttons >> 4 & 1;

	// stick and left pad share same x/y offset in bit stream
	// using both at once will interleave data; TODO: fix this

	// special case for stick being "touched"
	this.stick.update( 'DualAxis', LX, LY, (LX != 0 || LY != 0) && !Ltouched);

	//
	// pads
	//
	this.lpad.update( 'Touch', Ltouched, LX, LY );
	this.rpad.update( 'Touch', Rtouched, RX, RY );

	this.lpad.update( 'DualAxis', LX, LY, Ltouched );
	this.rpad.update( 'DualAxis', RX, RY, Rtouched );

	this.lpad.update( 'SimpleButton', buttons >> 1 & 1);
	this.rpad.update( 'SimpleButton', buttons >> 2 & 1);

	this.lpad.update( 'DPad', buttons >> 8 & 1, buttons >> 11 & 1, buttons >> 10 & 1, buttons >> 9 & 1 );
}

module.exports = SteamController;
