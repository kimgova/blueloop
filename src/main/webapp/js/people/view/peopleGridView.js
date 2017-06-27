//(function($){
var peopleGridView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/people/template/peopleGridViewTemplate.ejs',
    
	
    initialize: function (){
    	_.bindAll(this, 'render', 'load');
        this.collection = new peopleCollection([]);
    	this.getPeopleCollection(this.collection, "All", 0);  	
	},
	
//	clicked: function(e){
//        e.preventDefault();
//        var elementId = e.target.id;
//        this.filteredCollection(elementId);
//        this.render();
//    },
    
    
    //This function is called when user scrolls and gets to the end of the grid, so it loads more people
    //The ammount of people loaded each time is defined by the variable 'max' in getPeople() function from SearchController.groovy
    load: function(){ 
        //e.preventDefault();
        var offset = this.collection.length; 
        var filter = $('#connection-filter').text();
        
        console.log('offset : '+ offset + ' filter: ' + filter);
        
        var response = this.getPeople(filter, offset);
        var list = response.resultUsers;
    	var path = response.filePath;
    	
    	if(filter == "Connected"){
    		this.addConnectedUsers(this.collection,list,path);
    	}else if(filter == "Not Connected"){
    		this.addNotConnectedUsers(this.collection,list,path);
    	}else if(filter == "All"){
    		this.addNotConnectedUsers(this.collection,list.notConnectedUsers,path);
    		this.addConnectedUsers(this.collection,list.connectedUsers,path);
    	}
    
    	this.collection.reset(this.collection.models);
        this.refresh();
        
    },
	
	filteredCollection: function(elementId){
		
        var filteredElements;
        this.collection.reset();
        this.collection = new peopleCollection([]);
        if(elementId === 'filter-all'){
        	$('#connection-filter').text('All');
        	this.getPeopleCollection(this.collection, "All",0);
        	//this.getPeopleCollection(this.collection, "Not Connected",0);
        }else if(elementId === 'filter-conn'){
        	$('#connection-filter').text('Connected');
        	this.getPeopleCollection(this.collection, "Connected",0);
        }else if(elementId === 'filter-noconn'){
        	$('#connection-filter').text('Not Connected');
        	this.getPeopleCollection(this.collection, "Not Connected",0);
        }else if(elementId === 'filter-pending'){
        	$('#connection-filter').text('Pending');
        	this.getPeopleCollection(this.collection, "Pending",0);
        }
        this.refresh();
        
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
        this.collection.each(this.addModel, this);
        return this;
    },
    
    refresh: function() {
    	this.$el.empty();
        this.collection.each(this.addModel, this);
        return this;
    },
    
    getPeopleCollection: function(collection, filter, offset){
    	var response = this.getPeople(filter, offset);
    	var list = response.resultUsers;
    	var path = response.filePath;
    	if(filter == "All"){
    		this.addNotConnectedUsers(collection,list.pendingUsers,path);
    		this.addConnectedUsers(collection,list.connectedUsers,path);
    		this.addNotConnectedUsers(collection,list.notConnectedUsers,path);
    	}else if(filter == "Connected"){
    		this.addConnectedUsers(collection,list,path);
    	}else{
    		this.addNotConnectedUsers(collection,list,path);
    	}
    },
    
    addConnectedUsers: function(collection,list, path){
    	_.each(list,function(item,i){
    		var model = new peopleElementModel({	
	  			  id:item.id,
	  		      firstName: item.firstName,
	  		      lastName: item.lastName,
	  		      department: item.department, 
	  		      email: item.email,
	  		      status: "", 
	  		      connection: true,
	  		      connectionSended: false,
	  		      connectionReceived: false,
	  		      request: item.friendRequest,
	  		      path: path + "/" + item.username + "/user/profile.png"
    		});
  		    collection.add(model);
    	});
	},
	
	addNotConnectedUsers: function(collection,list, path){
    	_.each(list,function(item,i){
    		var connectionSended = false,connectionReceived = false, connectionReceivedId = 0;
    		if(item.friendRequestId == true){
    			connectionSended = true;
    		}
    		if(item.requestStatus != null){
    			connectionReceived = true;
    			connectionReceivedId = item.requestStatus.id;
    		}
    		var model = new peopleElementModel({	
    			  id:item.id,
    		      firstName: item.userObject.firstName,
    		      lastName: item.userObject.lastName,
    		      department: item.userObject.department, 
    		      email: item.userObject.email,
    		      status: '', //???
    		      connection: item.areTheyConnected,
	  		      connectionSended: connectionSended,
	  		      connectionReceived: connectionReceived,
	  		      connectionReceivedId: connectionReceivedId,
    		      //connection: "nonConnStatus",
    		      request: item.friendRequest,
    		      path: path + "/" + item.userObject.username + "/user/profile.png"
      		});
    		collection.add(model);
    	});
	},
   
    getPeople:function(filter, offset){
    	var jsonObject = new Object();
		jsonObject.offset = offset;
		jsonObject.filter = filter;

		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/search/getPeople',
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
		return dataReturned.responseJSON; //send only the responseJSON 
	},

    addModel: function(model) {
       var modelView = new peopleElementView( {model: model} );
       this.$el.append(modelView.render().$el);
    },
    
	changeStatusColor : function(userId, status){
		this.collection.find(function(model) { 
			if(model.get('id') == userId){
				model.set({status: status}); 
			}; 
		});
	},
	
	filterSearch: function(letters){
		this.collection.byName(letters);
	}
});

