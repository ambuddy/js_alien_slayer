
function EventDispatcher() {
	
	this._listeners = {};
	
	this._eventsToDispatch = [];
}

EventDispatcher.prototype.addEventListener = function (type, listener, context) {
	
	if( !this._listeners[type] ) {
		this._listeners[type] = [];
	}
	
	this._listeners[type].push({ listener: listener, context: context });
	
};

EventDispatcher.prototype.addEventListenerOnce = function (type, listener, context) {

	var wrapper = function (event) {
		this.removeEventListener(type, wrapper, this);
		listener.call(context, event);
	};
	this.addEventListener(type, wrapper, this);
	
};

EventDispatcher.prototype.removeEventListener = function (type, listener, context) {
	
	if (!type || !listener) {
		throw new Error("EventDispatcher.removeEventListener: Wrong arguments: type=" + type + ", listener=" + listener + ".");
	}
	
	context = context || window;
	
	var list = this._listeners[type];
	if (list) {
		for( var i = 0; i < list.length; i++ ) {
			var entry = list[i];
			if(entry.listener == listener && entry.context == context) {
				list.splice(i, 1);
				return true;
			}
		}
	}
	
	return false;
};

EventDispatcher.prototype.dispatchEvent = function (event) {
	
	if (!event) {
		throw new Error("Wrong event");
	}
	this._eventsToDispatch.push(event);
	
	this._doDispatch();
	
};

EventDispatcher.prototype._doDispatch = function () {
	
	while( this._eventsToDispatch.length > 0 ) {
	
		var event = this._eventsToDispatch[0];
		var list = this._listeners[event.type];
		
		if(list) {
			list = list.slice();
			event.target = this;
			for(var i=0; i<list.length; i++) {
				var entry = list[i];	//console.log("entry", event.type, entry);
				entry.listener.call(entry.context, event);
			}
		}
		
		this._eventsToDispatch.shift();
	}
	
};


