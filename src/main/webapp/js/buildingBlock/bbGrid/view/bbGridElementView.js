var bbGridElementView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/bbGrid/template/bbGridElementViewTemplate.ejs',

    initialize: function(){
        _.bindAll(this, 'render', 'clicked','showOptions', 'hideOptions', 'archiveBB', 'removeBB', 'restoreBB'); 
        this.listenTo(this.model, 'show', this.show);
        this.listenTo(this.model, 'hide', this.hide);
    },
    
    hide: function()
    {
      this.$el.addClass('hide')
    },
    
    show: function()
    {
      this.$el.removeClass('hide')
    },
    
    clicked: function(e){
        e.preventDefault();
        var id = this.model.get("id");
        var path = this.model.get("path");
        var res = this.getBB(id);
        var bb = res.bb;
        var connectedBBs = this.getConnectedBBs(id).bbList.length; //length of BBs array
       
        bbPanel.refresh(this.model);
    },
    
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find("#detail-btn").click(this,this.clicked);
    	
    	this.$el.find('#user-options').click(this, this.showOptions);
    	this.$el.find('#mark-transition').mouseleave(this, this.hideOptions);
    	
    	this.$el.find('#archive-bb').click(this, this.archiveBB);
    	this.$el.find('#remove-bb').click(this, this.removeBB);
    	this.$el.find('#restore-bb').click(this, this.restoreBB);

        return this;
    },
    
    getBB : function(idBB){
    	var jsonObject = new Object();
		jsonObject.id=idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/buildingBlock/getBuildingBlock/',
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
		return dataReturned.responseJSON; 
    },
    
    getConnectedBBs : function(idBB){
    	var jsonObject 		  = new Object();
		jsonObject.idBB 	  = idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/buildingBlock/getConnectedBBs/',
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
		return dataReturned.responseJSON; 
    },
    
    
    addModel: function(model) {
        var modelView = new bbPanelElementView( {model: model} );
        $('#info-panel').append(modelView.render().$el);
     },
     
     showOptions: function(e){
     	this.$el.find('#user-options').css('top', '-16px');
     	this.$el.find('#archive-bb').css('top', '11px');
     	this.$el.find('#remove-bb').css('top', '11px');
     	this.$el.find('#goto-ws').css('top', '11px');
     },
     
     hideOptions: function(e){
     	this.$el.find('#user-options').css('top', '7px');
     	this.$el.find('#archive-bb').css('top', '-16px');
     	this.$el.find('#remove-bb').css('top', '-16px');
     	this.$el.find('#goto-ws').css('top', '-16px');
     },
     
     archiveBB : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;	
		 
		 
    	 bootbox.confirm(json.bb.confirmArchive, function (e) {
 			if ( model.loops != 0 || !e ){
 				if (e){
 					toastr.error(json.bb.myBBAssociatedWithLoop);
 				}
 				return;
 			}
 			$.ajax({
 		        type: 'GET',
 		        url: '/blueloop-backend/buildingBlock/deleteBuildingBlock/',
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
 			toastr.success(json.bb.archived);
 			setTimeout(function(){window.location.replace("/blueloop-backend/buildingBlock/list")}, 1000);
 		});
     },
     
     restoreBB : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;	
			
		 ajaxCall('GET','/blueloop-backend/buildingBlock/restoreBuildingBlock/', jsonObject, "text/json", "json", false);
		 toastr.success(json.bb.restored);
		 setTimeout(function(){window.location.replace("/blueloop-backend/buildingBlock/list")}, 1000);
	 },
	 
	 removeBB : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;	
		 
		 bootbox.confirm(json.bb.confirmDelete, function (e) {
			if(e){					
				$.ajax({
	 		        type: 'POST',
	 		        url: '/blueloop-backend/buildingBlock/eraseBuildingBlock/',
	 		        data: JSON.stringify(jsonObject),
	 		        contentType: "text/json",
	 		        dataType: 'json',
	 		        async: false,
	 		        success: function(data, textStatus) {
	 		        	data =  data;
	 		        	toastr.success(json.bb.deleted);
	 		        	setTimeout(function(){window.location.replace("/blueloop-backend/buildingBlock/list")}, 1000);
	 		        },
	 		    	error: function(httpRequest, textStatus, errorThrown) { 
	 		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 		     	   toastr.error(httpRequest.responseText);
	 		     	}
	 		    });
			}
		});
	 }
    
});