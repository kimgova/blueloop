var notificationsPanelView = Backbone.View.extend({
	
	template: '/blueloop/static/js/layout/notificationsPanel/template/notificationsPanelTemplate.ejs',
	el : $('#notif-panel-container'),
	
	initialize: function (){
		_.bindAll(this, 'render', 'closePanel');
		this.count = 0;
		this.render();	
	},
	  
	render: function() {
		var panel = $(new EJS({url: this.template }).render());
		panel = this.setNotifications(panel);
		headView.updateAlertsCount(this.count);
	    this.$el.append(panel);
	    this.$el.find('#close-panel').click(this,this.closePanel);
	      
		return this;
	},
	    
	openNotifPanel : function(){
		this.$el.find('#notif-panel').addClass('is-visible');
	},
	  
	closePanel: function(e){
		e.preventDefault();
		this.$el.find('#notif-panel').removeClass('is-visible');
	},
	
	setNotifications: function(panel){
		var alertList = this.getUserNotifications();
		this.collection = new notificationCollection([]);
		_.each(alertList.alerts,function(item,i){
			var notification = new notificationModel({
                id:item.id,
                description: item.description,
                name: item.name,
                date:item.createDate,
                type:"loop"
            });
			var notifView = new notificationView({model:notification,panelView:this});
			panel.find("ul").append(notifView.render().$el);
            this.collection.push(notification);
        },this);
		_.each(alertList.conRequests,function(item,i){
			var notification = new notificationModel({
                id:item.id,
                description: item.senderName + " " + item.description,
                name: item.name,
                date:item.createDate,
                type:"user",
                senderId:item.senderId,
                senderName:item.senderName
            });
			var notifView = new notificationView({model:notification,panelView:this});
			panel.find("ul").append(notifView.render().$el);
            this.collection.push(notification);
        },this);
		_.each(alertList.bbAlerts,function(item,i){
			var notification = new notificationModel({
                id:item.id,
                description: item.description,
                name: item.name,
                date:item.createDate,
                type:"bb"
            });
			var notifView = new notificationView({model:notification,panelView:this});
			panel.find("ul").append(notifView.render().$el);
            this.collection.push(notification);
        },this);
		_.each(alertList.fcAlerts,function(item,i){
			var notification = new notificationModel({
                id:item.id,
                description: item.description,
                name: item.name,
                date:item.createDate,
                type:"fc"
            });
			var notifView = new notificationView({model:notification,panelView:this});
			panel.find("ul").append(notifView.render().$el);
            this.collection.push(notification);
        },this);
		this.count = this.collection.length;
		return panel;
	},
	  
	getUserNotifications: function(){
		  var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/user/getUserNotifications/',
		        data: new Object(),
		        contentType: "text/json",
		        dataType: "json",
		        async: false, //was true
		        success: function(data) {
		        	data = data;
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	}
		    });
		  return dataReturned.responseJSON;
	  },
	
	addUserAlert: function(m){
		var notification = new notificationModel({
            id:m.userAlert,
            description: m.user2Name + " " + m.alert.description,
            name: m.alert.name,
            date:m.alert.date,
            type:"user",
            senderId:m.user2,
            senderName:m.user2Name
        });
		var notifView = new notificationView({model:notification,panelView:this});
		this.$el.find("ul").append(notifView.render().$el);
        this.collection.push(notification);
        headView.updateAlertsCount(this.collection.length);
	},
	
	addLoopAlert: function(m){
		var notification = new notificationModel({
            id:m.userAlert,
            description: m.alert.description,
            name: m.alert.name,
            date:m.alert.date,
            type:"loop"
        });
		var notifView = new notificationView({model:notification,panelView:this});
		this.$el.find("ul").append(notifView.render().$el);
        this.collection.push(notification);
        headView.updateAlertsCount(this.collection.length);
	},
	
	addBBAlert: function(m){
		var notification = new notificationModel({
            id:m.userAlertId[1],
            description: m.alert.description,
            name: m.alert.name,
            date:m.alert.date,
            type:"bb"
        });
		var notifView = new notificationView({model:notification,panelView:this});
		this.$el.find("ul").append(notifView.render().$el);
        this.collection.push(notification);
        headView.updateAlertsCount(this.collection.length);
	},
	
	addFCAlert: function(m){		
		var notification = new notificationModel({
            id:m.userAlertId,
            description: m.alert.description,
            name: m.alert.name,
            date:m.alert.date,
            type:"fc"
        });
		var notifView = new notificationView({model:notification,panelView:this});
		this.$el.find("ul").append(notifView.render().$el);
        this.collection.push(notification);
        headView.updateAlertsCount(this.collection.length);
	},
	
	//Function to delete BBConnectionRequest
	cancelBBConnectionRequest: function(m){	
		console.log(m);
	},
	
	//Function to delete ConnectionRequest
	cancelConnectionRequest: function(m){					  						  
		console.log(m);
	}

});

$().ready(function() {
	window.notifPanelView = new notificationsPanelView();
});