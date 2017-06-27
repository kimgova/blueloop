var userForecastRoleTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/userlist/tableUserRoleTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.setInstanceCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addRow, this);        
        this.$el.find("#addUserToRole").click(this,this.addUserToRole);
        return this;
    },
    
    setInstanceCollection: function(){
    	this.collection = new userForecastRoleCollection([]);
    	var list = this.getUserForecastList();      	
    	_.each(list,function(item,i){    		
    		var model = new forecastInstanceModel({
    			id : item.userForecast.id,
    			user : item.user,
    			role : item.userForecast.forecastRole.id,
    			creationDate : item.userForecast.creationDate,
    			userid: item.user.id
      		},this);
    		this.collection.add(model);
	    },this);
    },
    
    getUserForecastList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/fcstRole/getUserForecastPerRole/',
	        data: {instanceId:this.instanceId,roleId:this.roleId},
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
        var rowView = new userForecastRoleRowView( { model: model } );
        rowView.table = this;
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    addUserToRole: function(e){
    	var newRowView = new userForecastRoleNewRowView( { roleId: e.data.roleId } );
    	newRowView.table = e.data;
        e.data.$el.find('#no-data-td').remove();
    	e.data.$el.find('tbody').prepend(newRowView.render().$el);
    },
});