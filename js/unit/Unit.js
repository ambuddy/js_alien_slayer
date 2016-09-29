
function Unit(state) {
	
	EventDispatcher.call(this);
	
	this.state = state;
	this.game = state.game;
	this.cont;
	this.body;
	this.hit;
	this.life = 100;
}
Unit.prototype = Object.create(EventDispatcher.prototype);
Unit.prototype.constructor = Unit;

Unit.DESTROYED = "DESTROYED";
Unit.KILLED = "KILLED";
Unit.MOVED = "MOVED";

Unit.prototype.exists = function() {
	if(this.cont) return this.cont.exists;
}
Unit.prototype.kill = function() {
	if(this.cont) this.cont.destroy();
	this.life = 0;
	this.dispatchEvent({type:Unit.KILLED});
}
Unit.prototype.destroy = function() {
	if(this.cont) {
		this.cont.destroy();
	}
	if(this.sounds) {
		for( var prop in this.sounds ) {
			if( this.sounds.hasOwnProperty(prop) ) {
				this.sounds[prop].destroy();
			}
		}
	}
	this.life = 0;
	this.dispatchEvent({type:Unit.DESTROYED});
}


Unit.prototype.damage = function(weapon, bullet) {
	//console.log("Unit.prototype.damage 1", this);
	if(!this.cont || !this.exists() || this.life <=0 ) {
		return;
	}
	//console.log("Unit.prototype.damage 2", this);
	var damage = weapon.damage;
	if(weapon.weaken) {
		damage = weapon.damage - weapon.damage * ( (bullet.traveled <= bullet.traveled / 5 ? 0 : bullet.traveled) / weapon.distance );
	}
	this.life -= Math.floor(damage);
	if(this.life <= 0) {
		this.kill();
	}
}

Unit.prototype.updateLifeBar = function() {
	//console.log("Unit.prototype.updateLifeBar 1", this);
	if(!this.lifeBar) {
		return;
	}
	//console.log("Unit.prototype.updateLifeBar 2", this.life);
	if(this.life < 100) {
		this.lifeBar.alpha = 1;
	}
	this.lifeBar.life.scale.x = this.life / 100;
}

Unit.prototype.addHitArea = function(rect) {
	var x = rect.x != undefined ? rect.x : -rect.width/2;
	var y = rect.y != undefined ? rect.y : -rect.height/2;
	var hit = this.game.add.graphics(0, 0);
	hit.width = rect.width;
	hit.height = rect.height;
	hit.alpha = (Game.debug ? 1 : 0);
	//if(Game.debug) {
		hit.lineStyle(1, 0x06F900);
		hit.beginFill(0x8FA67B, 0.5);
		hit.drawRect(-rect.width/2, -rect.height/2, rect.width, rect.height);
		hit.endFill();
		hit.moveTo(-rect.width/2, 0);
		hit.lineTo(rect.width/2, 0);
		hit.moveTo(0, -rect.height/2);
		hit.lineTo(0, rect.height/2);
	//}
	this.cont.addChild(hit);
	this.hit = hit;
	return hit;
}

Unit.prototype.addLifeBar = function() {
	//console.log("Unit.prototype.addLifeBar", this);
	var bar = this.game.add.group();
	bar.alpha = 0;
	bar.x = -25;
	bar.y = -25;
	var bg = this.game.add.graphics(0, 0);
	bg.lineStyle(2, 0x8FA67B);
	bg.lineTo(50, 0);
	bar.life = this.game.add.graphics(0, 0);
	bar.life.lineStyle(2, 0x06F900);
	bar.life.lineTo(50, 0);
	bar.addChild(bg);
	bar.addChild(bar.life);
	this.cont.addChild(bar);
	this.lifeBar = bar;
	return bar;
}

Unit.prototype.degToFrame = function(angle) {
			
	angle *= -1;					// реверт угла, т.к. порядок фреймов против часовой, а углы по часовой. ToDo: переделать фреймы наоборот
	
	if( angle < 0 ) angle += 360;	// углы в Phaser в диапазоне [-180:180], конвертим в [0:360]
	
	var frameSector = 22.5;			// сектор соответствующий 1 фрейму = 360/16
	
	return Math.round( angle / frameSector );
}

Unit.prototype.angleToPointer = function(cont) {
	
	return this.game.math.radToDeg( this.game.physics.arcade.angleToPointer(cont) );
}

Unit.prototype.angleBetween = function(cont, target) {
	
	return this.game.math.radToDeg( this.game.physics.arcade.angleBetween(cont, target) );
}

Unit.prototype.isInsideWorld = function() {
	var rectW = this.state.levelConfig.world[0];
	var rectH = this.state.levelConfig.world[1];
	return Game.isInside( this.cont, { x:0, y:0, width:rectW, height:rectH } );
}

Unit.prototype.isInsideSafe = function() {
	var rectW = this.state.levelConfig.world[0] - Game.safe_border*2;
	var rectH = this.state.levelConfig.world[1] - Game.safe_border*2;
	return Game.isInside( this.cont, { x:Game.safe_border, y:Game.safe_border, width:rectW, height:rectH } );
}

/* Unit.prototype.isOverlap = function(cont, target) {
	
	return this.game.physics.arcade.overlap(cont, target);
} */

