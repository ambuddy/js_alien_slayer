
function Helicopter(state, weapons, currentWeapon) {
	
	Unit.call(this, state);
	
	this.ui = state.ui;
	
	this.speed = 5;
	this.speed2 = 10;
	
	this.cont = this.game.add.group( state.cont );
	this.cont.x = 300;
	this.cont.y = 200;
	
	this.preXY = {x:0, y:0};
	
	var vint = this.game.add.image(-58, -35, 'heli_vint');			//set to zero xy
	vint.animations.add('vint');
	vint.animations.play('vint', 30, true);
	
	this.body = this.game.add.image(-102, -53, 'heli');			//set to zero xy
	//this.body.anchor.setTo(0.5, 0.444);
	
	if(Game.shadowsOn) {
		this.shadow = this.game.add.image(-40, -80, 'heli');
		//this.shadow.anchor.setTo(0.5, 0.444);
		this.shadow.tint = 0x000000;
		this.shadow.scale.set(0.7);
		this.shadow.alpha = 0.3;
		this.cont.addChild(this.shadow);
	}
	
	this.cont.addChild(this.body);
	this.cont.addChild(vint);
	
	this.weapons = this.createWeapons(weapons);
	this.currentWeapon = currentWeapon;
	
	var flySound = this.game.add.audio('heli_fly');
	flySound.play("", 0, 0, true);		// @marker, @position, @volume, @loop
	this.game.add.tween(flySound).to( { volume: 0.6 }, 1000, "Linear", true);
	this.sounds = {fly:flySound};
	
	//
	this.weapons.forEach( function(weapon) {
		this.ui.addEventListener(this.ui.MOUSE_RELEASED, weapon.onMouseRelease, weapon);
	}.bind(this) );
	
	this.addHitArea({width:40, height:40});
}

Helicopter.prototype = Object.create(Unit.prototype);
Helicopter.prototype.constructor = Helicopter;

Helicopter.prototype.update = function () {
	
	var angle = this.angleToPointer( this.cont );
	
	this.body.frame = this.degToFrame( angle );
	
	if(this.shadow) {
		this.shadow.frame = this.degToFrame( angle );
	}
	
	this.checkKeys();
	
	if( this.ui.isDown.mouse ) {
		//console.log("Helicopter.update", this.currentWeapon, this.weapons[this.currentWeapon]);
		this.weapons[this.currentWeapon].fire();
	}
	
	this.weapons.forEach( function(weapon) {
		weapon.update();
	} );
}

/*
 * @weapons:Array - массив с номерами орудий
 */
Helicopter.prototype.createWeapons = function(weapons) {
	var arr = [];
	weapons.forEach( function(num) {
		//console.log("Helicopter.createWeapons arr", arr);
		switch( num ) {
			case 1 : arr.push( new Gun(this.state, this.cont) ); 				break;
			case 2 : arr.push( new AutomaticGun(this.state, this.cont) ); 		break;
			case 3 : arr.push( new MachineGun(this.state, this.cont) ); 			break;
			case 4 : arr.push( new RocketLauncher(this.state, this.cont) ); 		break;
			case 5 : arr.push( new RocketLauncherAuto(this.state, this.cont) ); 	break;
		}
	}.bind(this) );
	return arr;
}

Helicopter.prototype.checkKeys = function() {
	
	var speed = (this.ui.isDown.shift ? this.speed2 : this.speed);
	
	if( this.ui.isDown.left && this.isInsideSafe().x != -1 ) {
		this.cont./*body.velocity.*/x -= speed;
	}
	else if( this.ui.isDown.right && this.isInsideSafe().x != 1 ) {
		this.cont.x += speed;
	}
	if( this.ui.isDown.up && this.isInsideSafe().y != -1 ) {
		this.cont.y -= speed;
	}
	else if( this.ui.isDown.down && this.isInsideSafe().y != 1 ) {
		this.cont.y += speed;
	}
	
	var moveDelta = {x:this.cont.x - this.preXY.x, y:this.cont.y - this.preXY.y};
	if( moveDelta.x || moveDelta.y ) {
		this.dispatchEvent({type:Unit.MOVED});
	}
	this.preXY = {x:this.cont.x, y:this.cont.y};
}

Helicopter.prototype.changeWeapon = function(to) {
	//console.log("Helicopter.changeWeapon from", this.currentWeapon, "to", to-1);
	if(to > this.weapons.length) return;
	if( this.currentWeapon != to-1 ) {
		this.weapons[this.currentWeapon].stop();
		this.currentWeapon = to-1;
	}
}



