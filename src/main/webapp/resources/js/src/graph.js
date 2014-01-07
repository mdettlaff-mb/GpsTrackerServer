$(document).ready(function () {

	var speedDataset = {label: "speed = ?", color: 4, data: []},
		altitudeDataset = {label: "altitude = ?", color: 5, data: []},

		selectedDatasets = [speedDataset, altitudeDataset],

		updateInterval = 1000 * 60,

		statsUrl = '/location/list',

		options = {
			series: {
				lines: { steps: true },
				shadowSize: 0, // drawing is faster without shadows
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
		plot = $.plot("#placeholder", [], options),

		update = function () {
			getStats();
			setTimeout(update, updateInterval);

		},

		getStats = function () {

			console.log("Updating stats ...");
			$.getJSON(statsUrl)
				.done(function (data) {
					var totalPoints = data.length;
					speedDataset.data = [];
					altitudeDataset.data = [];

					for (var i = 0; i < totalPoints; i++) {
						var date = new Date(data[i].time);
						speedDataset.data.push([date, data[i].speed * 3.6]);
						altitudeDataset.data.push([date, data[i].altitude]);
					}

					plot.setData(selectedDatasets);
					plot.setupGrid();
					plot.draw();

					console.log("Stats updated");
				})
				.fail(function () {
					console.log("Cannot get stats data");
				});
		},

		updateLegendTimeout = null,
		latestPosition = null,
		updateLegend = function () {
			console.log("Updating legend...");
			updateLegendTimeout = null;

			var pos = latestPosition;
			var ls = $("#placeholder .legendLabel");

			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
				pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
				return;
			}

			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				// Find the nearest points, x-wise
				for (j = 0; j < series.data.length; ++j) {
					if (series.data[j][0] > pos.x) {
						break;
					}
				}
				y = series.data[j - 1][1];
				ls.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
			}
		};


	$(".demo-container").resizable({
		maxWidth: 1500,
		maxHeight: 900,
		minWidth: 450,
		minHeight: 250
	});

	update();

	$("#placeholder").bind("plothover",  function (event, pos, item) {
		latestPosition = pos;
		if (!updateLegendTimeout) {
			updateLegendTimeout = setTimeout(updateLegend, 50);
		}
	});

	$("#placeholder").bind("plotselected", function (event, ranges) {
		plot = $.plot("#placeholder", [], $.extend(true, {}, options, {
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

});
