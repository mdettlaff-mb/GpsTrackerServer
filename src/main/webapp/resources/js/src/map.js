$(function() {

	var map;
	var polyLines = [];
	var locations;
	var currentInfoWindow = null;

	var createMap = function() {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};
	
	var formatDuration = function(durationInSeconds) {
		var duration = parseInt(durationInSeconds, 10);
		var padWithZeros = function(n) {
			return ('00' + n).slice(-2);
		};
		var seconds = padWithZeros(duration % 60);
		var minutes = padWithZeros(Math.floor(duration / 60) % 60);
		var hours = padWithZeros(Math.floor(duration / (60 * 60)));
		return hours + ':' + minutes + ':' + seconds;
	};

	var describeLocation = function(location) {
		var result = '';
		result += 'id: ' + location.id + '<br>';
		result += 'latitude: ' + location.latitude + '<br>';
		result += 'longitude: ' + location.longitude + '<br>';
		var time = new Date(location.time).format('yyyy-mm-dd HH:MM:ss');
		result += 'time: ' + time + '<br>';
		result += 'accuracy: ' + location.accuracy + ' m<br>';
		result += 'altitude: ' + location.altitude.toFixed(2) + ' m<br>';
		result += 'bearing: ' + location.bearing.toFixed(2) + '°<br>';
		var speed = location.speed * 3.6; // convert from m/s to kph
		result += 'speed: ' + speed.toFixed(2) + ' kph<br>';
		var pathInfo = location.pathInfo;
		var elapsedTime = formatDuration(pathInfo.elapsedTime / 1000);
		result += 'elapsed time: ' + elapsedTime + '<br>';
		var distance = pathInfo.distance / 1000; // convert from m to km
		result += 'distance: ' + distance.toFixed(3) + ' km<br>';
		var avgSpeed = pathInfo.avgSpeed * 3.6; // convert from m/s to kph
		result += 'average speed: ' + avgSpeed.toFixed(2) + ' kph';
		return result;
	};
	
	var locationToLatLng = function(location) {
		return new google.maps.LatLng(location.latitude, location.longitude);
	};

	var findNearestLocation = function(latLng) {
		var nearest = null;
		$.each(locations, function(index, location) {
			var distance = google.maps.geometry.spherical.computeDistanceBetween(
				latLng, locationToLatLng(location));
			if (nearest == null || distance < nearest.distance) {
				nearest = {location: location, distance: distance};
			}
		});
		return nearest.location;
	};
	
	var showInfoWindow = function(position, location) {
		currentInfoWindow == null || currentInfoWindow.close();
		currentInfoWindow = new google.maps.InfoWindow({
			content: describeLocation(location),
			position: position,
			disableAutoPan: true
		});
		currentInfoWindow.open(map);
	};

	var fitBounds = function() {
		var limits = new google.maps.LatLngBounds();
		$.each(locations, function(index, location) {
			limits.extend(locationToLatLng(location));
		});
		map.fitBounds(limits);
	};

	var setLocationPathInfo = function(paths) {
		$.each(paths, function(index, path) {
			var startTime = path[0].time;
			var distance = 0;
			$.each(path, function(index, location) {
				var pathInfo = {};
				if (index > 0) {
					distance += google.maps.geometry.spherical.computeDistanceBetween(
						locationToLatLng(path[index - 1]), locationToLatLng(location));
				}
				var elapsedTime = location.time - startTime;
				pathInfo.elapsedTime = elapsedTime;
				pathInfo.distance = distance;
				if (elapsedTime > 0) {
					pathInfo.avgSpeed = distance / (elapsedTime / 1000);
				} else {
					pathInfo.avgSpeed = 0;
				}
				location.pathInfo = pathInfo;
			});
		});
	};

	var drawRoute = function() {
		$.each(polyLines, function(index, polyLine) {
			polyLine.setMap(null);
		});
		polyLines.length = 0;
		var paths = [[]];
		var hour = 60 * 60 * 1000;
		var interval = 6 * hour;
		$.each(locations, function(index, location) {
			if (index > 0 && location.time - locations[index - 1].time > interval) {
				paths.push([]);
			}
			paths[paths.length - 1].push(location);
		});
		fitBounds();
		setLocationPathInfo(paths);
		$.each(paths, function(index, path) {
			var polyLine = new google.maps.Polyline({
				path: $.map(path, function(location) {
					return locationToLatLng(location);
				}),
				strokeColor: '#0000ff',
				strokeOpacity: 0.5,
				strokeWeight: 5,
				map: map
			});
			polyLines.push(polyLine);
			google.maps.event.addListener(polyLine, 'mouseover', function(pathEvent) {
				var location = findNearestLocation(pathEvent.latLng);
				showInfoWindow(pathEvent.latLng, location);
				$(document).trigger('location-selected', location.time);
			});
		});
		$(document).click(function(event) {
			currentInfoWindow == null || currentInfoWindow.close();
		});
	};
	
	var drawLocations = function() {
		$.ajax({
			url: '/location/list',
		}).done(function(data) {
			locations = data;
			drawRoute();
		}).fail(function() {
			alert('Unable to load locations.');
		});
	};

	var initEvents = function() {
		$(document).on('update-data', function() {
			drawLocations();
		});
	
		$(document).on('time-selected', function(event, time) {
			var location = $.grep(locations, function(location, index) {
				return location.time == time;
			}).shift();
			if (location) {
				showInfoWindow(locationToLatLng(location), location);
			}
		});

		var center;

		$(document).on('resize-map', function() {
			google.maps.event.trigger(map, 'resize');
			map.setCenter(center);
		});

		google.maps.event.addListener(map, "bounds_changed", function() {
			center = map.getCenter();
		});
	};
	

	map = createMap();
	drawLocations();
	initEvents();

});
