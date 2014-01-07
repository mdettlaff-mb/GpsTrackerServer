$(function () {

	var speedDataset = {label: "speed = ?", color: 4, data: []},
		altitudeDataset = {label: "altitude = ?", color: 5, data: []},

		selectedDatasets = [speedDataset, altitudeDataset],

		statsUrl = '/location/list',

		options = {
			series: {
				lines: { steps: true },
				shadowSize: 0,
			},
			xaxis: {
				mode: "time",
				timeformat: "%d.%m.%y<br>%H:%M",
				timezone: "browser",
				minTickSize: [1, "minute"]
			},
			crosshair: {
				mode: "x"
			},
			zoom: {
				interactive: true
			},
			selection: {
				mode: "xy"
			},
			grid: {
				hoverable: true,
				autoHighlight: false
			}
		},
		plot = $.plot("#graph-placeholder", [], options),

		update = function () {
			getStats();
		},

		getStats = function () {
			$.ajax(statsUrl).done(function (data) {
				var totalPoints = data.length;
				speedDataset.data = [];
				altitudeDataset.data = [];

				for (var i = 0; i < totalPoints; i++) {
					var date = new Date(data[i].time);
					speedDataset.data.push([date, data[i].speed * 3.6]); // convert m/s to kph
					altitudeDataset.data.push([date, data[i].altitude]);
				}

				plot.setData(selectedDatasets);
				plot.setupGrid();
				plot.draw();
			});
		},

		updateLegendTimeout = null,
		latestPosition = null,
		updateLabel = function (i, label, y) {
			var ls = $("#graph-placeholder .legendLabel");
			ls.eq(i).text(label.replace(/=.*/, "= " + y.toFixed(2)));
		},
		updateLegend = function () {
			updateLegendTimeout = null;

			var pos = latestPosition;

			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
				pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
				return;
			}

			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				for (j = 0; j < series.data.length; ++j) {
					if (series.data[j][0] > pos.x) {
						break;
					}
				}
	
				var time = series.data[j - 1][0].getTime();
				$(document).trigger('time-selected', time);

				var y = series.data[j - 1][1];
				updateLabel(i, series.label, y);
			}
		};

		initEvents = function () {
			$("#graph-placeholder").bind("plothover",  function (event, pos, item) {
				latestPosition = pos;
				if (!updateLegendTimeout) {
					updateLegendTimeout = setTimeout(updateLegend, 50);
				}
			});

			$("#graph-placeholder").bind("plotselected", function (event, ranges) {
				plot = $.plot("#graph-placeholder", [], $.extend(true, {}, options, {
					xaxis: {
						min: ranges.xaxis.from,
						max: ranges.xaxis.to
					},
					yaxis: {
						min: ranges.yaxis.from,
						max: ranges.yaxis.to
					}
				}));
				update();
			});

			$(document).on('interval-changed', function() {
				update();
			});

			$(document).on('location-selected', function(event, time) {
				plot.setCrosshair({x: time});
				var i, j, dataset = plot.getData();
				for (i = 0; i < dataset.length; ++i) {
					var series = dataset[i];
					for (j = 0; j < series.data.length; ++j) {
						if (series.data[j][0] > new Date(time)) {
							break;
						}
					}
					var y = series.data[j - 1][1];
					updateLabel(i, series.label, y);
				}
			});
		};


	update();
	initEvents();

});
