jQuery(document).ready(
		function() {
			TaskList.initTaskWidget();

			$("#sortable").sortable();
			$("#sortable").disableSelection();

			handleDashFlotCharts();
			// live chart
			var plot;
			// we use an inline data source in the example, usually data would
			// be fetched from a server
			var data = [], totalPoints = 300;
			function getRandomData() {
				if (data.length > 0)
					data = data.slice(1);

				// do a random walk
				while (data.length < totalPoints) {
					var prev = data.length > 0 ? data[data.length - 1] : 80;
					var y = prev + Math.random() * 10 - 5;
					if (y < 0)
						y = 0;
					if (y > 100)
						y = 100;
					data.push(y);
				}

				// zip the generated y values with the x values
				var res = [];
				for (var i = 0; i < data.length; ++i)
					res.push([ i, data[i] ])
				return res;
			}

			// setup control widget
			var updateInterval = 85;
			$("#updateInterval").val(updateInterval).change(function() {
				var v = $(this).val();
				if (v && !isNaN(+v)) {
					updateInterval = +v;
					if (updateInterval < 1)
						updateInterval = 1;
					if (updateInterval > 2000)
						updateInterval = 2000;
					$(this).val("" + updateInterval);
				}
			});

			// setup plot
			var options = {
				series : {
					shadowSize : 1
				}, // drawing is faster without shadows
				yaxis : {
					ticks : [ [ 0, "0%" ], [ 20, "20%" ], [ 40, "40%" ],
							[ 60, "60%" ], [ 80, "80%" ], [ 100, "100%" ],
							[ 120, "120%" ], [ 140, "140%" ], [ 160, "160%" ],
							[ 180, "180%" ] ],
					min : 0,
					max : 180,
				},
				xaxis : {
					show : false
				}
			};
			var plot = $.plot($("#chart-3"), [ getRandomData() ], options);

			function update() {
				plot.setData([ getRandomData() ]);
				// since the axes don't change, we don't need to call
				// plot.setupGrid()
				plot.draw();

				setTimeout(update, updateInterval);
			}

			update();
		});

(function() {
	var data = [ {
		"xScale" : "ordinal",
		"comp" : [],
		"main" : [ {
			"className" : ".main.l1",
			"data" : [ {
				"y" : 100,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 120,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 140,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 180,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 130,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 125,
				"x" : "2012-11-25T00:00:00"
			} ]
		}, {
			"className" : ".main.l2",
			"data" : [ {
				"y" : 125,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 133,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 170,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 110,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-25T00:00:00"
			} ]
		} ],
		"type" : "line-dotted",
		"yScale" : "linear"
	}, {
		"xScale" : "ordinal",
		"comp" : [],
		"main" : [ {
			"className" : ".main.l1",
			"data" : [ {
				"y" : 100,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 120,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 140,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 180,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 130,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 125,
				"x" : "2012-11-25T00:00:00"
			} ]
		}, {
			"className" : ".main.l2",
			"data" : [ {
				"y" : 125,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 133,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 170,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 110,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-25T00:00:00"
			} ]
		} ],
		"type" : "cumulative",
		"yScale" : "linear"
	}, {
		"xScale" : "ordinal",
		"comp" : [],
		"main" : [ {
			"className" : ".main.l1",
			"data" : [ {
				"y" : 100,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 120,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 140,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 180,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 130,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 125,
				"x" : "2012-11-25T00:00:00"
			} ]
		}, {
			"className" : ".main.l2",
			"data" : [ {
				"y" : 125,
				"x" : "2012-11-19T00:00:00"
			}, {
				"y" : 133,
				"x" : "2012-11-20T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-21T00:00:00"
			}, {
				"y" : 160,
				"x" : "2012-11-22T00:00:00"
			}, {
				"y" : 170,
				"x" : "2012-11-23T00:00:00"
			}, {
				"y" : 110,
				"x" : "2012-11-24T00:00:00"
			}, {
				"y" : 145,
				"x" : "2012-11-25T00:00:00"
			} ]
		} ],
		"type" : "bar",
		"yScale" : "linear"
	} ];

	var order = [ 0, 1, 0, 2 ], i = 0, xFormat = d3.time.format('%A'), chart = new xChart(
			'line-dotted', data[order[i]], '#chart', {
				axisPaddingTop : 5,
				dataFormatX : function(x) {
					return new Date(x);
				},
				tickFormatX : function(x) {
					return xFormat(x);
				},
				timing : 1250
			}), rotateTimer, toggles = d3.selectAll('.multi button'), t = 3500;

	function updateChart(i) {
		var d = data[i];
		chart.setData(d);
		toggles.classed('toggled', function() {
			return (d3.select(this).attr('data-type') === d.type);
		});
		return d;
	}

	toggles.on('click', function(d, i) {
		clearTimeout(rotateTimer);
		updateChart(i);
	});

	function rotateChart() {
		i += 1;
		i = (i >= order.length) ? 0 : i;
		var d = updateChart(order[i]);
		rotateTimer = setTimeout(rotateChart, t);
	}
	rotateTimer = setTimeout(rotateChart, t);
}());

