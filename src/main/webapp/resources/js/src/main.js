$(function() {

	var resize = function() {
		var contentHeight = Math.max(100, $('body').height() - $('.top').height());
		$('.content').css('height', contentHeight);
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


	resize();
	$(window).on('resize', function() {
		resize();
	});

});
