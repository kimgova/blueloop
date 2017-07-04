var forecastLoopTableRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstAllLoopTableRow.ejs',
        
    render: function () {
    	console.log(this.model.attributes)
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.setEvents();
        return this;
    },

	setEvents: function(){
		this.$el.find("#editPlanningCycle").click(this,this.planningCycle);
		this.$el.find("#addForecastLeader").click(this,this.showLeader);
		this.$el.find("#viewForecast").click(this,this.viewForecast);
		this.$el.find("#editForecast").click(this,this.editForecast);		
		this.$el.find("#deleteForecast").click(this,this.deleteForecast);
		this.$el.find("#addForecastWU").click(this,this.showWorkingUnit);
		this.$el.find(".editFcstName").click(this,this.editFcstName);
	},

	showLeader: function(e){
		var leaderModalView = new forecastLeaderView({});
		leaderModalView.idForecast = e.data.model.id; 
		leaderModalView.viewRow = e.data
		leaderModalView.render().$el.modal("show");
	}, 
	
	planningCycle: function(e) {
		var cycleView = new forecastCycleView({ model:e.data.model});
		cycleView.viewRow = e.data
		cycleView.init();
	},
	
	updateRow: function() {
		var newRow = $(new EJS({url: this.template }).render(this.model.attributes));
		this.$el.after(newRow);
		this.$el.remove()
		this.$el = newRow
		this.setEvents();
	},
	
	viewForecast: function(e) {
		window.location.href = '#forecast/' + e.data.model.id;
	},
	
	editForecast: function(e) {
		window.location.href = '#forecast/' + e.data.model.id;
	},
	
	showWorkingUnit: function(e) {
		$("#forecast-wu").remove();
		var teamView = new forecastWUView({ model:e.data.model});
		teamView.viewRow = e.data;		
		teamView.render().$el.modal('show'); 
	},

	deleteForecast: function(e){
		var model = new modalDialogs({ 
										modalType : "modal-sm",
										modalTittle : "Delete forecast",
										modalBody : "Are you sure you want to delete this forecast?",
										btnType : "btn-warning"
									});
		
		var confirmModal = new confirmModalView({
								callBack: e.data.callBackDelete,
								callBackModel: e.data.model,
								model : model
							});
		confirmModal.render();
	},
	
	callBackDelete: function(e){
		var dataReturned = $.ajax({
			type : 'GET',
			url : '/blueloop/forecast/deleteForecastChain/',
			data : {id:e.data.callBackModel.id},
			contentType : 'application/json; charset=utf-8',
			dataType : 'json',
			async : false,
			success : function(data, textStatus) {
				data = data;
			},
			error : function(httpRequest, textStatus, errorThrown) {
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});

		if(dataReturned.responseJSON){
			toastr.success(json.forecast.deleteForecast);			
			forecastModuleView.init();
		}
		e.data.$el.modal("hide");
	},
	
    editFcstName: function(e){
        $("#editNameModal").remove();
        var editNameModal = new fcstEditNameView({ model:e.data.model});
        editNameModal.viewRow = $(e.target).parents("#fcstName");
        editNameModal.render().$el.modal('show'); 
    }

});