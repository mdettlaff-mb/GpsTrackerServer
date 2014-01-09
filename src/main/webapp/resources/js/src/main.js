$(function() {

	var initControls = function() {
		$('#date-combobox').change(function() {
			$.post('/date', {
				date : $('#date-combobox').val()
			}).done(function(data) {
				$(document).trigger('interval-changed');
			});
		});
	
		$('#interval-submit').click(function() {
			$.post('/interval', {
				start : $('#interval-start').val(),
				end : $('#interval-end').val()
			}).done(function(data) {
				$(document).trigger('interval-changed');
			});
		});
	};

	var initResize = function() {
		$(window).on('resize', function() {
			var contentHeight = Math.max(100, $('body').height() - $('.top').height());
			$('.content').css('height', contentHeight);
			$(document).trigger('resize-map');
		});
		$(window).trigger('resize');
	};


	initControls();
	initResize();
});
