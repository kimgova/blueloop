var bbConnectionsModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/workspace/connections/newConnectionModal/template/bbConnectionModalTemplate.ejs',
    
    
    initialize: function(myBB){
    	
    	_.bindAll(this, 'filterBBs', 'filterSearch'); 
    	this.myBB = myBB;
    	this.bbConnections = new bbConnectionElementCollection([]);
    	this.getConnectionsCollection();
        this.render();
    },
    
     render: function() {
        var data = this.searchBB("nonConnected");
		this.$el = $(new EJS({url: this.template }).render({bbList:data.bbList}));
		this.$el.modal('show');
		this.$el.find('#searchAllBB').keyup(this,this.filterSearch);
		this.bbConnections.each(this.appendConnectionElement, this);
		return this;
    },
    
    filterBBs : function(e){
    	var filterId = e.target.id;
    	this.bbConnections.reset();
    	this.getConnectionsCollection(filterId);
    	this.$el.find('#modal-bb-grid').empty();
    	this.bbConnections.each(this.appendConnectionElement, this);
    },
    
    filterSearch: function(){
		var letters = $('#searchAllBB').val();
		this.bbConnections.byName(letters);
	},
    
	searchBB : function(filter){
		var jsonObject 		  = new Object();
		jsonObject.searchWord = "";
		jsonObject.myBB 	  = this.myBB;
		jsonObject.filter 	  = filter;
		var data 			  = ajaxCall('GET', '/blueloop-backend/buildingBlock/getBBbySearchWord/', jsonObject, "text/json", "json", false);
		console.log(data);
		if(data.error){
			toastr.error(data.error);
		}else{
			return data;
		}
    },
    
    getConnectionsCollection: function(filter){
    	var response = this.searchBB(filter);
    	
    	this.addBBConnectionsList(this.bbConnections , response);
    },
    
    addBBConnectionsList: function(collection, data){
	   	 var filePath = data.filePath;
	   	 var bbList = data.bbList;
	   	 
	   	_.each(bbList,function(item,i){
	   		var model = new bbConnectionElementModel({	
	   			id:item.bbObject.id,
	   			category:item.bbObject.category,
	   			name: item.name,
	   			ownerName: item.ownerFullName,
	   			path: filePath + item.fileName,
	   			company: item.bbObject.companyName
	     	});
	   		collection.add(model);
	   	});
	},
	
	appendConnectionElement: function(model) {
		var modelView = new bbConnectionElementView( {model: model} );
	    this.$el.find('#modal-bb-grid').append(modelView.render().$el);
	},
	
	refreshSelection : function(model){
		this.$el.find('#modal-bb-grid').addClass('closed');
		var selectionView = new bbConnectionSelectionView(model, this.myBB);
		this.$el.find('#modal-selection-container').append(selectionView.render().$el);
		this.$el.find('#modal-selection-container').addClass('opened');
	}
	
	
    
    
});