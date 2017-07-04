var groupChatView = Backbone.View.extend({
    
    template: '/blueloop/static/js/layout/newUIChat/template/groupChatViewTemplate.ejs',
    
    initialize: function(){
    	 _.bindAll(this, 'render', 'open','editChat', 'deleteChat', 'subscribeGroupChannel', 'refreshCount', 'refreshName'); 
    	 this.model.bind("change:channel", this.subscribeGroupChannel);
    	 this.model.bind("change:count", this.refreshCount);
    	 this.model.bind("change:chatName", this.refreshName);
    	 this.listenTo(this.model, 'remove', this.remove);
    	 
         this.subscribeGroupChannel();

    },
  
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find('#chat-name').click(this,this.open);
    	this.$el.find('#edit-chat').click(this,this.editChat);
    	this.$el.find('#delete-chat').click(this,this.deleteChat);
        return this;
    },
    
    remove: function()
    {
      this.$el.remove();
    },
    
    open : function(e){
    	e.preventDefault();
    	chat.agregarGroupChat(e.data);
    	this.model.set({count: 0}); 
    	chatView.unreadMessagesCount();
    	
    },
    
    editChat : function(){
    	chat.editChat(this.model);
    },
    
    deleteChat : function(){
    	var chatId   = this.model.attributes.id;
    	var chatName = this.model.attributes.chatName;
    	var chatType = this.model.attributes.type;
    	chat.deleteChat(chatId, chatName, chatType);
    },
    
    refreshCount : function(){
    	if(this.model.attributes.count==0){
    		this.$el.find('#chat-msg-count').css("visibility", "hidden");
    		this.$el.find('#chat-name').css("font-weight","100");
    	}else{
    		this.$el.find('#chat-msg-count').css("visibility", "visible");
    		this.$el.find('#chat-msg-count').text(this.model.attributes.count);
    		this.$el.find('#chat-name').css("font-weight","600");
    	}
    },
    
    refreshName : function(){
        var name = this.model.get("chatName");
        if (name.length > 13) {
            name = name.substr(0, 15) + "...";
        } 
    	this.$el.find('#chat-name').text(this.model.get("chatName"));
    	$("#" + this.model.get("id") + ".chat-widget").find('.title-h4 span').text(name);
    },
        
    subscribeGroupChannel : function(){	
			var channel = this.model.attributes.channel;
			var type    = this.model.attributes.type;
			var id      = this.model.attributes.id;
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


    
});