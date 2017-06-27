var notificationView = Backbone.View.extend({
	
	 template: '/blueloop-backend/static/js/layout/notificationsPanel/template/notificationTemplate.ejs',
	 
	 constructor : function (options) {
		 _.extend(this, options);
	 },
	  
	  render: function() {
		  this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		  this.setEvents();
		  return this;
	  },
	  
	  setEvents: function(){
	        this.$el.find(".go-btn").click(this,this.changeAlert);
	        this.$el.find(".close-btn").click(this,this.dismissAlert);
	    },
	  
	  //Delete from collection and redirect
	  changeAlert: function(e) {
		var obj = new Object();
		obj.idUserAlert = e.data.model.id;

		switch (e.data.model.get("type")) {
	  	  case "loop":
	  		var result = ajaxCall('GET', '/blueloop-backend/user/changeNotificationAlertState/', obj, "text/json", "json", false);	
	  		window.location.replace("/blueloop-backend/chain/list");
	  	  break;
	  	  case "user": 
	  		  if(e.data.model.get("description").indexOf("Sent you a connection request") != -1){
	  			obj.userContactId = e.data.model.get("senderId");
	  			var result = ajaxCall('GET', '/blueloop-backend/user/confirmConnectionRequest/', obj, "text/json", "json", false);	
	  		  }else{
	  			var result = ajaxCall('GET', '/blueloop-backend/user/changeNotificationAlertState/', obj, "text/json", "json", false);	
	  		  }
	  		window.location.replace("/blueloop-backend/search/people");
	      break;
	  	  case "bb": 
	  		var result = ajaxCall('GET', '/blueloop-backend/user/changeNotificationAlertState/', obj, "text/json", "json", false);	
			window.location.replace("/blueloop-backend/buildingBlock/list");
	  	  break;
	  	  case "fc":
	  		var result = ajaxCall('GET', '/blueloop-backend/user/changeNotificationAlertState/', obj, "text/json", "json", false);	
			window.location.replace("/blueloop-backend/chain/list");      
	  	  break;
	  	}
	  },
	  
	  dismissAlert: function(e){
		    var jsonObjectUA = new Object();
		    jsonObjectUA.idUserAlert = e.data.model.id;
			
			$.ajax({
		        type: 'GET',
		        url: '/blueloop-backend/user/changeNotificationAlertState/',
		        data: jsonObjectUA,
		        contentType: "text/json",
		        dataType: "json",
		        async: false,
		        success: function(data) {
		           console.log(data)
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	}
		    });
			
			e.data.panelView.collection.remove(e.data.panelView.collection.findWhere({id:e.data.model.id}));
			headView.updateAlertsCount(e.data.panelView.collection.length);
			e.data.$el.slideUp( "slow", function() {
				e.data.remove();
			});
			
		}
	 
});