
function PreloadState() {
	this.text;
}

PreloadState.prototype = Object.create(State.prototype);
PreloadState.prototype.constructor = PreloadState;

PreloadState.prototype.preload = function () {
	
	var bg = this.add.tileSprite(0, 0, Game.width, Game.height, 'bg_pattern');
	
	var heli_vint = this.add.sprite(-53, -69, 'heli_vint');
	heli_vint.animations.add('vint');
	heli_vint.animations.play('vint', 30, true);
	
	var logo = this.add.image(Game.width/2, Game.height/2, 'preloadLogo');
	logo.anchor.set(0.5, 0.5);
	logo.addChild(heli_vint);
	logo.smoothed = false;
	
	var text = this.add.text(Game.width/2, Game.height/2 + 200, "loading...", { font: " 14px Arial", fill: "#FFF" });
	text.anchor.set(0.5);
	text.setShadow(1, 1, 'rgba(0,0,0,0.3)', 2);
	this.text = text;
	
	this.game.add.tween(text).to( {alpha:0.2}, 500, "Linear", true, 0, -1, true );
	
	this.loadResources();
	
	// ------------------------------
	var ls = LocalStorage();
	
	var query = window.location.search.substring(1);
	if(query === "reset") {
		ls.clear();
	}
	
	//ls.removeItem('name');
	if( !ls.get('name') ) {
		var prompt = window.prompt("Welcome to NAVY, son. Enter name your here: ");
		ls.save('name', prompt ? prompt : 'John Smith');
		Game.loadedAfterWaitTime = 0;
	}
	this.doneNaming = true;
	
	Game.pilotName = ls.get('name'); 													console.log( "Game.pilotName:", Game.pilotName );
	Game.currentLevel = ls.get('currentLevel') ? Number(ls.get('currentLevel')) : 0;	console.log( "Game.currentLevel:", Game.currentLevel );
	
	this.checkWeCanStart();
}

PreloadState.prototype.loadUpdate = function () {
	if( Game.debug ) console.log("loaded " + this.game.load.progressFloat);
	this.text.text = "loading... " + this.game.load.progress + "%";
}

PreloadState.prototype.create = function () {
	//console.log(this);
	this.text.text = "loaded";
	this.doneLoading = true;
	this.checkWeCanStart();
}

PreloadState.prototype.checkWeCanStart = function () {
	
	if(this.doneNaming && this.doneLoading) {
		setTimeout(function() {
			this.state.start('LevelIntro');
		}.bind(this), Game.loadedAfterWaitTime);
	}
}

PreloadState.prototype.loadResources = function () {
	
	Game.resources.forEach( function(res) {
		switch(res.type) {
			case "image":
				//{ "type":"image", "name":"bullet", "src":"res/bullet.png" },
				this.load.image(res.name, res.src);
				break;
			case "spritesheet":
				//{ "type":"spritesheet", "name":"heli_vint", "src":"res/vint_sheet.png", "size":[118, 80] },
				this.load.spritesheet(res.name, res.src + "?r="+Math.random(), res.size[0], res.size[1]);
				break;
			case "atlasJSONArray":
				//{ "type":"atlasJSONArray", "name":"heli", "src":"res/bullet.png", "json":"res/heli.json" },
				this.load.atlasJSONArray(res.name, res.src + "?r="+Math.random(), res.json + "?r="+Math.random());
				break;
			case "atlasJSONHash":
				//{ "type":"atlasJSONHash", "name":"sprites", "src":"res/sprites.png", "json":"res/sprites.json" },
				this.load.atlasJSONHash(res.name, res.src + "?r="+Math.random(), res.json + "?r="+Math.random());
				break;
			case "audio":
				//{ "type":"audio", "name":"gun", "src":["res/sound/gun.ogg", "res/sound/gun.mp3"] },
				this.load.audio(res.name, [res.src[0] + "?r="+Math.random(), res.src[1] + "?r="+Math.random()]);
				break;
			case "audiosprite":
				//{ "type":"audio", "name":"gun", "src":["res/sound/gun.ogg", "res/sound/gun.mp3"] },
				this.load.audioSprite(res.name, [res.src[0] + "?r="+Math.random(), res.src[1] + "?r="+Math.random()], (res.jsonURL?res.jsonURL + "?r="+Math.random():null), (res.json?res.json:null));
				break;
		}
	}.bind(this));
}




