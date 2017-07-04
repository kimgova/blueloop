var userForecastRoleNewRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/userlist/newRowUserForecastRoleTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
    	var userList = this.listUsers(this.getListUsers());

        this.$el = $(new EJS({url: this.template }).render({userList:userList}));
        this.$el.find("#saveUserRole").click(this,this.saveNewUserRole);
        this.$el.find("#cancelUserRole").click(this,this.cancelUserRole);               
    	
        return this;
    },
    
    getListUsers: function () {
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/user/getAllContacts/',
	        data: {instanceId:this.instanceId,roleId:this.roleId,andMe:true},
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
	
	listUsers: function (allusers) {
		var list = []
		var that = this;
		$.each(allusers, function(j, user){ 
			var founded = false;			
			$.each(that.table.collection.models, function(i, userForecast){
				if(userForecast.attributes.userid == user.id){
					founded = true;
				}				
	        }) 
	        if(!founded){
	        	list.push(user);
	        }
        })
		return list;
	},
	
	saveNewUserRole: function(e){
    	var userId = e.data.$el.find('#selectNewUserRole').val()
		var newuser = JSON.parse(e.data.saveUserRole(userId, e.data.roleId));
    	var model = new forecastInstanceModel({
    		id : newuser.userForecastRole.id,
    		user : newuser.user,
    		role : newuser.userForecastRole.forecastRole.id,
   			creationDate : newuser.userForecastRole.creationDate,
   			userid: newuser.user.id 
      	});
    	var rowView = new userForecastRoleRowView( { model: model } );
    	rowView.table = e.data.table;
    	e.data.table.$el.find('tbody').append(rowView.render().$el);
    	e.data.table.collection.add(model);
    	e.data.remove();
    },
    
    saveUserRole: function(userId, roleId){
    	var dataUser = {roleId:roleId,userId:userId};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstRole/saveUserForecastRole/',
	        data: JSON.stringify(dataUser),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.fcstInstRoleUserAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    cancelUserRole: function(e) {
    	e.data.remove();
    }

});