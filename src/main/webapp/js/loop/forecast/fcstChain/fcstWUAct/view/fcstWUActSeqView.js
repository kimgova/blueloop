var SequenceModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActSeqTemplate.ejs',
    sequenceCollection: null,
    viewItems: [],

    init: function() {
    	$("#activitySequenceModal").remove();
    	this.$el = $(new EJS({url: this.template }).render());  
    	this.render();    	
    	this.$el.find("#saveSequence").click(this,this.saveSequence);    	
    },
    
    render: function() {    
    	this.$el.find('#sortable').html("");
    	var listActivities = this.getActivities();    	
    	this.setCollections(listActivities);
    	this.sequenceCollection.each(this.addModel, this);
  
    	var that = this;
    	this.$el.find('#sortable').sortable({
           update: function(ev, ui){
              that.listUpdate();
           }
       });    
		
    	this.$el.modal("show");
    	
        return this;
    },

	
	addModel: function(model) {
		var listView = new activityListView({ model: model, collection: this.sequenceCollection });
		this.$el.find('#sortable').append(listView.render().$el);
		this.viewItems.push(listView);
	},
		
	saveSequence: function(e) {
	    var forecastData = {data:e.data.sequenceCollection.models};
	    var dataReturned = $.ajax({
		    type: 'POST',
		    url: '/blueloop-backend/fcstWUnitActiv/saveSequenceActivities/',
		    data: JSON.stringify(forecastData),
		    contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.sequenceSaved);
	        },
	        error: function(httpRequest, textStatus, errorThrown) { 
	        	console.log("status=" + textStatus + " ,error=" + errorThrown);
	        	toastr.error(json.error.tryAgain);
	        }
	    });
	},
    
    getActivities: function(){    	
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/fcstWUnitActiv/getAllActivitiesByForecastChain/',
	        data: {id:this.idForecast},
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
		return dataReturned.responseJSON;
    },
    
    setCollections: function(listActivities){
    	this.sequenceCollection = new forecastWUActCollection([]);
    	var that = this;
    	_.each(listActivities,function(item,i){   
    		var model = new forecastWUActModel({
    			id:item.activity.id,
      		  	name: item.activity.name,
      		  	status: item.activity.description,
      		  	step: item.activity.step,
      		  	dependencies:item.dependencies,
      		  	tag:i+1
      		});
    		that.sequenceCollection.add(model);   		
	    });
    },
    
    listUpdate: function(){
    	_.each(this.viewItems, function(item){
            item.model.set('step', item.$el.index()+1);
       });
    }

});