/*-----------------------------------------------------------------------------------*/
/*
 * Easy Pie chart
 * /*-----------------------------------------------------------------------------------
 */
function handleDashFlotCharts() {
	// Pie 1
	$('#dash_pie_1').easyPieChart({
		easing : 'easeOutBounce',
		onStep : function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent) + "%");
		},
		lineWidth : 6,
		barColor : Theme.colors.primary
	});
	var chart1 = window.chart = $('#dash_pie_1').data('easyPieChart');
	// Pie 2
	$('#dash_pie_2').easyPieChart({
		easing : 'easeOutBounce',
		onStep : function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent) + "%");
		},
		lineWidth : 6,
		barColor : Theme.colors.yellow
	});
	var chart2 = window.chart = $('#dash_pie_2').data('easyPieChart');
	// Pie 3
	$('#dash_pie_3').easyPieChart({
		easing : 'easeOutBounce',
		onStep : function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent) + "%");
		},
		lineWidth : 6,
		barColor : Theme.colors.dark_orange
	});
	var chart3 = window.chart = $('#dash_pie_3').data('easyPieChart');
	// Pie 4
	$('#dash_pie_4').easyPieChart({
		easing : 'easeOutBounce',
		onStep : function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent) + "%");
		},
		lineWidth : 6,
		barColor : Theme.colors.gray
	});
	var chart4 = window.chart = $('#dash_pie_4').data('easyPieChart');

	// Update the charts
	$('.js_update').on('click', function() {
		chart1.update(Math.random() * 100);
		chart2.update(Math.random() * 100);
		chart3.update(Math.random() * 100);
		chart4.update(Math.random() * 100);
		chart_revenue();
	});
}

(function() {
	this.Theme = (function() {
		function Theme() {
		}
		Theme.colors = {
			white : "#FFFFFF",
			primary : "#5E87B0",
			red : "#D9534F",
			green : "#A8BC7B",
			blue : "#70AFC4",
			orange : "#F0AD4E",
			yellow : "#FCD76A",
			gray : "#6B787F",
			lightBlue : "#D4E5DE",
			purple : "#A696CE",
			pink : "#DB5E8C",
			dark_orange : "#F38630"
		};
		return Theme;
	})();
})(window.jQuery);

var Script = function() {

	var doughnutData = [ {
		value : 8.8,
		color : "#F7464A",
		highlight : "#FF5A5E",
		label : "Product A"
	}, {
		value : 14.7,
		color : "#46BFBD",
		highlight : "#5AD3D1",
		label : "Product B"
	}, {
		value : 29.4,
		color : "#FDB45C",
		highlight : "#FFC870",
		label : "Product C"
	}, {
		value : 11.7,
		color : "#949FB1",
		highlight : "#A8B3C5",
		label : "Product D"
	}, {
		value : 35.4,
		color : "#4D5360",
		highlight : "#616774",
		label : "Product E"
	}

	];

	// new
	// Chart(document.getElementById("doughnut").getContext("2d")).Doughnut(doughnutData,options)
	// ;
	window.onload = function() {
		var ctx = document.getElementById("chart-area").getContext("2d");
		window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
			responsive : true,
			animation : true,
			barValueSpacing : 5,
			barDatasetSpacing : 1,
			tooltipFillColor : "rgba(0,0,0,0.8)",
			multiTooltipTemplate : "<%= datasetLabel %> - <%= value %> %"
		});
	};

}();

var TaskList = function() {

	return {

		initTaskWidget : function() {
			$('input.list-child').change(function() {
				if ($(this).is(':checked')) {
					$(this).parents('li').addClass("task-done");
				} else {
					$(this).parents('li').removeClass("task-done");
				}
			});
		}

	};

}();
