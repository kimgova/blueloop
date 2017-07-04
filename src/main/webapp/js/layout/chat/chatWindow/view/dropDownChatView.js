var dropDownChatView = Backbone.View.extend({
    
    template: '/blueloop/static/js/layout/chat/chatWindow/template/dropDownChat.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
    	this.setList();
    	this.$el = $(new EJS({url: this.template }).render({total:this.numberToGroup,chatList:this.simpleList,left:this.left}));
    	this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	var that = this;
    	this.$el.find('.chatGrouped').click(this,this.removeChat);
    },
    
    setList: function(){
    	this.simpleList = [];
    	_.each(this.chatList,function(item,i){
    		this.simpleList.push({id:item.id,title:item.get("title")})
    	},this);
    },
	
	removeChat: function(){
		var idChat = $(this).attr("id");
		$(this).remove();
		chat.agregarNewChat(idChat,"","");
	},
	
	addChat: function(){
		
	}

});