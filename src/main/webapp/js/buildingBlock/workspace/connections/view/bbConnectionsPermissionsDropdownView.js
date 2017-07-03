var bbConnectionsPermissionsDropdownView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/workspace/connections/template/bbConnectionsPermissionsDropdownTemplate.ejs',

    initialize: function (idBB, idConnection){
    	_.bindAll(this, 'savePermissions'); 
    	this.idBB = idBB;
    	this.idConnection = idConnection;
    	this.render();
    	
    	
	},
    
     render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.connectionsPermissions = new bbConnectionsPermissionsCollection([]);
    	this.permissions = this.getPermissions();
    	this.addPermissions(this.connectionsPermissions);
    	this.connectionsPermissions.each(this.appendPermission, this);
    	
    	this.connectionsPermissions.bind("change", this.savePermissions);
    	
        return this;
    },
    
    getPermissions: function(){
    	var jsonObject 		  = new Object();
    	jsonObject.idConnection 	  = this.idConnection;
		jsonObject.idBB 	  = this.idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getPermissions/',
	        data: jsonObject,
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
		console.log(dataReturned.responseJSON);
		return dataReturned.responseJSON; 
    },
    
    addPermissions: function(collection){
    	_.each(this.permissions,function(item,i){
    		var model = new bbConnectionsPermissionsModel({	
      		  	  categoryId: item.categoryId,
      		  	  categoryName: item.categoryName,//item.bbId,
        		  permission: item.permission
        		});
      		collection.add(model);
    	});
    },
    
    appendPermission: function(model) {
		var modelView = new bbConnectionsPermissionsElementView( {model: model} );
	    this.$el.append(modelView.render().$el);
	},
	
	savePermissions : function(){
		var listSave = [];
		var permission = {};
		
		this.connectionsPermissions.each(function(item,i){
			var checked = item.get('permission');
			if(checked == "checked"){
				permission = {};
				permission.idCategory = item.get('categoryId');
				listSave.push(permission);
			}
    	});
		var data = {listPermissions:listSave, idConnection:this.idConnection, idBB:this.idBB };
		var dataAjax = ajaxCall('POST', '/blueloop/buildingBlock/savePermissions/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
		toastr.success(json.bb.permissionsSaved);
	}
    
});