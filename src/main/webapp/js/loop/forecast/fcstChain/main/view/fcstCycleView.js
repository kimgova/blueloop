var forecastCycleView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstCycleForm.ejs',

    viewRow: [],
    
    init: function() {
    	$("#forecastCycleModal").remove();
    	this.$el = $(new EJS({url: this.template }).render(this.model.attributes));  
    	this.render();    	
    	this.setEvents();
    },
    
    setEvents: function(){
    	this.$el.find("#saveCycle").click(this,this.saveCycle);
    	this.$el.find("#selectForecastPeriodicity").change(this,this.changePeriodicityForm);
    	this.$el.find(".radioForecastRepeat").change(this,this.changeForecastRepeat);
    	this.$el.find(".radioSignOffRepeat").change(this,this.changeSignOffRepeat);
    },
    
    render: function() {
    	this.$el.modal("show");    	
        return this;
    },
		
	saveCycle: function(e) {
		var forecastData = e.data.getDataOfForm(e.data);
		if(forecastData != false){
			var dataReturned = $.ajax({
			    type: 'POST',
			    url: '/blueloop/forecast/saveForecastCycle/',
			    data: JSON.stringify(forecastData),
			    contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        	toastr.success(json.forecastCycle.cycleSaved);
		        	e.data.updateModel(data, e.data.model)
		        	e.data.viewRow.updateRow()
		        	e.data.$el.modal("hide");
		        	
		        },
		        error: function(httpRequest, textStatus, errorThrown) { 
		        	console.log("status=" + textStatus + " ,error=" + errorThrown);
		        	toastr.error(json.error.tryAgain);
		        }
		    });
		}else{
	    	toastr.error("The day of sign off is previous to the time available");
		}
	    	    
	},

	updateModel : function(data, model) {
		model.set("forecastFor", data.forecastFor);
		model.set("planningPeriodicity", data.planningPeriodicity.name);
		model.set("planningRepeat", data.planningRepeat.name);
		model.set("planningFrecuencyRepeat", data.planningFrecuencyRepeat.name);
		model.set("planningRepeatValue", data.planningRepeatValue);
		model.set("planningTimeAvailable", data.planningTimeAvailable);
		model.set("signOffRepeat", data.signOffRepeat.name);
		model.set("signOffFrecuencyRepeat", data.signOffFrecuencyRepeat.name);
		model.set("signOffRepeatValue", data.signOffRepeatValue);
	},
	
	changePeriodicityForm : function(e) {
		if (e.data.$el.find("#selectForecastPeriodicity option:selected" ).val() == 1){
			e.data.$el.find("#formPeriodicityWeek" ).css("display", "none");;
			e.data.$el.find("#formPeriodicityMonth" ).css("display", "block");;			
		}else{
			e.data.$el.find("#formPeriodicityMonth" ).css("display", "none");;
			e.data.$el.find("#formPeriodicityWeek" ).css("display", "block");;
		}		 
	},
	
	changeForecastRepeat: function(e){
		if (e.data.$el.find("input.radioForecastRepeat[type='radio']:checked" ).val() == 1){
			e.data.$el.find(".formEveryDayOfMonth" ).css("display", "block");;
			e.data.$el.find(".formEveryDayOfWeek" ).css("display", "none");;			
		}else{
			e.data.$el.find(".formEveryDayOfMonth" ).css("display", "none");;
			e.data.$el.find(".formEveryDayOfWeek" ).css("display", "block");;
		}
	},
	
	changeSignOffRepeat: function(e){
		if (e.data.$el.find("input.radioSignOffRepeat[type='radio']:checked" ).val() == 1){
			e.data.$el.find(".formSignOffEveryDayOfMonth" ).css("display", "block");;
			e.data.$el.find(".formSignOffEveryDayOfWeek" ).css("display", "none");;			
		}else{
			e.data.$el.find(".formSignOffEveryDayOfMonth" ).css("display", "none");;
			e.data.$el.find(".formSignOffEveryDayOfWeek" ).css("display", "block");;
		}
	},
	
	getDataOfForm: function(view){
		var data = new Object();
		data.idForecast = view.model.id;
		data.planningPeriodicity = view.$el.find("#selectForecastPeriodicity option:selected" ).val()
		
		if(data.planningPeriodicity == 1){
			data.planningRepeat 		= view.$el.find("#formPeriodicityMonth .formForecastRepeat 		input[type='radio']:checked" ).val()
			data.planningTimeAvailable 	= view.$el.find("#formPeriodicityMonth .formTimeAvailableMonth 	select.selectPlanningTime option:selected" ).val()
			data.signOffRepeat			= view.$el.find("#formPeriodicityMonth .formSignOffRepeat 		input[type='radio']:checked" ).val()
			data.forecastFor 			= view.$el.find("#formPeriodicityMonth .formForecastForMonth 	select.selectforecastFor option:selected" ).val()
			
			if(data.planningRepeat == 1){
				data.planningFrecuencyRepeat = view.$el.find("#formPeriodicityMonth .formEveryDayOfMonth select.selectForecastFrecuencyRepeat option:selected" ).val()
				data.planningRepeatValue 	 = view.$el.find("#formPeriodicityMonth .formEveryDayOfMonth select.selectForecastRepeatValue option:selected" ).val()
			}else{
				data.planningFrecuencyRepeat = view.$el.find("#formPeriodicityMonth .formEveryDayOfWeek select.selectForecastFrecuencyRepeat option:selected" ).val()
				data.planningRepeatValue 	 = view.$el.find("#formPeriodicityMonth .formEveryDayOfWeek select.selectForecastRepeatValue option:selected" ).val()
			}
			
			if(data.signOffRepeat == 1){
				data.signOffFrecuencyRepeat = view.$el.find("#formPeriodicityMonth .formSignOffEveryDayOfMonth select.selectSignOffFrecuencyRepeat option:selected" ).val()
				data.signOffRepeatValue 	= view.$el.find("#formPeriodicityMonth .formSignOffEveryDayOfMonth select.selectSignOffRepeatValue option:selected" ).val()
			}else{
				data.signOffFrecuencyRepeat = view.$el.find("#formPeriodicityMonth .formSignOffEveryDayOfWeek select.selectSignOffFrecuencyRepeat option:selected" ).val()
				data.signOffRepeatValue 	= view.$el.find("#formPeriodicityMonth .formSignOffEveryDayOfWeek select.selectSignOffRepeatValue option:selected" ).val()
			}
			if(!view.validate(data)){
				return false
			}
			
				
		}else{
			data.planningRepeat 			= view.$el.find("#formPeriodicityWeek .formForecastRepeat 		 input[type='radio']:checked" ).val()
			data.planningFrecuencyRepeat 	= view.$el.find("#formPeriodicityWeek .formEveryDayOfWeek 		 select.selectForecastFrecuencyRepeat option:selected" ).val()
			data.planningRepeatValue 		= view.$el.find("#formPeriodicityWeek .formEveryDayOfWeek 		 select.selectForecastRepeatValue option:selected" ).val()
			data.planningTimeAvailable 		= view.$el.find("#formPeriodicityWeek .formTimeAvailableWeek 	 select.selectPlanningTime option:selected" ).val()
			data.signOffRepeat 				= view.$el.find("#formPeriodicityWeek .formSignOffRepeat 		 input[type='radio']:checked" ).val()	
			data.signOffFrecuencyRepeat 	= view.$el.find("#formPeriodicityWeek .formSignOffEveryDayOfWeek select.selectSignOffFrecuencyRepeat option:selected" ).val()
			data.signOffRepeatValue 		= view.$el.find("#formPeriodicityWeek .formSignOffEveryDayOfWeek select.selectSignOffRepeatValue option:selected" ).val()
			data.forecastFor 				= view.$el.find("#formPeriodicityWeek .forecastForWeek 			 select.selectforecastFor option:selected" ).val()
			
			if(!view.validate(data)){
				return false
			}
		}
		
		return data;
	},
	
	validate: function(data){
		if(data.planningRepeat == 1 && data.signOffRepeat == 1){
			if(parseInt(data.planningRepeatValue) + parseInt(data.planningTimeAvailable) > parseInt(data.signOffRepeatValue))
				return false
		}
		if(data.planningPeriodicity == 2 && data.planningRepeat == 2 && data.signOffRepeat == 2){
			if(parseInt(data.planningRepeatValue) + parseInt(data.planningTimeAvailable) > parseInt(data.signOffRepeatValue))
				return false
		}
		return true
	}
	

});