$(function() {

	var resize = function() {
		var contentHeight = Math.max(100, $('body').height() - $('.top').height());
		$('.content').css('height', contentHeight);
	};

	resize();
	$(window).on('resize', function() {
		resize();
	});

});
