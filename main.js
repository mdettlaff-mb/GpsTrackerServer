$(document).ready(function() {
    var ghyb = new OpenLayers.Layer.Google('Google Hybrid', {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 22,
        sphericalMercator: true
    });

    var map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection('EPSG:900913')
    });
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addLayers([ghyb]);

    var map_x = 8.554;
    var map_y = 47.3765;
    var map_center = new OpenLayers.LonLat(map_x, map_y).transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject());
    map.setCenter(map_center, 17);

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

    var points = [];
    $.each(coords, function(k, coord) {
        var point = new OpenLayers.LonLat(coord[0], coord[1]).transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject());
        points.push(new OpenLayers.Geometry.Point(point.lon, point.lat));
    });
    var line = new OpenLayers.Geometry.LineString(points);
    var style = {
        strokeColor: '#0000ff',
        strokeOpacity: 1,
        strokeWidth: 5
    };
    var lineFeature = new OpenLayers.Feature.Vector(line, null, style);

    var vectorLayer = new OpenLayers.Layer.Vector("Lines", {
        projection: new OpenLayers.Projection('EPSG:900913')
    });
    vectorLayer.addFeatures([lineFeature]);
    map.addLayer(vectorLayer);

    // GOOGLE MAPS
    var mapOptions = {
        center: new google.maps.LatLng(map_y, map_x),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map2 = new google.maps.Map(document.getElementById("map2"), mapOptions);
    var points = [];
    $.each(coords, function(k, coord) {
        points.push(new google.maps.LatLng(coord[1], coord[0]));
    });
    var polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#0000ff",
        strokeOpacity: 0.5,
        strokeWeight: 5,
        map: map2
    });
});

