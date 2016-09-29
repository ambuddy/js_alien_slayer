
function BootState() {
	
}

BootState.prototype = Object.create(State.prototype);
BootState.prototype.constructor = BootState;

BootState.prototype.preload = function () {
	
	this.load.image('bg_pattern', 'res/bg_pattern.png');
	this.load.image('preloadLogo', 'res/preload.png');
	this.load.spritesheet('heli_vint', 'res/vint_sheet.png', 118, 80);
}

BootState.prototype.create = function () {
	this.state.start('PreloadState');
}