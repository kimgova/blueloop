var bbWSConnectionsView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/workspace/connections/template/bbWSConnectionsViewTemplate.ejs',
	leftPanelTemplate: '/blueloop/static/js/buildingBlock/workspace/connections/template/bbConnectionsLeftPanelTemplate.ejs',
	
    initialize: function (bb){
    	_.bindAll(this, 'countPendingConnections', 'newConnectionModal'); 
    	this.bb = bb;
    	this.connectedBBs = this.getConnectedBBs(this.bb.bb.id);
    	this.filePath = this.connectedBBs.filePath;

    	this.bbConnections = new bbConnectionsTableRowCollection([]);
    	
    	this.getConnectionsCollection();
    	
	},
	
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.renderLeftPanel();
    	this.$el.find("#add_btn").click(this,this.newConnectionModal);
    	this.bbConnections.each(this.appendTableRow, this);
        return this;
    },
    
    renderLeftPanel: function() {
    	var model = this.getBBModel();
    	this.leftPanel = $(new EJS({url: this.leftPanelTemplate }).render(model.toJSON()));
        this.$el.find('#bb-ws-info-container').append(this.leftPanel);
     },
    
    getBBModel: function(){
    	var bb = this.bb;
    	var connectedBbs = this.connectedBBs.bbList.length;
    	var connsPending = this.countPendingConnections();
    	var model = new bbConnectionsLeftPanelModel({	
    		  id: bb.bb.id,
    	      name: bb.bb.name,
    	      path: bb.filePath + bb.bb.fileName,
    	      connBbs : connectedBbs,
    	      connsPending: connsPending,
    	      lastUpdated: "Fake 23, 2015"
    		});
    	return model;
    },
    
    getConnectedBBs : function(idBB){
    	var jsonObject 		  = new Object();
		jsonObject.idBB 	  = idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getConnectedBBs/',
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
    
    getConnectionsRequestReceived: function(idBB){
    	var jsonObject 		  = new Object();
		jsonObject.idBB 	  = idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getConnectionRequestReceived/',
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
		//console.log(dataReturned.responseJSON);
		return dataReturned.responseJSON; 
    },
    
    getConnectionsRequestSent: function(idBB){
    	var jsonObject 		  = new Object();
		jsonObject.idBB 	  = idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getConnectionRequestSent/',
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
    
    getConnectionsCollection: function(){
    	//var bbConnections = this.bbConnections.connBBs;
    	//var filePath = this.bbConnections.filePath;
    	var sentConnections = this.getConnectionsRequestSent(this.bb.bb.id);
    	var receivedConnections = this.getConnectionsRequestReceived(this.bb.bb.id);
    	
    	this.addBBConnectionsList(this.bbConnections , receivedConnections, "Received");
    	this.addBBConnectionsList(this.bbConnections , sentConnections, "Sent");
    },
    
    addBBConnectionsList: function(collection, connections, category){
    	 var filePath = this.filePath;
    	 myBbId = this.bb.bb.id
    	 
    	 var bbIn, bbOut;
    	 
    	_.each(connections,function(item,i){
    		if(category == "Sent"){
       		 	bbIn = myBbId;
       		 	bbOut = item.bbId;
    		}else{
    			bbIn = item.bbId;
    			bbOut = myBbId;
       	 	}
    		if(item.state != "Canceled" && item.state != "Declined"){
	    		var model = new bbConnectionsTableRowModel({	
	    		  connId: item.id,
	    		  myBbId: myBbId,
	    		  connBbId: item.bbId,
	    		  bbIn: bbIn,
	    	      bbOut: bbOut,
	      		  name: item.bbName,
	      	      path: filePath + item.fileName,
	      	      permissions : "",
	      	      category: category,
	      	      status: item.state
	      		});
	    		collection.add(model);
    		}
    	});
	},
	
	appendTableRow: function(model) {
		var modelView = new bbConnectionsTableRowView( {model: model} );
	    this.$el.find('#ws-connections-table tbody').append(modelView.render().$el);
	},
	
	countPendingConnections : function(){
		var count = 0;
		this.bbConnections.each(function(item,i){
			var status = item.get('status');
			if(status == "Pending"){
				count+=1;
			}
    	});
		return count;
	},
	
	newConnectionModal : function(){
		window.connModal = new bbConnectionsModalView(this.bb.bb.id);
	}
   
});