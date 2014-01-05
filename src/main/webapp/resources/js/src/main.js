$(function() {

	var createMap = function() {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};

	var drawRoute = function(map, locations) {
		var limits = new google.maps.LatLngBounds();
		var paths = [[]];
		var prevLocation = null;
		var hour = 60 * 60 * 1000;
		var interval = 6 * hour;
		$.each(locations, function(k, location) {
			var position = new google.maps.LatLng(location.latitude, location.longitude);
			limits.extend(position);
			if (prevLocation != null && location.time - prevLocation.time > interval) {
				paths.push([]);
			}
			paths[paths.length - 1].push(position);
			prevLocation = location;
		});
		map.fitBounds(limits);
		$.each(paths, function(k, path) {
			new google.maps.Polyline({
				path: path,
				strokeColor: '#0000ff',
				strokeOpacity: 0.5,
				strokeWeight: 5,
				map: map
			});
		});
	};


	var map = createMap();

	$.ajax({
		url: '/location/list',
	}).done(function (locations) {
		drawRoute(map, locations);
	}).fail(function () {
		alert('Unable to load locations.');
	});
});
