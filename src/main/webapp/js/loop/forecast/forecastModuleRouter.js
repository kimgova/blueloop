var forecastModuleRouter = Backbone.Router.extend({

		routes: {
			"forecastList(/)" : "showForecastList",
			"forecast/:id" : "showForecastInstances",
			"forecastInstance/:id/:id" : "showForecastInstanceContent",
			"forecastDetail/:id" : "showForecastDetail",
			"*other" : "defaultRoute"
		},   
	
		start: function(){
			Backbone.history.start();
		},
		
		showForecastList: function(){
			forecastModuleView.init();
		},
	
		showForecastDetail: function(id){
			$("#forecasts").empty();
			alert("You are trying to reach " + id);
		},
	
		showForecastInstances: function(idForecastChain){
			var instancesView = new forecastInstanceView();
			instancesView.idForecastChain=idForecastChain;
			instancesView.render();
		},
		
		showForecastInstanceContent: function(idForecastChain,idForecastInstance){
			var instanceDetailView = new forecastInstEditView({forecastId:idForecastChain,instanceId:idForecastInstance});
			instanceDetailView.render();
		},
	
		defaultRoute: function(other){
			console.log('Invalid. You attempted to reach:' + other);
			this.navigate("forecastList/",true);
		}
		
});

$().ready(function() {
	var moduleForecast = new forecastModuleRouter();
	moduleForecast.start();
});