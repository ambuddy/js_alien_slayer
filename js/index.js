
function start() {
	//console.log("start");
	//var config;
	
	function GetConfig() {
		
		var counter = 0;
		
		/* function getJSON() {
			//console.log("GetConfig.getJSON");
			return new Promise( function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "config.json?r="+Math.random(), true);
				xhr.onload = function() {
					var config = JSON.parse(this.responseText);
					if( config.configs.debug ) console.log("Loaded config.json =", config);
					resolve(config);
				};
				xhr.send();
			});
		} */
	
		function settleScripts(configJSON) {
			if( configJSON.configs.debug ) console.log("GetConfig.settleScripts");
			var promises = [];
			configJSON.scripts.forEach( function(src) {
				var settled = new Promise( function(resolve, reject) {
					var script = document.createElement('script');
					script.src = src + (src.indexOf("?")>=0?"&":"?") + "r=" + Math.random();
					script.type = 'text/javascript';
					script.async = false;
					document.body.appendChild(script);
					script.addEventListener('load', function(event) {
						counter++;
						if( configJSON.configs.debug ) console.log("Loaded script #", counter, event.path[0].src);
						resolve(configJSON);
					});
				});
				promises.push(settled);
			});
			return Promise.all( promises );
		}
		
		function getFirstElem(arr) {
			return arr[0];
		}
		
		return new Promise( function(resolve, reject) {
			fetch("config.json?r="+Math.random())
				.then(response => { return response.json(); })
				.then(settleScripts, reject)
				.then(getFirstElem, reject)
				.then(resolve, reject);
		});
	}
	
	function available() {
		try {
			return (XMLHttpRequest && ("onload" in new XMLHttpRequest()) && Promise)
		} catch(e) {
		}
	}
	
	function error(e) {
		alert("Вам не повезло, потому что " + e + " и вам следует обновить или поменять браузер");
	}
	
	function runGame(json) {
		Game.init(json);
	}
	
	if( !available() ) {
		error("чего-то не хватает");
		return;
	}
	
	GetConfig().then( runGame, error );
}


