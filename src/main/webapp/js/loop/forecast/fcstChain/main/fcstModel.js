var forecastModel = Backbone.Model.extend({

	defaults: {
		id:0,
		forecastModel:1,
		forecastLeader: "", //Replace with a list []
		forecastTeam: "", //Replace with a list []
		upcomingProyection: "DEFAULT",		
		forecastFor:"",
		planningPeriodicity:"",
		planningRepeat:"",
		planningFrecuencyRepeat:"",
		planningRepeatValue:"",
		planningTimeAvailable:"",
		signOffRepeat:"",
		signOffFrecuencyRepeat:"",
		signOffRepeatValue:""		
	}

});
