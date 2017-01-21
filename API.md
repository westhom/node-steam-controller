# Steam Controller API
## Basic Buttons
### Property names

`x`, `y`, `a`, `b`, `back`, `home`, `forward`, `lshoulder`, `rshoulder`, `lgrip`, `rgrip`

### Emits
`press`, `release`

### Event Details

**press** - button pressed down
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**release** - button released
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

## Triggers
### Property Names

`ltrigger`, `rtrigger`

### Emits
`press`, `release`, `move start`, `move`, `move stop`

### Event Detail

**press** - trigger physically pressed down until it clicks
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**release** - trigger released from clicked state
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**move start** - trigger has just moved away from its released position
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**move** - trigger is moving (or being held) between its released position and pressed position
```javascript
{
	timestamp: <Unix timestamp in ms>,
	val: <0 to 255>,
	normval: <0.0 to 1.0>,
	delta: <difference between this val and previous val>
}
```

**move stop** - trigger has stopped moving at either its released position or pressed position
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>,
	state: <pressed | released>
}
```

## Touch pads
### Property Names
`lpad`, `rpad`

### Emits
`press`, `release`, `touch`, `untouch`, `move start`, `move`, `move stop`

Left pad only: `up press`, `up release`, `down press`, `down release`, `left press`, `left release`, `right press`, `right release`

### Event Details
**press** - pad physically pressed down until it clicks
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**release** - pad released from its pressed state
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**touch** -  pad capacitive touch
```javascript
{
	timestamp: <Unix timestamp in ms>,
	x: <-32768 to 32768>,
	y: <-32768 to 32768>,
	normx: <-1.0 to 1.0>,
	normy: <-1.0 to 1.0>
}
```

**untouch** - capacitive touch release
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**move start**
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**move**
```javascript
{
    timestamp: <Unix timestamp in ms>,
    x: <-32768 to 32768>,
    y: <-32768 to 32768>,
    normx: <-1.0 to 1.0>,
    normy: <-1.0 to 1.0>,
    deltax: <difference between this x and last x>,
    deltay: <difference between this y and last y>
}
```

**move stop**
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**up press** - up on dpad pressed down physically
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**up release** - up on dpad released from pressed state
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**down press**

**down release**

**left press**

**left release**

**right press**

**right release**

## Stick

### Property Name
`stick`

### Emits
`press`, `release`, `move start`, `move`, `move stop`

**press**
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**release**
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```

**move start** - stick just moved from rest position
```javascript
{
	timestamp: <Unix timestamp in ms>
}
```

**move** - stick moving (or being held) away from rest position
```javascript
{
    timestamp: <Unix timestamp in ms>,
    x: <-32768 to 32768>,
    y: <-32768 to 32768>,
    normx: <-1.0 to 1.0>,
    normy: <-1.0 to 1.0>,
    deltax: <difference between this x and last x>,
    deltay: <difference between this y and last y>
}
```

**move stop** - stick returned to or moved through its rest position [0,0], even if for a brief instant while quickly thrashing it around.
```javascript
{
	timestamp: <Unix timestamp in ms>,
	duration: <ms>
}
```