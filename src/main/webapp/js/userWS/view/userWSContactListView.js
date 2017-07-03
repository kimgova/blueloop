var userWSContactListView = Backbone.View.extend({
	
    template: '/blueloop/static/js/userWS/template/userWSContactListViewTemplate.ejs',
   
    initialize: function(userId){
    	_.bindAll(this, 'render', 'arrowRight', 'arrowLeft'); 
    	this.userId = userId;
    	this.listLength;
    	this.contactsCollection = new userWSContactCollection([]);
    	this.getContactCollection(this.contactsCollection);

    	/*Horizontal scroll variables*/
        this.visible = 5; //Set the number of items that will be visible in the list
        this.index = 0; //Starting index
        this.endIndex = ( this.contactsCollection.length / this.visible ) - 1;
 
    },
  
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var listHeader = $("#ws-info-first-name").text() +"'s Connections: "+ this.listLength;
    	this.$el.find('#ws-contacts-header').text(listHeader);
    	
    	var arrowRight = this.$el.find('.ws-list-arrow-right');
    	arrowRight.click(this, this.arrowRight);
    	
    	var arrowLeft = this.$el.find('.ws-list-arrow-left');
    	arrowLeft.click(this, this.arrowLeft);
    	
    	this.contactsCollection.each(this.addElementModel, this);
    	
    	this.setArrows();
    	 
        return this;
    },
    
    getAllContacts : function(){
    	var userId = this.userId;
    	
    	var jsonObject = new Object();
		
    	
    	if(userId!='profile'){
    		jsonObject.userId = userId; 
    	}
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/user/getAllContacts/',
	        data: jsonObject,
	        contentType: 'text/json; charset=utf-8',
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
	
    getContactCollection : function(collection){
    	var response    = this.getAllContacts(null);
    	var contactList = response.listUsers;
    	this.listLength = contactList.length;
    	this.addcontactList(collection,contactList);
    },

    addcontactList : function(collection, contactList) {
        _.each(contactList, function(item, i) {
            var model = new userWSContactModel({
                id : item.id,
                path : item.path,
                firstName : item.firstName,
                lastName : item.lastName,
                currentUser : item.currentUser,
                partners : item.partners,
                pendingRequestApprove : item.pendingRequestApprove,
                pendingRequestSend : item.pendingRequestSend
            });
            collection.add(model);
        }, this);
    },

    addElementModel: function(model) {
        var modelView = new userWSContactView( {model: model} );
        this.$el.find('#ws-contact-list').append(modelView.render().$el);
     },
     
     
     setArrows : function(){
    	 var arrowRight =  this.$el.find('.ws-list-arrow-right');
    	 var arrowLeft =  this.$el.find('.ws-list-arrow-left');
    	 if(this.contactsCollection.length > this.visible){
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
             $('#ws-contact-list div.ws-element').animate({'left':'-=594px'});
         }
    	
     },
     
     arrowLeft : function(e){
    	 if(this.index > 0){
             this.index--;    
             if(this.index == 0){
            	 this.setArrows();
             }
             $('#ws-contact-list div.ws-element').animate({'left':'+=594px'});
          }
     }
     
  


	
});


