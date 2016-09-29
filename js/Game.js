function Game() {

}

Game.init = function(json) {
	//console.log("Game.init", json);
	for( var conf in json.configs ) {
		if( json.configs.hasOwnProperty(conf) ) {
			Game[conf] = json.configs[conf];
		}
	}
	
	Game.resources = json.resources;									//console.log("Game.resources:", Game.resources);
	Game.levelsConfigs = json.levels;
	
	if(Game.allowFullWindow) {
		Game.width = window.innerWidth;									//console.log("Game.width:", Game.width);
		Game.height = window.innerHeight;								//console.log("Game.height:", Game.height);
	}
	
	var wrapDiv = document.getElementById('wrapper');					//console.log("wrapDiv:", wrapDiv);
	var mapDiv = document.getElementById('mapDiv');						//console.log("mapDiv:", mapDiv);
	var gameDiv = document.getElementById('gameDiv');					//console.log("mapDiv:", mapDiv);
	
	wrapDiv.style.width = Game.width + "px";
	wrapDiv.style.height = Game.height + "px";
	
	var map = new GoogleMap( mapDiv, Game.map_lat, Game.map_lng );
	var game = new Phaser.Game( Game.width, Game.height, Phaser.AUTO, gameDiv, null, true );
	
	game.state.add('BootState',	new BootState()/* , true @автостарт */);
	game.state.add('PreloadState', new PreloadState());
	game.state.add('LevelIntro', new LevelIntro(map));
	game.state.add('MainState',	new MainState(map));
	game.state.start('BootState');
}

Game.isInside = function(cont, rect) {
	
	var hit = {x:0, y:0};
	
	if( !cont || !rect) {
		throw new Error("Utils.isInside bad arguments: " + cont + ", " + rect);
	}
	
	if( cont.x <= rect.x ) {
		hit.x = -1;
	}
	else if( cont.x >= rect.width + rect.x ) {
		hit.x = 1;
	}
	if( cont.y <= rect.y ) {
		hit.y = -1;
	}
	else if( cont.y >= rect.height + rect.y ) {
		hit.y = 1;
	}
	
	return (hit.x || hit.y ? hit : 0);
}

Game.hitTestRectangle = function(r1, r2, world) {

	var combinedHalfWidths, combinedHalfHeights, vx, vy, temp1, temp2;
	var hit = false;
	var world = (world != undefined ? world : true);

	//Find the center points of each sprite and half-widths and half-heights
	temp1 = {
		centerX:	world ? r1.world.x : r1.x + r1.width / 2,
		centerY:	world ? r1.world.y : r1.y + r1.height / 2,
		halfWidth:	r1.width / 2,
		halfHeight:	r1.height / 2
	}
	temp2 = {
		centerX:	world ? r2.world.x : r2.x + r2.width / 2,
		centerY:	world ? r2.world.y : r2.y + r2.height / 2,
		halfWidth:	r2.width / 2,
		halfHeight:	r2.height / 2
	}

	//Calculate the distance vector between the sprites
	vx = temp1.centerX - temp2.centerX;
	vy = temp1.centerY - temp2.centerY;

	//Figure out the combined half-widths and half-heights
	combinedHalfWidths = temp1.halfWidth + temp2.halfWidth;
	combinedHalfHeights = temp1.halfHeight + temp2.halfHeight;

	//Check for a collision on the x axis
	if (Math.abs(vx) < combinedHalfWidths) {

		//A collision might be occuring. Check for a collision on the y axis
		if (Math.abs(vy) < combinedHalfHeights) {

			//There's definitely a collision happening
			hit = true;
		} else {

			//There's no collision on the y axis
			hit = false;
		}
	}

	return hit;
};

Game.round = function(a, b) {
	b = b || 0;
	return Math.round(a*Math.pow(10,b))/Math.pow(10,b);
}

function LocalStorage() {
	function get(key) {
		return localStorage[key];
	}
	function save(key, value) {
		localStorage[key] = value;
	}
	function getObject(key) {
		return JSON.parse(localStorage[key]);
	}
	function saveObject(key, value) {
		localStorage[key] = JSON.stringify(value);
	}
	function removeItem(key) {
		localStorage.removeItem(key);
	};
	return { get: get, save: save, getObject: getObject, saveObject: saveObject, removeItem: removeItem };
}

