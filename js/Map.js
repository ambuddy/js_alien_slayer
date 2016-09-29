

function GoogleMap(mapDiv, lat, lon) {
	
	var GM = google.maps;
	
	this.div = mapDiv;
	
	this.map = new GM.Map(mapDiv, {
		center: { lat: lat, lng: lon },
		zoom: 20,
		tilt: 45,
		disableDefaultUI: true,
		keyboardShortcuts: false,
		mapTypeId: GM.MapTypeId.SATELLITE				// HYBRID, ROADMAP, SATELLITE, TERRAIN
	});
	
}

GoogleMap.prototype.panBy = function(x, y) {
	this.map.panBy(x, y);
}

GoogleMap.prototype.show = function(param) {
	this.div.style.visibility = param ? "visible" : "hidden";
}

GoogleMap.prototype.setCenter = function(param) {
	this.map.setCenter(param);
}
