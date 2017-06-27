var forecastInstLinearRowView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},

	setEvents: function(){
		var that = this;
		this.$el.find("#openTrend").click(this,this.openTrend);
		this.$el.find("#openAdjus").click(this,this.openAdjus);
		this.$el.find("#openMember").click(this,this.openMember);
		this.$el.find(".editNegociation").click(this,this.editNegociation);
	},
	
	openTrend: function(e){
		e.preventDefault();
		$("#historical-trend-modal").remove();
		var modalView = new historicalTrendModalView();
		modalView.planningId = e.data.model.get('idForecastPlanning');
		modalView.render().$el.modal("show");
	},
	
	openAdjus: function(e){
		e.preventDefault();
		$("#variations-linear-modal").remove();
		var modalView = new fcInstLinearVarModalView({model:e.data.model});
		modalView.render().$el.modal("show");
	},
	
	openMember: function(e){
		e.preventDefault();
		$("#viewers-planning-modal").remove();
		var modalView = new viewersModalView();
		modalView.planningId = e.data.model.get('idForecastPlanning');
		modalView.render().$el.modal("show");
	},
	
	editNegociation: function(e){
		var modelView = new forecastInstLinearEditRowView({model:e.data.model});
		if($(e.target).parent().parent().parent().parent().is("tbody")){
			e.data.$el =  $(e.target).parent().parent().parent()
		}else{
			e.data.$el =  $(e.target).parent().parent().parent().parent()
		}
		e.data.$el.html(modelView.render().$el);
	}

});