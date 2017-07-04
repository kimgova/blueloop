var peopleElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/people/template/peopleElementViewTemplate.ejs',
    
    initialize: function(){
    	 _.bindAll(this, 'render', 'clicked','clickedBtn2', 'showOptions', 'hideOptions', 'changeColor'); 
    	 this.model.bind("change:status", this.changeColor);
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
  
    render: function() {
    	this.getStatus(this.model);
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	
    	var options = this.$el.find('#user-options')
    	options.click(this, this.showOptions);
    	
    	var unfollow = this.$el.find('#user-unfollow');
        unfollow.mouseleave(this, this.hideOptions);
    	unfollow.click(this, this.clicked);
    	
    	var statusIcon = this.$el.find('#people-status-icon');
    	
    	var btn = this.$el.find('#mark-transition .btn:not(.btn2)');
    	btn.click(this,this.clicked);
    	
    	var btn2 = this.$el.find('#mark-transition .btn2');
    	btn2.click(this, this.clickedBtn2);
    	
    	model = this.model.attributes;
    	if(model.connection == false && model.request == false){
    		options.css('display','none'); 
    		unfollow.css('display','none');
    		statusIcon.css('display','none');
    		btn.text('Send Request');
    		btn.attr('href','#');
    	}  
    	if(model.connection == false && model.connectionSended == true){
    		options.css('display','none');
    		unfollow.css('display','none');
    		statusIcon.css('display','block');
    		statusIcon.find("i").addClass("fa fa-question");
    		btn.text('Cancel Request');
    		btn.attr('href','#');
    	} 
    	if(model.connection == false && model.connectionReceived == true){
    		options.css('display','none');
    		unfollow.css('display','none');
    		statusIcon.css('display','block');
    		statusIcon.css('background-color','#4eafe4');
    		statusIcon.find("i").addClass("fa fa-plus");
    		
    		btn.text('Accept');
    		btn.attr('href','#');
    		btn.css('width','90px');
    		
    		btn2.css('display','inline');
    		btn2.css('width','90px');
    		btn2.css('float','right');
    		btn2.css('margin-right','30px');
    		btn2.text('Deny');
    		btn2.attr('href','#');
    	}
    	
        this.changeColor();
        return this;
    },
    
    changeColor : function(){
    	if(this.model.attributes.connection == true ){
	    	var status = this.$el.find('#people-status-icon');
	    	if(this.model.attributes.status == "Away"){
	    		status.css("background-color", "#F5A623");
	    	}else if(this.model.attributes.status == "Online"){
	    		status.css("background-color", "#7ED321");
	    	}else if(this.model.attributes.status == "Busy"){
	    		status.css("background-color", "#FF001F");
	    	}else if(this.model.attributes.status == "Default"){
	    		status.css("background-color", "#D5D5D5");
	    	}
    	}
    },
    
    showOptions: function(e){
    	this.$el.find('#user-options').css('top', '-17px');
    	this.$el.find('#user-unfollow').css('top', '11px');
    },
    
    hideOptions: function(e){
    	this.$el.find('#user-options').css('top', '7px');
    	this.$el.find('#user-unfollow').css('top', '-17px');
    },
    
    clicked: function(e){
    	//e.preventDefault();
    	if( $(e.target).text() != "View Profile"){
    		if( $(e.target).text() == "Accept"){
    			this.clickedBtn2(e);	
    		}else{
	    		var model = this.model.attributes;
	        	var contactId = model.id;
	        	var connStatus = model.connection;
	        	var requestStatus = model.request;
	        	
	            this.modifyConnStatus(contactId, connStatus, requestStatus);
    		}
    	}    	
    },
    
    clickedBtn2: function(e){
    	if( $(e.target).hasClass("btn2") ){
    		var that = this;
    		var jsonObject = new Object()
    		jsonObject.id = this.model.attributes.id;
    		var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/refuseRequest/',
		        data: jsonObject,
		        contentType: 'text/json',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
					toastr.success("Connection Denied");
					that.$el.remove();
					setTimeout(function(){window.location.replace("/blueloop/search/people")}, 500);
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
    		    	
    	} else{
    		var that = this;
    		var jsonObject = new Object()
    		jsonObject.userContactId = this.model.attributes.id;
    		var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/confirmConnectionRequest/',
		        data: jsonObject,
		        contentType: 'text/json',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
					toastr.success("Connection Request Accepted");
					that.sendApprovedConnectionNotification(data);
					that.$el.remove();
					setTimeout(function(){window.location.replace("/blueloop/search/people")}, 500);
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });   		
    	}   	
    },
    
    //This is a modification of the same function in profile.js
    modifyConnStatus : function (contactId, connStatus, requestStatus){	
		var jsonObject		  = new Object()
		jsonObject.userConnId = contactId;
		var conntatus = connStatus;
		var requestStatus = requestStatus;
		
		var btn = this.$el.find('#mark-transition .btn');
		
		if(connStatus == false && requestStatus == false){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/connetUsers/',
		        data: jsonObject,
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        	toastr.success("Connection Request Sent");
		        	setTimeout(function(){window.location.replace("/blueloop/search/people")}, 500);
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });

		}else if(connStatus == false && requestStatus == true){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/cancelUserRequest/',
		        data: jsonObject,
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
					toastr.success("Connection Request Cancelled");
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
			this.sendCancelConnectionNotification(dataReturned.responseJSON);
			setTimeout(function(){window.location.replace("/blueloop/search/people")}, 500);
			
		}else if(connStatus == true){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/disConnetUsers/',
		        data: jsonObject,
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
					toastr.success("Connection Removed");
					setTimeout(function(){window.location.replace("/blueloop/search/people")}, 500);
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
		}
		
	},
	
	sendCancelConnectionNotification : function (data){
		realtime.publishChannel(sessionUser.get("pubnubChannel"), 
				{type:		"CancelConnectionRequest",
				 user:		data.userAlert.receiver.id,
				 user2:		data.userAlert.sender.id,
				 userAlert: data.userAlert.id
				}); 
	},
	
	sendApprovedConnectionNotification : function (data){
		realtime.publishChannel(sessionUser.get("pubnubChannel"), 
				{type:		"ConnectionApproved",
				 user:		data.userReceiver.id,
				 userName:	data.userReceiver.name,
				 user2:		data.userSender.id,
				 user2Name:	data.userSender.name,
				 alert:		{date:		  data.createDate,
					 		 description: data.alert.description,
					 		 id: 		  data.alert.id,
					 		 name: 		  data.alert.name					 
				 			},
				 userAlertId: data.userAlert.id
				}); 
	},
	
	getStatus : function(model){
		var item = model.attributes;
		var uid = item.firstName + " " + item.lastName + "_" + item.id;
		realtime.instance.state({
			  channel  : sessionUser.get("pubnubChannel"),
			  uuid     : uid,
			  callback : function(m){
				  model.set({status: m.status}); 
			  },
			  error    : function(m){console.log(m)}
		});
	}
    
});