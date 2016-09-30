

function LevelIntro(map) {
	this.map = map;
}

LevelIntro.prototype = Object.create(State.prototype);
LevelIntro.prototype.constructor = LevelIntro;

/*
 * @thisIsOutro:Boolean, if true this state is the End Level popup
 */
LevelIntro.prototype.init = function(thisIsOutro, lose) {
	console.log("LevelIntro.prototype.init: thisIsOutro, lose:", thisIsOutro, lose);
	this.thisIsOutro = thisIsOutro;
	this.lose = lose;
}

LevelIntro.prototype.create = function() {
	
	if(Game.currentLevel > Game.levelsConfigs.length-1) Game.currentLevel--;
	this.levelConfig = Game.levelsConfigs[Game.currentLevel];
	
	this.map.setCenter({lat:this.levelConfig.geo[0], lng:this.levelConfig.geo[1]});
	this.map.setZoom(this.levelConfig.geo[2]);
	
	this.game.input.keyboard.onUpCallback = this.onAnyKey.bind(this);
	//this.game.input.mouse.mouseUpCallback = this.onAnyKey.bind(this);
	
	var bg = this.add.tileSprite(0, 0, Game.width, Game.height, 'bg_pattern');
	this.bg = bg;
	
	var text1 = this.add.text(Game.width/2, Game.height/2 - 100, "MISSION\n#"+(Game.currentLevel + 1), { font:"bold 40pt Arial", fill:"#06F900", align:'center' });
	text1.anchor.set(0.5);
	text1.setShadow(1, 1, 'rgba(0,0,0,0.3)', 2);
	bg.addChild(text1);
	
	if(!this.thisIsOutro) {
		var str = this.levelConfig.briefing.split("%pilotName%").join(Game.pilotName);
		var text2 = this.add.text(Game.width/2, Game.height/2 + 50, str, { font:"bold 20pt Arial", fill:"#FFF", align:'center', wordWrap:true, wordWrapWidth:600 });
		text2.anchor.set(0.5);
		text2.setShadow(1, 1, 'rgba(0,0,0,0.3)', 2);
		bg.addChild(text2);
	} else {
		text1.text = Game.wellDoneString.split("%pilotName%").join(Game.pilotName);
		text1.y = Game.height/2 - 50;
	}
	
	var text3 = this.add.text(Game.width/2, Game.height - 50, "Press SPACE to continue...", { font:"bold 12pt Arial", fill:"#FFF", align:'center' });
	text3.anchor.set(0.5);
	bg.addChild(text3);
	
	if(this.lose) {
		text1.text = Game.loseString.split("%pilotName%").join(Game.pilotName);
		text1.fill = 'black';
		this.snd = this.game.add.audio('trololo');
		this.snd.play("", 0, 0.7, true);
		
		var strp = this.game.add.graphics(Game.width-230, Game.height);
		strp.beginFill(0x000000);
		strp.drawRect(0, 0, 350, 50);
		strp.endFill();
		strp.angle = -45;
	}
}

LevelIntro.prototype.onAnyKey = function(event) {
	
	if(event.code != "Space") return;
	
	if(this.snd) this.snd.destroy();
	
	if(this.thisIsOutro) {
		if(this.lose) {
			Game.currentLevel = 0;		// рестарт
		}
		this.state.restart();
	} else {
		var tween = this.game.add.tween(this.bg).to( {alpha:0}, 200, "Linear", true );
		tween.onComplete.add(function() {
			this.state.start('MainState');
		}, this);
	}
}



