
var MM = Microsoft.Maps;

function BingMap(mapDiv, lat, lon) {
	
	this.map = new MM.Map(
		mapDiv, 
		{
			//disablePanning: true,
			showDashboard: false,
			disableZooming: true,
			showTermsLink: false,
			showScalebar: false,
			enableClickableLogo: false,
			center: this.location( lat, lon ),
			zoom: 18,
			mapTypeId: Microsoft.Maps.MapTypeId.birdseye,
			labelOverlay: Microsoft.Maps.LabelOverlay.hidden,
			credentials:"Ar3o4b8Q6VStAzDIhrvvqPi8MHD0PxmT5YuciLn8psjB6iq7OwyB6UdzLCxpAXPK"
		}
	);
	
	this.w = this.map.getWidth();
	this.h = this.map.getHeight();
}

BingMap.prototype = Object.create(null);

BingMap.prototype.addHandler = function (event, callback) {
	MM.Events.addHandler(this.map, event, callback);
	//MM.Events.addHandler(this.map, 'viewchange', updatePosition);
	//MM.Events.addHandler(this.map, 'tiledownloadcomplete', gameLoop);
}

BingMap.prototype.location = function (lat, lon) {
	return new MM.Location(lat, lon);
}

BingMap.prototype.getMapToXY = function (lat, lon) {
	
	var pixelCoordinate = this.map.tryLocationToPixel(new MM.Location(lat, lon), MM.PixelReference.control);
	
	return pixelCoordinate;
}

