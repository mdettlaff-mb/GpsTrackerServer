$(function() {

	var initControls = function() {
		$('#date-combobox').change(function() {
			$.post('/date', {
				date : $('#date-combobox').val()
			}).done(function(data) {
				$(document).trigger('update-data');
			});
		});
	
		$('#interval-submit').click(function() {
			$.post('/interval', {
				start : $('#interval-start').val(),
				end : $('#interval-end').val()
			}).done(function(data) {
				$(document).trigger('update-data');
			});
		});

		$('#layout-combobox').change(function() {
			var mapHeight = $('#layout-combobox').val();
			$('.map').css('height', mapHeight + '%');
			var graphHeight = 100 - mapHeight;
			if (graphHeight == 0) {
				$('.graph-container').css('display', 'none');
			} else {
				$('.graph-container').css('display', 'block');
				$('.graph-container').css('height', graphHeight + '%');
			}
			$(window).trigger('resize');
			$(document).trigger('update-data');
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
