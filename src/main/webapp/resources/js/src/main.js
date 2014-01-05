$(function() {

	var createMap = function() {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};

	var drawRoute = function(map, locations) {
		var limits = new google.maps.LatLngBounds();
		var points = [];
		$.each(locations, function(k, location) {
			var position = new google.maps.LatLng(location.latitude, location.longitude);
			limits.extend(position);
			points.push(position);
		});
		map.fitBounds(limits);
		new google.maps.Polyline({
			path: points,
			strokeColor: '#0000ff',
			strokeOpacity: 0.5,
			strokeWeight: 5,
			map: map
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
