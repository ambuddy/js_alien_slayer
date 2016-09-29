
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
	
	this.exists = this.cont.exists;
	if(!this.exists) return;
	
	this.anim.x += this.speed;
	this.hit.x += this.speed;
	this.traveled += this.speed;
	
	this.checkCollision();
	
	if(this.traveled > this.lifeDistance) {	
		this.destroy();
	}
}


