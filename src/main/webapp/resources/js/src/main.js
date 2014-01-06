$(function() {

	var createMap = function() {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};

	var describeLocation = function(location) {
		var result = '';
		result += 'latitude: ' + location.latitude + '<br>';
		result += 'longitude: ' + location.longitude + '<br>';
		result += 'time: ' + location.time + '<br>';
		result += 'speed: ' + location.speed + '<br>';
		return result;
	};

	var findNearestLocation = function(latLng, locations) {
		var nearest = null;
		$.each(locations, function(index, location) {
			var distance = google.maps.geometry.spherical.computeDistanceBetween(
				latLng, new google.maps.LatLng(location.latitude, location.longitude));
			if (nearest == null || distance < nearest.distance) {
				nearest = {location: location, distance: distance};
			}
		});
		return nearest.location;
	};

	var drawRoute = function(map, locations) {
		var limits = new google.maps.LatLngBounds();
		var paths = [[]];
		var prevLocation = null;
		var hour = 60 * 60 * 1000;
		var interval = 6 * hour;
		$.each(locations, function(index, location) {
			var position = new google.maps.LatLng(location.latitude, location.longitude);
			limits.extend(position);
			if (prevLocation != null && location.time - prevLocation.time > interval) {
				paths.push([]);
			}
			paths[paths.length - 1].push(position);
			prevLocation = location;
		});
		map.fitBounds(limits);
		var currentInfoWindow = null;
		$.each(paths, function(index, path) {
			var polyLine = new google.maps.Polyline({
				path: path,
				strokeColor: '#0000ff',
				strokeOpacity: 0.5,
				strokeWeight: 5,
				map: map
			});
			google.maps.event.addListener(polyLine, 'mouseover', function(pathEvent) {
				var location = findNearestLocation(pathEvent.latLng, locations);
				if (currentInfoWindow != null) {
					currentInfoWindow.close();
				}
				currentInfoWindow = new google.maps.InfoWindow({
					content: describeLocation(location),
					position: pathEvent.latLng
				});
				currentInfoWindow.open(map);
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
