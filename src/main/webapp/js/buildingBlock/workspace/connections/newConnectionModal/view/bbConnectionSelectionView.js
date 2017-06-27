var bbConnectionSelectionView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/workspace/connections/newConnectionModal/template/bbConnectionSelectionViewTemplate.ejs',
    
    
    initialize: function(model, myBB){
    	_.bindAll(this, 'sendConnectionRequest'); 
    	this.model = model;
    	this.myBB = myBB;
    },
    
     render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find('#send-btn').click(this, this.sendConnectionRequest);
        return this;
    },
    
    sendConnectionRequest : function(){
		var instanceId	= "";
		var bbOutId		=  this.model.get('id'); 
		var bbInId		= this.myBB;
		var dat			= {bbOutId:bbOutId, bbInId:bbInId, instanceId:instanceId};
		
	    var data = ajaxCall('POST', '/blueloop-backend/buildingBlock/connectBuildingBlock', JSON.stringify(dat), "text/json", "json", false);

	   	var idConnection = data.bbcInstance;
	   	this.savePermissions(idConnection, bbInId);
	   	toastr.success(json.connection.sent);
	},
	
	savePermissions : function(idConnection, idBB){
		console.log(idConnection + "/" + idBB);
		var listSave = [];
		var permission = {};
		$("#category-list input:checkbox").each(function (index,checkbox) {
			if( $(checkbox).attr('checked') ){
				permission = {};
				permission.idCategory  = $(checkbox).attr('value');
				listSave.push(permission);
			}
	    });		
		var data = {listPermissions:listSave, idConnection:idConnection, idBB:idBB };
		var dataAjax = ajaxCall('POST', '/blueloop-backend/buildingBlock/savePermissions/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
		
	}
    
    
    
});