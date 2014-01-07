$(function() {

	$('#date-combobox').change(function() {
		$.post('/date', {
			date : $('#date-combobox').val()
		}).done(function(data) {
			location.reload(true);
		});
	});

	$('#interval-submit').click(function() {
		$.post('/interval', {
			start : $('#interval-start').val(),
			end : $('#interval-end').val()
		}).done(function(data) {
			location.reload(true);
		});
	});

});
