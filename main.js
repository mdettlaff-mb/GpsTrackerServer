$(document).ready(function() {
    var coords = [
        [8.553354, 47.376119],
        [8.552711, 47.376840],
        [8.552644, 47.376953],
        [8.552641, 47.377040],
        [8.552713, 47.377107],
        [8.552858, 47.377151],
        [8.553059, 47.377147],
        [8.554392, 47.376924]
        ];
    var map_x = 8.554;
    var map_y = 47.3765;

    var mapOptions = {
        center: new google.maps.LatLng(map_y, map_x),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var points = [];
    $.each(coords, function(k, coord) {
        points.push(new google.maps.LatLng(coord[1], coord[0]));
    });
    var polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#0000ff",
        strokeOpacity: 0.5,
        strokeWeight: 5,
        map: map
    });
});

