var fcstCollabRiskTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollabRisk/template/fcstCollabRiskTable.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getRiskCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
		this.$el.find("#addRiskBtn").click(this,this.addRisk);
        return this;
    },
    
    getRiskCollection: function(){
    	this.collection = new fcstCollabRiskCollection([]);
    	_.each(this.retrieveRiskList(),function(item,i){
    		var model = new fcstCollabRiskModel({
    			id:item.id,
    			creationDate:item.dateCreation,
    			observation:item.observation,
    			variation:item.value,
    			probability:item.probability,
    			user:item.user,
    			tableModel:this.model
      		});
    		this.collection.add(model);
	    },this);
    },
    
    retrieveRiskList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/fcstCollaborative/getAllCollabRisks/',
	        data: {id:this.model.id,objectType:this.model.get("rowType"),filterType:this.model.get("filterType"),instanceId:this.model.get("instanceId")},
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
        var modelView = new fcstCollabRiskRowView( { model: model } );
 		this.$el.find('tbody').append(modelView.render().$el);
    },
    
    addRisk: function(e){
    	var modelView = new fcstCollabRiskNewRowView( { model: e.data.model, tablemodel: e.data.model } );
        e.data.$el.find('#no-data-td').remove();
    	e.data.$el.find('tbody').append(modelView.render().$el);
    }

});