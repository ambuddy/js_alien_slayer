
function UI(state, weapons) {
	
	EventDispatcher.call(this);
	
	this.KEY_RELEASED = "KEY_RELEASED";
	this.MOUSE_RELEASED = "MOUSE_RELEASED";
	
	this.state = state;
	this.game = state.game;
	
	this.setupKeys();
	
	this.cont = this.game.add.group();
	this.cont.fixedToCamera = true;
	
	var plate = this.game.add.image(0, 0, 'sprites', 'ui_top_plate.png');
	
	this.guns = this.game.add.group();
	this.guns.x = 25;
	this.guns.y = 2;
	
	var bg = this.game.add.graphics(0, 0);
	bg.beginFill(0x000000, 0.5);
	bg.drawRect(200, 0, Game.width-200, 40);
	bg.endFill();
	
	var picGun;
	for(var i=0; i<weapons.length; i++) {
		picGun = this.game.add.image(0, 0, 'guns', weapons[i] - 1, this.guns);
		picGun.x = i * 70;
	}
	this.weapons = weapons;
	this.currentGun = 0;
	
	this.gunFrame = this.game.add.graphics(0, 0);
	this.gunFrame.lineStyle(1, 0x06F900);
	this.gunFrame.drawRect(24, 1, picGun.width+2, picGun.height+2);
	
	this.statTxt = this.game.add.text(Game.width - 80, 10, "Aliens: "+10, { font:"bold 10pt Arial", fill:"#FFF", align:'right' });
	
	this.cont.addChild(bg);
	this.cont.addChild(plate);
	this.cont.addChild(this.guns);
	this.cont.addChild(this.gunFrame);
	this.cont.addChild(this.statTxt);
}

UI.prototype = Object.create(EventDispatcher.prototype);
UI.prototype.constructor = UI;

UI.prototype.update = function() {
	this.updateKeys();
	this.statTxt.text = "Aliens: "+this.state.aliens.length;
}

UI.prototype.setGunFrame = function() {
	var tween = this.game.add.tween(this.gunFrame).to( {x:70*this.currentGun}, 100, "Linear", true );
}

UI.prototype.setupKeys = function() {
	var keyboard = this.game.input.keyboard;
	var cursors = keyboard.createCursorKeys();
		cursors.w = keyboard.addKey(Phaser.KeyCode.W);
		cursors.a = keyboard.addKey(Phaser.KeyCode.A);
		cursors.s = keyboard.addKey(Phaser.KeyCode.S);
		cursors.d = keyboard.addKey(Phaser.KeyCode.D);
	this.cursors = cursors;
	
	this.game.input.keyboard.onUpCallback = this.onKeyRelease.bind(this);
	
	this.game.input.mouse.mouseUpCallback = this.onMouseRelease.bind(this);
}

UI.prototype.onKeyRelease = function(event) {
	if( Game.debug ) console.log("UI", event);
	this.dispatchEvent( { type:this.KEY_RELEASED, key:event.key } );
	
	switch( event.key ) {
		case "1" : case "2" : case "3" : case "4" : case "5" :
			if(Number(event.key) > this.weapons.length) break;
			this.currentGun = Number(event.key) - 1;
			this.setGunFrame();
			break;
	}
}

UI.prototype.onMouseRelease = function(event) {
	//if( Game.debug ) console.log("UI", event);
	var m = this.game.input.mouse;
	this.dispatchEvent( { type:this.MOUSE_RELEASED, position:m.positionUp, beenPressed:m.timeUp - m.timeDown } );
}

UI.prototype.updateKeys = function() {
	
	var cur = this.cursors;
	
	this.isDown = {};
	this.isUp = {};
	
	this.isAnyKeyDown = false;
	this.isLeftDown = false;
	this.isRightDown = false;
	this.isUpDown = false;
	this.isDownDown = false;
	this.isShiftDown = false
		
	if( cur.left.isDown || cur.a.isDown ) {
		this.isDown.left = this.isDown.anyKey = true;
	}
	else if( cur.right.isDown || cur.d.isDown ) {
		this.isDown.right = this.isDown.anyKey = true;
	}
	if( cur.up.isDown || cur.w.isDown ) {
		this.isDown.up = this.isDown.anyKey = true;
	}
	else if( cur.down.isDown || cur.s.isDown ) {
		this.isDown.down = this.isDown.anyKey = true;
	}
	if( this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) ) {
		this.isDown.shift = this.isDown.anyKey = true;
	}
	
	this.isUp.mouse = this.game.input.activePointer.isUp;
	this.isDown.mouse = this.game.input.activePointer.isDown;
}
