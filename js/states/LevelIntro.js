

function LevelIntro(map) {
	this.map = map;
}

LevelIntro.prototype = Object.create(State.prototype);
LevelIntro.prototype.constructor = LevelIntro;

LevelIntro.prototype.create = function() {
	
	this.levelConfig = Game.levelsConfigs[Game.currentLevel];
	
	this.map.setCenter({lat:this.levelConfig.geo[0] , lng:this.levelConfig.geo[1]});
	
	this.game.input.keyboard.onUpCallback = this.onAnyKey.bind(this);
	this.game.input.mouse.mouseUpCallback = this.onAnyKey.bind(this);
	
	var bg = this.add.tileSprite(0, 0, Game.width, Game.height, 'bg_pattern');
	
	var text1 = this.add.text(Game.width/2, Game.height/2 - 100, "MISSION\n#"+(Game.currentLevel + 1), { font:"bold 30pt Arial", fill:"#06F900", align:'center' });
	text1.anchor.set(0.5);
	text1.setShadow(1, 1, 'rgba(0,0,0,0.3)', 2);
	
	var str = this.levelConfig.briefing.split("%pilotName%").join(Game.pilotName);
	var text2 = this.add.text(Game.width/2, Game.height/2 + 50, str, { font:"bold 20pt Arial", fill:"#FFF", align:'center', wordWrap:true, wordWrapWidth:600 });
	text2.anchor.set(0.5);
	text2.setShadow(1, 1, 'rgba(0,0,0,0.3)', 2);
	
	var text3 = this.add.text(Game.width/2, Game.height - 50, "Press any key to continue...", { font:"bold 12pt Arial", fill:"#FFF", align:'center' });
	text3.anchor.set(0.5);
	
	bg.addChild(text1);
	bg.addChild(text2);
	bg.addChild(text3);
	
	this.bg = bg;
}

LevelIntro.prototype.onAnyKey = function() {
	
	var tween = this.game.add.tween(this.bg).to( {alpha:0}, 200, "Linear", true );
	tween.onComplete.add(function() {
		this.state.start('MainState');
	}, this);
}



