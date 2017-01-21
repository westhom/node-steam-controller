# Steam Controller
Easy input events from your Steam Controller for Mac, Windows, and Linux.

## Quick Start
```javascript
var SteamController = require('node-steam-controller');
var controller = new SteamController();

controller.x.on('press', function(event){
	console.log('X button pressed down at', event.timestamp);
});

controller.b.on('release', function(event){
	console.log('B button held down for', event.duration, 'ms');
});

controller.stick.on('move', function(event){
	console.log('stick moved to', event.x, event.y);
});

controller.rpad.on('touch', function(event){
    console.log("the right pad was touched at", event.x, event.y);
});
```

For a full list of button types and events, see [API.md](API.md).

## Platform Notes
### Ubuntu
If you get a "native" error when launching the script on Ubuntu, you may have 
restrictive udev permissions for your input devices. Create the file 
`/etc/udev/rules.d/steamcontroller.rules` with the following content (adapted from 
[node-hid linux notes](https://github.com/node-hid/node-hid#udev-device-permissions)).

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="28de", ATTRS{idProduct}=="1142", MODE:="0666", GROUP="plugdev"
```

Run `sudo udevadm control --reload-rules` after adding the file, or restart your system.

## Todo
- Add gyroscope and accelerometer events
- Add rumble support
- Play sounds through controller?
- More testing across Linux distros