var singleChatView = Backbone.View.extend({
    
    template: '/blueloop/static/js/layout/newUIChat/template/singleChatViewTemplate.ejs',
    
    initialize: function(){
    	 _.bindAll(this, 'render', 'open', 'changeStatusColor', 'subscribeSingleChatChannel', 'refreshCount'); 
    	 this.model.bind("change:status", this.changeStatusColor);
    	 this.model.bind("change:channel", this.subscribeSingleChatChannel);
    	 this.model.bind("change:count", this.refreshCount);
    	 this.subscribeSingleChatChannel();
    	 
    },
  
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find('#display-name').click(this,this.open);
        return this;
    },
    
    open : function(e){
    	e.preventDefault();
    	var model = this.model.attributes;
    	chat.createChatFromPanel(model.chatId, model.userId, model.firstName, model.channel, $(this))
    	this.model.set({count: 0}); 
    	this.model.set({state: 1});
    	chatView.unreadMessagesCount();   	
    },
    
    changeStatusColor : function(){
    	var status = this.$el.find('#chat-status-icon');
    	if(this.model.attributes.status == "Away"){
    		status.css("background-color", "#F5A623");
    		$(".contact-list").find('i.user-id-'+ this.model.get("userId")).parent().css("background-color", "#F5A623");
    	}else if(this.model.attributes.status == "Online"){
    		status.css("background-color", "#7ED321");
    		$(".contact-list").find('i.user-id-'+ this.model.get("userId")).parent().css("background-color", "#7ED321");
    	}else if(this.model.attributes.status == "Busy"){
    		status.css("background-color", "#FF001F");
    		$(".contact-list").find('i.user-id-'+ this.model.get("userId")).parent().css("background-color", "#FF001F");
    	}else if(this.model.attributes.status == "Default"){
    		status.css("background-color", "#D5D5D5");
    		$(".contact-list").find('i.user-id-'+ this.model.get("userId")).parent().css("background-color", "#D5D5D5");
    	}
    },
    
    refreshCount : function(){
    	if(this.model.attributes.count==0){
    		this.$el.find('#chat-msg-count').css("visibility", "hidden");
    		this.$el.find('#display-name').css("font-weight","100");
    	}else{
    		this.$el.find('#chat-msg-count').css("visibility", "visible");
    		this.$el.find('#chat-msg-count').text(this.model.attributes.count);
    		this.$el.find('#display-name').css("font-weight","600");
    	}
    	
    },
    
    subscribeSingleChatChannel : function(){
			var channel = this.model.attributes.channel;
			var type = this.model.attributes.type;
			var id = this.model.attributes.userId;
			if(channel != ""){
				realtime.instance.subscribe({
					   channel: channel,
					   message: function(m, env, ch){
						   if(m.userObj.id != sessionUser.get("id")){
							   chatView.newMessageReceived(m, env, ch, id, type);
						   }
					   },
					   presence: function(m){
						   //console.log( "chatchannelpresence " + channel + '- '+JSON.stringify(m))
					   }
				});
			}				
	}
     
});