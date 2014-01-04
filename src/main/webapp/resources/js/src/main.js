$(function() {

	var createMap = function() {
		var mapX = 8.554;
		var mapY = 47.3765;

		var mapOptions = {
			center: new google.maps.LatLng(mapY, mapX),
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		return new google.maps.Map(document.getElementById('map'), mapOptions);
	};

	var drawRoute = function(map, locations) {
		var points = [];
		$.each(locations, function(k, location) {
			points.push(new google.maps.LatLng(location.latitude, location.longitude));
		});
		var polyline = new google.maps.Polyline({
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
