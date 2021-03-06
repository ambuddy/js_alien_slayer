﻿

function MainState(map) {

	this.cursors;
	
	this.map = map;
	this.heli;
	this.aliens;
}

MainState.prototype = Object.create(State.prototype);
MainState.prototype.constructor = MainState;

/**
 * @override
 */
MainState.prototype.create = function() {
	//console.log("MainState.prototype.create");
	this.levelConfig = Game.levelsConfigs[Game.currentLevel];
	
	this.map.show(true);
	
	this.game.time.advancedTiming = true;
	this.game.world.setBounds( 0, 0, Math.max(this.levelConfig.world[0], Game.width), Math.max(this.levelConfig.world[1], Game.height) );
	
	this.cont = this.game.add.group();		// контейнейр в который добавляем все игровые объекты, чтобы они всегда были под контейнером UI
	
	this.ui = new UI(this, this.levelConfig.weapons);
	this.ui.addEventListener(this.ui.KEY_RELEASED, this.onKeyReleased, this);
	
	this.heli = new Helicopter(this, this.levelConfig.weapons, 0);
	this.heli.addEventListener(Unit.MOVED, this.panMapOnCameraMove, this);
	this.heli.addEventListener(Unit.KILLED, this.onUnitKilled, this);
	this.heli.addEventListener(Unit.SHOOT, this.onUnitShoot, this);
	
	this.camera.follow(this.heli.cont);
	this.camera.deadzone = new Phaser.Rectangle(Game.safe_border, Game.safe_border, Game.width - Game.safe_border*2, Game.height - Game.safe_border*2);
	this.camera.preXY = {x:0, y:0};
	
	this.sndExplosion1 = this.game.add.audio('explosion1');
	
	this.bullets = [];
	
	this.aliens = [];
	var enemyType;
	var enemy;
	for(var i=0; i<this.levelConfig.enemiesNum; i++) {
		enemyType = this.levelConfig.enemies[ this.game.rnd.between(0, this.levelConfig.enemies.length-1) ];
		enemy = new Alien(this, "alien"+enemyType);
		enemy.addEventListener(Unit.KILLED, this.onUnitKilled, this);
		enemy.addEventListener(Unit.SHOOT, this.onUnitShoot, this);
		this.aliens.push(enemy);
	}
	
	this.endingLevel = false;
}
/**
 * @override
 */
MainState.prototype.update = function() {
	
	this.ui.update();
	
	this.heli.update();
	
	this.aliens.forEach( function(alien, i, arr) {
		if(alien.exists()) {
			alien.update();
		}
	});
	
	//console.log("this.bullets.length", this.bullets.length);
	this.bullets.forEach( function(bullet, i, arr) {
		//console.log("bullet", bullet);
		if(bullet.exists()) { 
			bullet.update();
		} else {
			arr.splice(i, 1);
		}
	});
}
/**
 * @override
 */
MainState.prototype.render = function() {
	var dbg = this.game.debug;
	dbg.text(this.game.time.fps, 400, 16, "#00ff00");
	if( Game.debug ) {
		dbg.text("Heli x|y: " + this.heli.cont.x + "|" + this.heli.cont.y, 2, 32);
		dbg.text("deltaCam x|y: " + (this.camera.view.x - this.camera.preXY.x) + " | " + (this.camera.view.y - this.camera.preXY.y), 2, 48);
		dbg.cameraInfo(this.camera, 2, 96);
		//dbg.text("angle: " + degToDir(angle) , 16, 48);
	}
}
/**
 * @override
 */
MainState.prototype.shutdown = function(event) {
	this.aliens.forEach( function(alien, i, arr) {
		alien.destroy();
	});
	this.heli.destroy();
	this.heli.removeEventListener(Unit.MOVED, this.panMapOnCameraMove, this);
}

/**
 * ===============================================
 * own methods : 
 */

MainState.prototype.endLevel = function() {
	console.log("MainState.endLevel");
	this.endingLevel = true;
	setTimeout(function() {
		//this.destroyChildren();
		if(this.heli.exists()) Game.currentLevel++;
		var ls = LocalStorage();
		ls.save('currentLevel', Game.currentLevel);
		this.state.start('LevelIntro', true, false, true, !this.heli.exists());
	}.bind(this), 1500);
}

MainState.prototype.onKeyReleased = function(event) {
	//console.log("MainState.onKeyReleased", event);
	switch( event.key ) {
		case "1" : case "2" : case "3" : case "4" : case "5" :
			this.heli.changeWeapon( Number(event.key) );
			break;
	}
}

MainState.prototype.onUnitKilled = function(event) {
	
	if(Game.debug) console.log("MainState.onUnitKilled", event);
	
	event.target.removeEventListener(Unit.KILLED, this.onUnitKilled, this);

	var expl = this.game.add.image(0, 0, 'explosion1', null, this.cont);
	var anim = expl.animations.add('explosion');
	expl.anchor.setTo(0.5, 0.5);
	expl.x = event.target.cont.x;
	expl.y = event.target.cont.y;
	anim.onComplete.add(function() {
		if(Game.debug) console.log("explosion anim.onComplete");
		expl.destroy();
	}, this);
	anim.play();
	
	this.sndExplosion1.play("", 0, 0.7);
	
	this.aliens.forEach( function(alien, i, arr) {
		if(!alien.exists()) {
			arr.splice(i, 1);
		}
	});
	
	if(this.aliens.length <= 0 || !this.heli.exists()) {
		this.endLevel();
	}
}

MainState.prototype.onUnitShoot = function(event) {
	//console.log("MainState.onUnitShoot ", event, "this.bullets.length == "+this.bullets.length);
	var bullet = event.weapon.createBullet(event.target)
	this.bullets.push(bullet);
}

MainState.prototype.panMapOnCameraMove = function() {
	//console.log("MainState.prototype.panMapOnCameraMove");
	var cam = this.camera;
	var camDelta = {x:cam.view.x - cam.preXY.x, y:cam.view.y - cam.preXY.y};
	if( camDelta.x || camDelta.y ) {
		this.map.panBy(camDelta.x, camDelta.y);
	}
	cam.preXY = {x:cam.view.x, y:cam.view.y};
}


