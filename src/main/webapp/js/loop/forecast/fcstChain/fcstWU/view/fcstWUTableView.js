var forecastWUTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUTable.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getWUCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
		this.$el.find("#addWUBtn").click(this,this.addWU);
		this.$el.find("#defineSequenceBtn").click(this, this.defineActivitiesSequence);
        return this;
    },
    
    getWUCollection: function(){
    	this.collection = new forecastWUCollection([]);
    	_.each(this.retrieveWorkingUnitList(),function(item,i){
    		var model = new forecastWUModel({
    			id:item.wu.id,
      		  	name: item.wu.name,
      		  	activities: item.activities,
      		  	members: item.users,
      		  	forecastId:this.forecastId,
      		  	filePath:item.filePath
      		});
    		this.collection.add(model);
	    },this);
    },
    
    retrieveWorkingUnitList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstWUnit/getAllWorkingUnitByForecast/',
	        data: {id:this.forecastId},
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

    addModel: function(model) {
        var modelView = new forecastWURowView( { model: model } );
        modelView.viewRow = this.viewRow; 
 		this.$el.find('tbody').append(modelView.render().$el);
    },
    
    addWU: function(e){
    	e.data.$el.find("tbody").find('#no-data-tr').remove();
    	var modelView = new forecastWUNewRowView( { forecastId: e.data.forecastId } );
    	modelView.viewRow = e.data.viewRow;
    	e.data.$el.find('tbody').append(modelView.render().$el);
    },
        
    defineActivitiesSequence: function(e){
    	var sequenceModalView = new SequenceModalView({});
    	sequenceModalView.idForecast = e.data.forecastId; 
    	sequenceModalView.init();    	
    }

});