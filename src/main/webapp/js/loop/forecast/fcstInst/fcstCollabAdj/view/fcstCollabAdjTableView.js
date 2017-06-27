var fcstCollabAdjTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollabAdj/template/fcstCollabAdjTable.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getAdjCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addRow, this);        
        this.$el.find("#addCollabAdjustBtn").click(this,this.newAdjustment);
        return this;
    },
    
    getAdjCollection: function(){
    	this.collection = new fcstCollabAdjCollection([]);
    	_.each(this.getAdjustmentsList(),function(item,i){  
    		var model = new fcstCollabAdjModel({
    			id:item.id,
    			creationDate:item.dateCreation,
    			observation:item.observation,
    			value:item.value,
    			user:item.user,
    			tableModel:this.model
      		},this);
    		this.collection.add(model);
	    },this);
    },
    
    getAdjustmentsList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/fcstCollaborative/getAllCollabAdjusments/',
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

    addRow: function(model) {
        var rowView = new fcstCollabAdjRowView( { model: model} );
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    newAdjustment: function(e){
    	var newRowView = new fcstCollabAdjNewRowView( { model: e.data.model,tablemodel: e.data.model} );
        e.data.$el.find('#no-data-td').remove();
    	e.data.$el.find('tbody').append(newRowView.render().$el);
    },
});