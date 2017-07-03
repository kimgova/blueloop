var forecastRoleView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/roles/forecastRoleTemplate.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.setRolesCollection();
        
        this.collection.each(this.addItem, this);        
        this.$el.find("#addRole").click(this,this.addRole);
        return this;
    },
    
    setRolesCollection: function(){
    	this.collection = new forecastRoleCollection([]);
    	var list = this.getRoleList();  
    	_.each(list,function(item,i){ 
    		var model = new forecastRoleModel({
      		  id:		   		item.id,
      	      name: 	   		item.name,
      	      forecastChain:	item.fcstChain.id
      	    },this);
    		this.collection.add(model);
	    },this);
    },
    
    getRoleList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstRole/getRolesByForecastInstance/',
	        data: {id:this.instanceId},
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

    addItem: function(model) {
        var itemView = new forecastRoleItemView( { model: model } );
        itemView.instanceId = this.instanceId;
 		this.$el.find('#roleList').append(itemView.render().$el);
    },
    
    addRole: function(e){
    	var newItemView = new forecastRoleNewItemView( { instanceId: e.data.instanceId } );
    	newItemView.table = e.data;
    	e.data.$el.find('#roleList').append(newItemView.render().$el);
    },

    
});