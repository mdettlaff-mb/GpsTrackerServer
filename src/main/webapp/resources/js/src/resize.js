$(function() {

	var resize = function() {
		var mapHeight = Math.max(100, $('body').height() - $('.top').height());
		$('.map').css('height', mapHeight);
	};

	resize();
	$(window).on('resize', function() {
		resize();
	});

});
