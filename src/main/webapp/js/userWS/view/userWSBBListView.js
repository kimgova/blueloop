var userWSBBListView = Backbone.View.extend({
    
    template: '/blueloop/static/js/userWS/template/userWSBBListViewTemplate.ejs',
    
    initialize: function(userId,current_id){
    	_.bindAll(this, 'render', 'arrowRight', 'arrowLeft'); 
    	this.userId = userId;
    	this.current_id = current_id;
    	this.userLoopTw = [];
    	this.listLength;
    	this.bbCollection = new userWSElementCollection([]);
    	this.getBBCollection(this.bbCollection);
    	this.bbCollection.each(this.setUserRolePairs, this);
    	this.setUserBBRoles();
    	
    	/*Horizontal scroll variables*/
        this.visible = 5; //Set the number of items that will be visible in the list
        this.index = 0; //Starting index
        this.endIndex = ( this.bbCollection.length / this.visible ) - 1;
    },
  
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var listHeader = "Building Blocks "+ $("#ws-info-first-name").text() +" participates in: "+ this.listLength;
    	this.$el.find('#ws-bbs-header').text(listHeader);
    	
    	var arrowRight = this.$el.find('.ws-list-arrow-right');
    	arrowRight.click(this, this.arrowRight);
    	
    	var arrowLeft = this.$el.find('.ws-list-arrow-left');
    	arrowLeft.click(this, this.arrowLeft);
    	
    	this.bbCollection.each(this.addElementModel, this);
    	
    	this.setArrows();
    	
        return this;
    },
    
    getAllBB: function(categories){
    	var userId = this.userId;
    	
    	var jsonObject = new Object();
		
    	if(userId!='profile'){
    		jsonObject.userId = userId; 
    	}
    
		jsonObject.categories = '';
		if(categories != null){
			jsonObject.categories = categories.toString()
		}
		jsonObject.includeTeamBB = 'true';
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getAllBuildingBlock/',
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
	
    getBBCollection : function(collection){
    	var response = this.getAllBB(null);
    	var bbList = response.listMyBB;
    	var teamBBList = response.listBBTeam;
    	this.listLength = bbList.length + teamBBList.length;
    	var filePath = response.filePath;
    
    	this.addBBList(collection,bbList, filePath);
    	this.addBBList(collection,teamBBList, filePath);
    },

	addBBList: function(collection, bbList, filePath){
    	_.each(bbList,function(item,i){
    		var model = new userWSElementModel({
      	      id: item.id,
      		  path: filePath + item.fileName, //picture path
      	      name: item.name,
      	      role: "Role: Fake",
      	      teamwork: item.teamwork.id,
      	      ownerName:item.ownerName
      		});
    		collection.add(model);
    	});
	},

    addElementModel: function(model) {
        var modelView = new userWSElementView( {model: model} );
        this.$el.find('#ws-bbs-list').append(modelView.render().$el);
     },
     
     setArrows : function(){
       	 var arrowRight =  this.$el.find('.ws-list-arrow-right');
       	 var arrowLeft =  this.$el.find('.ws-list-arrow-left');
       	 if(this.bbCollection.length > this.visible){
       		arrowRight.removeClass('hidden');
       		arrowRight.addClass('visible');
       		if(this.index > this.endIndex){
       			arrowRight.removeClass('visible');
           		arrowRight.addClass('hidden');
       		}
       		if(this.index > 0){
       			arrowLeft.removeClass('hidden');
           		arrowLeft.addClass('visible');
       		}
       		if(this.index == 0){
       			arrowLeft.removeClass('visible');
           		arrowLeft.addClass('hidden');
       		}
       	 }
        },
        
        arrowRight : function(e){
       	 
       	 if(this.index < this.endIndex ){
                this.index++;
                if(this.index >= this.endIndex){
               	 this.setArrows();
                }
                $('#ws-bbs-list div.ws-element').animate({'left':'-=594px'});
            }
       	
        },
        
        arrowLeft : function(e){
       	 if(this.index > 0){
                this.index--;    
                if(this.index == 0){
               	 this.setArrows();
                }
                $('#ws-bbs-list div.ws-element').animate({'left':'+=594px'});
             }
        },
        
        setUserRolePairs : function(model){
        	this.userLoopTw.push({"teamwork" : model.attributes.teamwork, "userId" : this.userId});
        	
        },
        
        getUserBBRoles : function(){
        	
        	var jsonObject = new Object();
        	jsonObject.userId = this.userId;
    		jsonObject.pairs = JSON.stringify(this.userLoopTw);
    		var dataReturned = $.ajax({
    	        type: 'GET',
    	        url: '/blueloop/teamwork/getUserTWRoles/',
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
        
        setUserBBRoles : function(){
        	var rolesList = this.getUserBBRoles();
        	var formattedRole;
        	_.each(rolesList,function(item,i){
        		this.bbCollection.find(function(model) {
        			if(model.get('teamwork') == item.teamworkId){
        				formattedRole = this.formatRoles(item.role)
        				model.set({role: formattedRole}); 
        			};
        		}, this);
        	}, this);
        },
        
	    formatRoles : function(role){
	    	switch(role){
		    	case "BB_ADMIN": 
		    		return "BB Owner";
		    	break;
		    	case "BB_USER": 
		    		return "In Teamwork";
		    	break;
	    	}
	    	
	    }
    
});