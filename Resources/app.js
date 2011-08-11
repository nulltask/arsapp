Ti.include('lib/underscore.js');
Ti.include('lib/event_emitter.js');
Ti.include('client.js');

Ti.Geolocation.preferredProvider = "gps";
Ti.Geolocation.purpose = "GPS demo";

-function() {
	var client = Ti.App.createClient(Ti.Platform.id),
		backgroundService = Ti.App.iOS.registerBackgroundService({
			url: 'background.js'
		});
	
	client.on('hello', function(data) {
		Ti.API.log(data);

		Ti.Accelerometer.addEventListener('update', function(event) {
			client.send('accelerometer', {
				x: event.x,
				y: event.y,
				z: event.z
			});
		});
		
		Ti.Geolocation.addEventListener('location', function(event) {
			client.send('location', event.coords);
		});
		
		Ti.Geolocation.addEventListener('heading', function(event) {
			client.send('heading', event.heading);
		});
		
		Ti.App.addEventListener('pause', function(event) {
			client.send('pause');
		});
		
		Ti.App.addEventListener('resume', function(event) {
			client.send('resume');
			backgroundService.unregister();
		});
		
		setTimeout(function() {
			client.send('bye');
		}, 10000);
	});
	
	client.connect();
}();