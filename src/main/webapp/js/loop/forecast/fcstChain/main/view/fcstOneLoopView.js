var forecastOneLoopView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstOneLoopTemplate.ejs',
	
	init:function (){
		this.getForecastPermission();
		this.$el = $(new EJS({url: this.template }).render({forecastPermission:this.forecastPermission}));
		this.getForecastCollection();
	},

	render: function() {
		var tableView = new forecastTableView({ collection: this.modelCollection, forecastPermission:this.forecastPermission});
		this.$el.find("#tableContent").append(tableView.render().$el);
		this.$el.find("#addModelType").click(this,this.openModelModal);
		return this;
	},
	
	getForecastPermission:function(){
    	var data = ajaxCall('GET', '/blueloop/user/verifyForecastCreationPermission/', {}, "text/json", "json", false);
    	this.forecastPermission = data.permission 
	},
	
	getForecastCollection: function(){
		this.modelCollection = new forecastCollection([]);
		_.each(this.model.listForecast,function(item,i){
			var model = new forecastModel({
				id:item.forecastChain.id,
				forecastModel:item.forecastChain.forecastModel.id,
				modelName:FORECAST_MODELS[item.forecastChain.forecastModel.id],
				chain: item.chain,
				leaders: item.leaders,
				workingUnits:item.workingUnits,
				currentUser:item.currentUser,
				name:item.forecastChain.name,
				
				forecastFor:item.forecastChain.forecastFor,	
				planningPeriodicity:item.forecastChain.planningPeriodicity.name,
				planningRepeat:item.forecastChain.planningRepeat.name,
				planningFrecuencyRepeat:item.forecastChain.planningFrecuencyRepeat.name,
				planningRepeatValue:item.forecastChain.planningRepeatValue,
				planningTimeAvailable:item.forecastChain.planningTimeAvailable,
				signOffRepeat:item.forecastChain.signOffRepeat.name,
				signOffFrecuencyRepeat:item.forecastChain.signOffFrecuencyRepeat.name,
				signOffRepeatValue:item.forecastChain.signOffRepeatValue,
				haveHistory:item.haveHistory
			});
			this.modelCollection.add(model);
		},this);
	},
	
	openModelModal: function(){
		forecastModuleView.showModelModal();
	},	
});