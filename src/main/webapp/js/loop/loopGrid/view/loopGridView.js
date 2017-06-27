var loopGridView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/loopGrid/template/loopGridViewTemplate.ejs',
	emptyGridTemplate: '/blueloop-backend/static/js/loop/loopGrid/template/loopGridDefaultEmptyTemplate.ejs',
    
    initialize: function (){;
    	this.getLoopCollection();
        this.render();
 	},
 	
 	constructor : function (options) {
		_.extend(this, options);
	},

	filteredCollection: function(elementId){  
        if(elementId === 'filter-mine'){
        	this.collection.byOwner('My Loop');
        }else if(elementId === 'filter-invited'){
        	this.collection.byOwner('Participating Loop');
        }else if(elementId === 'filter-all'){
        	this.collection.byOwner('All');
        }else if(elementId === 'filter-archived'){
        	this.collection.byOwner('Archived');
        }
    },   
	
    render: function() {
    	this.getLoopCollection();
    	
    	if(this.collection.length != 0){
    		this.$el = $(new EJS({url: this.template }).render());
    		this.collection.each(this.addModel, this);
            this.collection.byOwner('All');
    	}else{
        	this.$el = $(new EJS({url: this.emptyGridTemplate }).render({creationPermission:this.mainView.creationPermission}));
    	}
      
        return this;
    },
    
    getLoopCollection: function(){
    	this.collection = new loopElementCollection([]);
    	var data = this.getAllLoops();
    	
    	var allAvailableLoops = data.allLoops;
    	var archivedLoops = data.archivedLoops;
    	var currentUser = data.currentUser.id;
    	
    	this.setCollection(allAvailableLoops,currentUser, false)
    	this.setCollection(archivedLoops,currentUser, true)
    },

    getAllLoops:function(){
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/chain/getMyLoopsData/',
	        data: {},
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
	
	setCollection: function(chainlist, currentUser, archived){
    	_.each(chainlist,function(item,i){
    		var ownership = "Participating Loop";
			if(item[0].userCreator.id == currentUser){
				ownership = "My Loop";
			}
			if(archived == false || (archived == true && ownership == "My Loop")){ 
			//archived participating loops are not added to collection and are not shown
				var model = new loopElementModel({	
			  	      id:item[0].id,
			  	      name: item[0].description,
			  	      creatorName: item[1].firstName + " " + item[1].lastName,
			  	      creatorId: item[0].userCreator.id,
			  	      creationDate: item[0].creationDate,
			  	      containsBBs: item[0].chainBbs.length,
			  	      performanceLevel: "",
			  	      lastUpdated: "12/12/2015",
			  	      ownership: ownership,
			  	      archived:archived
			  	});
				this.collection.add(model);
			}
	    },this); 
	},

    addModel: function(model) {
       var modelView = new loopElementView( {model: model, mainView: this.mainView} );
       this.$el.append(modelView.render().$el);
    },
    
    filterSearch: function(letters){
		this.collection.byName(letters);		
	}
    
});