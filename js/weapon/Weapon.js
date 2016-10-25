
function Weapon(state, shooter) {
	
	Unit.call(this, state);
	
	this.shooter = shooter;
	
	this.nextFire = 0;
	this.time = 0;
	this.waitingNextFireTrigger = false;
	this.bullets = [];
	this.damage = 10;
	this.weaken = true;				// чем дальше летит пуля, тем слабее ее урон (true) | на любом расстоянии макс.урон (false)
	
	//this.game.physics.startSystem(Phaser.Physics.ARCADE);
}

Weapon.prototype = Object.create(Unit.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.SHOOT = "Weapon.SHOOT";

Weapon.prototype.onMouseRelease = function(event) {
	this.stop();
}

Weapon.prototype.update = function () {
	//console.log("Weapon.update", this.shooter.parentClass, this.game.time.now);
	this.time = this.game.time.now;
	
	/* this.bullets.forEach( function(bullet, i) {
		bullet.update();
		if( ! bullet.exists ) {
			this.bullets.splice(i, 1);
		}
	}.bind(this) ); */
}

Weapon.prototype.fire = function () {
	//console.log("Weapon.fire 1", this.shooter.parentClass);
	if( !this.automatic && this.waitingNextFireTrigger ) {
		return;
	}
	//console.log("Weapon.fire 2", this.shooter.parentClass, this.time, this.nextFire);
	if( this.time > this.nextFire ) {
		this.nextFire = this.time + this.fireRate;
		this.waitingNextFireTrigger = true;
		this.fireOnce();
	}
}

Weapon.prototype.fireOnce = function () {
	
	if( Game.debug ) console.log("FIRE", this.shooter.parentClass);

	this.dispatchEvent({type:Weapon.SHOOT, shooter:this.shooter, weapon:this});
	//var bullet = new Bullet(this.state, this.shooter, this);
	//this.state.bullets.push(bullet);
	
	if(!this.sounds.shot.isPlaying) this.sounds.shot.play("", 0, 0.1);
}

Weapon.prototype.stop = function () {
	this.waitingNextFireTrigger = false;
	if( this.automatic ) {
		this.sounds.shot.stop();
	}
}

Weapon.prototype.createBullet = function (shooter) {
	return new Bullet(this.state, shooter, this);
}

/* ================================================ GUNS ================================================ */


/**
 * Simple Gun
 */
function Gun(state, shooter) {
	
	Weapon.apply(this, arguments);
	
	this.fireRate = 300;		// минимальное время до следующего выстрела;
	this.automatic = false;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 800;		// дальность;
	this.razbrosY = 1;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 10;			// разброс по дальности;
	this.damage = 20;			// причиняемый damage;
	
	this.sounds = {
		shot: this.game.add.audio('gun')
	};
}
Gun.prototype = Object.create(Weapon.prototype);
Gun.prototype.constructor = Gun;

/**
 * Automatic Gun
 */
function AutomaticGun(state, shooter) {
	
	Weapon.apply(this, arguments);
	
	this.fireRate = 100;		// минимальное время до следующего выстрела;
	this.automatic = true;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 500;		// дальность;
	this.razbrosY = 1;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 20;			// разброс по дальности;
	this.damage = 10;			// причиняемый damage;
	
	this.sounds = {
		shot: this.game.add.audio('machine_gun')
	};
}
AutomaticGun.prototype = Object.create(Weapon.prototype);
AutomaticGun.prototype.constructor = AutomaticGun;


/**
 * Machine Gun
 */
function MachineGun(state, shooter) {
	
	Weapon.apply(this, arguments);
	
	this.fireRate = 40;			// минимальное время до следующего выстрела;
	this.automatic = true;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 800;		// дальность;
	this.razbrosY = 3;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 20;			// разброс по дальности;
	this.damage = 10;			// причиняемый damage;
	
	this.sounds = {
		shot: this.game.add.audio('machine_gun')
	};
}
MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;


/**
 * RocketLauncher
 */
function RocketLauncher(state, shooter) {
	
	Weapon.apply(this, arguments);
	
	this.fireRate = 600;		// минимальное время до следующего выстрела;
	this.automatic = false;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 1000;		// дальность;
	this.razbrosY = 2;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 40;			// разброс по дальности;
	this.damage = 70;			// причиняемый damage;
	this.speed = 15;			// скорость полета снаряда;
	this.weaken = false;		// чем дальше летит пуля, тем слабее ее урон (true) | на любом расстоянии макс.урон (false)
	
	this.sounds = {
		shot: this.game.add.audio('rocket_launch')
	};
}
RocketLauncher.prototype = Object.create(Weapon.prototype);
RocketLauncher.prototype.constructor = RocketLauncher;

RocketLauncher.prototype.fireOnce = function () {
	
	if( Game.debug ) console.log("FIRE");
	
	this.dispatchEvent({type:Weapon.SHOOT, shooter:this.shooter, weapon:this});
	//var bullet = new Rocket(this.state, this.shooter, this);
	//this.bullets.push(bullet);
	
	this.sounds.shot.play("", 0, 0.1);
}

RocketLauncher.prototype.createBullet = function (shooter) {
	return new Rocket(this.state, shooter, this);
}

/**
 * Rocket Launcher Autofire
 */
function RocketLauncherAuto(state, shooter) {
	
	RocketLauncher.apply(this, arguments);
	
	this.fireRate = 200;		// минимальное время до следующего выстрела;
	this.automatic = true;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 800;		// дальность;
	this.razbrosY = 8;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 100;		// разброс по дальности;
	
	this.sounds.shot.allowMultiple = true;
}
RocketLauncherAuto.prototype = Object.create(RocketLauncher.prototype);
RocketLauncherAuto.prototype.constructor = RocketLauncherAuto;



/**
 * Plasma Gun
 */
function PlasmaGun(state, shooter) {
	
	Weapon.apply(this, arguments);
	
	this.fireRate = 300;		// минимальное время до следующего выстрела;
	this.automatic = true;		// автоматическое оружие стреляет пока нажата кнопка мыши;
	this.distance = 600;		// дальность;
	this.razbrosY = 5;			// кучность - градус отклонения от прямой линии в обе стороны;
	this.razbrosX = 100;		// разброс по дальности;
	this.damage = 5;
	
	/* if(Game.currentLevel <= 2) {
		this.fireRate = 600;
		this.damage = 2;
	} */
	
	this.sounds = {
		shot: this.game.add.audio('gun')
	};
}
PlasmaGun.prototype = Object.create(Weapon.prototype);
PlasmaGun.prototype.constructor = PlasmaGun;

PlasmaGun.prototype.fireOnce = function () {
	
	if( Game.debug ) console.log("Alien FIRE");

	this.dispatchEvent({type:Weapon.SHOOT, shooter:this.shooter, weapon:this});
	//var bullet = new Plasma(this.state, this.shooter, this);
	//this.bullets.push(bullet);
	
	this.sounds.shot.play("", 0, 0.1);
}

PlasmaGun.prototype.createBullet = function (shooter) {
	return new Plasma(this.state, shooter, this);
}