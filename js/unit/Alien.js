﻿
function Alien(state, type) {
	
	Unit.call(this, state);
	
	this.type = type;
	this.heli = state.heli;	//console.log('Alien.this.heli = ', this.heli);
	
	this.cont = this.game.add.group( state.cont );
	this.cont.x = this.game.rnd.between( Game.safe_border*2, this.state.levelConfig.world[0] - Game.safe_border*2 );
	this.cont.y = this.game.rnd.between( Game.safe_border*2, this.state.levelConfig.world[1] - Game.safe_border*2 );
	
	this.body = this.game.add.image(0, 0, type);
	this.body.anchor.setTo(0.5, 0.5);
	this.body.scale.set(0.7);
	this.body.inputEnabled = true;
	//this.body.events.onInputDown.add(this.cont.destroy, this.cont);
	
	if(Game.shadowsOn) {
		this.shadow = this.game.add.sprite(40, -50, type);
		this.shadow.anchor.setTo(0.5, 0.5);
		this.shadow.tint = 0x000000;
		this.shadow.scale.set(this.body.scale.x * 0.7);
		this.shadow.alpha = 0.3;
		this.cont.addChild(this.shadow);
	}
		
	this.cont.addChild(this.body);
	
	this.addHitArea({width:50, height:50});
	
	this.addLifeBar();
}

Alien.prototype = Object.create(Unit.prototype);
Alien.prototype.constructor = Alien;

Alien.prototype.update = function () {
	
	var angle = this.game.math.radToDeg( this.game.physics.arcade.angleBetween(this.cont, this.heli.cont) );
	
	this.body.frame = this.degToFrame( angle );
	
	if(this.shadow) {
		this.shadow.frame = this.degToFrame( angle );
	}
	
	if(this.life < 100) {
		this.updateLifeBar();
	}
}
