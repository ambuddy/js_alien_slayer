
function Bullet(state, shooter, weapon) {
	//console.log("new Bullet(", arguments, ")");
	Unit.call(this, state);
	
	this.shooter = shooter.cont;
	this.weapon = weapon;
	this.aliens = state.aliens;
	this.heli = state.heli;
	this.traveled = 0;			// расстояние пройденное снарядом
	this.cont = this.game.add.group( state.cont );
	this.speed = this.weapon.speed ? this.weapon.speed : 30;
	this.lifeDistance = this.game.rnd.between(this.weapon.distance - this.weapon.razbrosX, this.weapon.distance + this.weapon.razbrosX);
	
	var angle = this.angleToPointer( this.shooter );
	if( this.shooter != this.heli.cont) {
		angle = this.angleBetween( this.shooter, this.heli.cont );
	}
	
	this.anim = this.game.add.image(0, 0, 'sprites', 'bullet.png');
	this.anim.width = 1;
	this.cont.x = this.shooter.x;
	this.cont.y = this.shooter.y;
	this.cont.angle = this.game.rnd.between(angle - this.weapon.razbrosY, angle + this.weapon.razbrosY);
	this.cont.addChild(this.anim);
	
	this.snd = this.game.add.audioSprite('metall');
	
	this.addHitArea({width:5, height:5});
}
Bullet.prototype = Object.create(Unit.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
	//console.log("Bullet.prototype.update");
	if(!this.exists()) return;
	
	this.anim.width += this.speed / 2;
	this.anim.x += this.speed / 2;
	this.hit.x += this.speed;
	this.traveled += this.speed;
	
	//console.log("overlap", this.game.physics.arcade.distanceBetween(this.hit, this.aliens[0].hit, true) );
	
	this.checkCollision();
	
	if(this.traveled > this.lifeDistance) {
		this.destroy();
	}
}

Bullet.prototype.checkCollision = function () {
		
	this.aliens.forEach( function(alien) {
		
		// стреляют наши
		if( this.shooter == this.heli.cont) {
			if( Game.hitTestRectangle( this.hit, alien.hit ) && alien.exists() ) {
				//console.log("hitTestRectangle", alien.type);
				this.snd.play("hit" + this.game.rnd.between(1, 2), 0.3);
				this.destroy();
				alien.damage(this.weapon, this);
			}
		} 
		// стреляют враги
		else {
			if( Game.hitTestRectangle( this.hit, this.heli.hit ) && this.heli.exists() ) {
				this.snd.play("hit" + this.game.rnd.between(1, 2), 0.3);
				this.destroy();
				this.heli.damage(this.weapon, this);
			}
		}
	}.bind(this) );
}


/**
 * @class Rocket
 * @extends Bullet
 */
function Rocket(state, shooter, weapon) {
	Bullet.apply(this, arguments);
	
	this.anim.destroy();
	this.anim = this.game.add.image(0, 0, 'sprites', 'rocket.png');
	//this.anim.anchor.setTo(0.5, 0.5);
	
	this.anim2 = this.game.add.sprite(0, 0, 'sprites');
	this.anim2.scale.set(0.5);
	this.anim2.animations.add('rocket_fire', ["rocket_fire_1.png", "rocket_fire_2.png", "rocket_fire_3.png"], 15, true, false);
	this.anim2.animations.play('rocket_fire');
	this.anim2.x = -this.anim2.width;
	this.anim2.y = -this.anim2.height/2 + this.anim.height/2;
	
	this.anim.addChild(this.anim2);
	this.cont.addChild(this.anim);
}
Rocket.prototype = Object.create(Bullet.prototype);
Rocket.prototype.constructor = Bullet;

Rocket.prototype.update = function () {
	
	if(!this.exists()) return;
	
	this.anim.x += this.speed;
	this.hit.x += this.speed;
	this.traveled += this.speed;
	
	this.checkCollision();
	
	if(this.traveled > this.lifeDistance) {	
		this.destroy();
	}
}

/**
 * @class Plasma
 * @extends Bullet
 */
function Plasma(state, shooter, weapon) {
	Bullet.apply(this, arguments);
	
	this.anim.destroy();
	this.anim = this.game.add.image(0, 0, 'sprites', 'plasma.png');
	this.anim.anchor.setTo(0.5, 0.5);

	this.cont.addChild(this.anim);
}
Plasma.prototype = Object.create(Bullet.prototype);
Plasma.prototype.constructor = Bullet;

Plasma.prototype.update = function () {
	
	if(!this.exists()) return;
	
	this.anim.x += this.speed;
	this.hit.x += this.speed;
	this.traveled += this.speed;
	
	this.checkCollision();
	
	if(this.traveled > this.lifeDistance) {	
		this.destroy();
	}
}