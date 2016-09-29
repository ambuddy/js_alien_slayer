
function Bullet(state, shooter, weapon) {
	
	Unit.call(this, state);
	
	this.shooter = shooter;
	this.weapon = weapon;
	this.aliens = state.aliens;
	this.heli = state.heli;
	this.traveled = 0;			// расстояние пройденное снарядом
	this.cont = this.game.add.group( state.cont );
	this.speed = this.weapon.speed ? this.weapon.speed : 30;
	this.lifeDistance = this.game.rnd.between(this.weapon.distance - this.weapon.razbrosX, this.weapon.distance + this.weapon.razbrosX);
	
	var angle = this.angleToPointer( this.shooter );
	
	this.anim = this.game.add.image(0, 0, 'sprites', 'bullet.png');
	this.anim.width = 1;
	this.cont.x = this.shooter.x;
	this.cont.y = this.shooter.y;
	this.cont.angle = this.game.rnd.between(angle - this.weapon.razbrosY, angle + this.weapon.razbrosY);
	this.cont.addChild(this.anim);
	
	this.addHitArea({width:5, height:5});
}
Bullet.prototype = Object.create(Unit.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
	
	this.exists = this.cont.exists;
	if(!this.exists) return;
	
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
				var snd = this.game.add.audioSprite('metall');
				snd.play("hit" + this.game.rnd.between(1, 2), 0.3);
				this.destroy();
				alien.damage(this.weapon, this);
			}
		} 
		// стреляют враги
		else {
			if( Game.hitTestRectangle( this.hit, this.heli.hit ) && this.heli.exists() ) {
				snd.play("hit" + this.game.rnd.between(1, 2), 0.3);
				this.destroy();
				this.heli.damage(this.weapon, this);
			}
		}
	}.bind(this) );
}

