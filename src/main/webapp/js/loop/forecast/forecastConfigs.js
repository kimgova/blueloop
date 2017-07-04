var json = JSON.parse(localStorage.getItem('jsLanguage'));

var FORECAST_MODELS = {
		1:"Exponential Smoothing",
		2:"Extrapolation",
		3:"Linear Prediction",
		4:"Growth Curve",
		5:"Moving Average"
}

var ACTIVITY_STATUS = {
		CHECKED:1,
		UNCHECKED:0
}

var CATEGORY_STATUS = {
		"INUSE":1,
		"NOTINUSE":2
}

var FORECAST_PERIODICITY = {
		ONCEAMONTH:{message:json.forecastCycle.onceMonth, id:1},
		ONCEAWEEK:{message:json.forecastCycle.onceWeek, id:2}
}

var FORECAST_REPEAT = {
		DAYONAMONTH:{message:json.forecastCycle.dayOnMonth, id:1},
		DAYOFAWEEK:{message:json.forecastCycle.dayOfWeek, id:2}
}

var FORECAST_FRECUENCY = {
		FIRST:{message:json.forecastCycle.first, id:1},
		SECOND:{message:json.forecastCycle.second, id:2},
		THIRD:{message:json.forecastCycle.third, id:3},
		FOURTH:{message:json.forecastCycle.fourth, id:4},
		LAST:{message:json.forecastCycle.last, id:5},
		EVERY:{message:json.forecastCycle.every, id:6}
}

var FORECAST_DAYS = {
		1:{message:json.forecastCycle.sun, id:1},
		2:{message:json.forecastCycle.mon, id:2},
		3:{message:json.forecastCycle.tue, id:3},
		4:{message:json.forecastCycle.wed, id:4},
		5:{message:json.forecastCycle.thu, id:5},
		6:{message:json.forecastCycle.fri, id:6},
		7:{message:json.forecastCycle.sat, id:7}
}

var FORECAST_STATUS = {
		PLANNING:{message:json.forecast.planning, id:1},
		SIGNOFF:{message:json.forecast.signOff, id:2},
		COMPLETED:{message:json.forecast.completed, id:3}
}
