$(function() {

	var createMap = function() {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};

	var describeLocation = function(location) {
		var result = '';
		result += 'id: ' + location.id + '<br>';
		result += 'latitude: ' + location.latitude + '<br>';
		result += 'longitude: ' + location.longitude + '<br>';
		var time = new Date(location.time).format('yyyy-mm-dd HH:MM:ss');
		result += 'time: ' + time + '<br>';
		result += 'accuracy: ' + location.accuracy + ' m<br>';
		result += 'altitude: ' + location.altitude + ' m<br>';
		result += 'bearing: ' + location.bearing + '°<br>';
		var speed = location.speed * 3.6; // convert from meters per second to kph
		result += 'speed: ' + speed.toFixed(2) + ' kph';
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

	var drawRoute = function(map, locations, polyLines) {
		$.each(polyLines, function(index, polyLine) {
			polyLine.setMap(null);
		});
		polyLines.length = 0;
		var limits = new google.maps.LatLngBounds();
		var paths = [[]];
		var hour = 60 * 60 * 1000;
		var interval = 6 * hour;
		$.each(locations, function(index, location) {
			var position = new google.maps.LatLng(location.latitude, location.longitude);
			limits.extend(position);
			if (index > 0 && location.time - locations[index - 1].time > interval) {
				paths.push([]);
			}
			paths[paths.length - 1].push(position);
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
			polyLines.push(polyLine);
			google.maps.event.addListener(polyLine, 'mouseover', function(pathEvent) {
				var location = findNearestLocation(pathEvent.latLng, locations);
				currentInfoWindow == null || currentInfoWindow.close();
				currentInfoWindow = new google.maps.InfoWindow({
					content: describeLocation(location),
					position: pathEvent.latLng,
					disableAutoPan: true
				});
				currentInfoWindow.open(map);
			});
		});
		$(document).click(function(event) {
			currentInfoWindow == null || currentInfoWindow.close();
		});
	};

	var drawLocations = function(map, polyLines) {
		$.ajax({
			url: '/location/list',
		}).done(function (locations) {
			drawRoute(map, locations, polyLines);
		}).fail(function () {
			alert('Unable to load locations.');
		});
	};


	var map = createMap();
	var polyLines = [];
	drawLocations(map, polyLines);

	$('#date-combobox').change(function() {
		$.post('/date', {
			date : $('#date-combobox').val()
		}).done(function(data) {
			drawLocations(map, polyLines);
		});
	});

	$('#interval-submit').click(function() {
		$.post('/interval', {
			start : $('#interval-start').val(),
			end : $('#interval-end').val()
		}).done(function(data) {
			drawLocations(map, polyLines);
		});
	});

});
