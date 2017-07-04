var userNavBarView = Backbone.View.extend({
    
	template: '/blueloop/static/js/layout/header/template/userNavBarTemplate.ejs',

    initialize: function(){
        _.bindAll(this, 'render', 'openNotifications', 'closeNotifications', 'openChat'); 
      
    },
    
    render: function() {
    	this.model = new userNavBarModel({
           id:       sessionUser.get("id"),
  		   name:     sessionUser.get("name"),
  		   lastname: sessionUser.get("lastname"),
  		   image:    sessionUser.get("imgURI"),
  		   role:     sessionUser.get("role")
    	});

    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find("#notif-bell").click(this,this.openNotifications);
    	$(".cd-panel-close").click(this,this.closeNotifications);
    	this.$el.find("#tab-chat").click(this,this.openChat);
    	this.$el.find('#logout').click(this, this.logout);
    	this.$el.find("#user-status-dropdown a").click(this, this.changeUserStatus);
    	
        return this;
    },
    
    openNotifications: function(e){
        e.preventDefault();
        $('#notif-panel').addClass('is-visible');
    },
    
    closeNotifications: function(e){
        e.preventDefault();
        $('#notif-panel').removeClass('is-visible');
    },
    
    openChat: function(e){
    	e.preventDefault();
    	chatView.openChatPanel();
    },
    
    changeUserStatus: function(e){
    	var selected =  $(e.target).attr("id");
    	 switch(selected) {
		 case "online":
			 realtime.setUuidState(sessionUser.get("pubnubChannel"), {"id":e.data.model.get("id"),"status":"Online"}); 
			 break;
		 case "busy":
			 realtime.setUuidState(sessionUser.get("pubnubChannel"), {"id":e.data.model.get("id"),"status":"Busy"});
			 break;
		 case "away":
			 realtime.setUuidState(sessionUser.get("pubnubChannel"), {"id":e.data.model.get("id"),"status":"Away"});
			 break;
		 }
    },
    
    logout : function(){
    	
    }
});