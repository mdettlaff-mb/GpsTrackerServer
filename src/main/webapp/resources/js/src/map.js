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
			paths[paths.length - 1].push(locationToLatLng(location));
		});
		fitBounds();
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
