var chatWidgetGroupChatView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/layout/chat/chatWindow/template/chatGroupWidget.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
    
    initialize: function() {
        this.on('change', this.model, this.render);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.setEvents();
    	this.getHistory();
        return this;
    },
    
    setEvents: function(){
    	var that = this;
    	this.$el.find('.chatbox .tools span.chatCollapse').click(this,this.expandCollapseWidget);
    	this.$el.find('.chatbox .tools span.remove').click(this,this.closeWidget);
    	this.$el.find('.chatbox .tools span.chat-people-collapse').click(this,this.showPeople);
    	this.$el.find('.chat-form .btn').click(function(e){
			e.preventDefault();
			that.sendMessage(that.$el.find('.chat-form input').val(),that.$el.find('.chat-list-wdgt'),that.$el.find('.scroller'));
			that.$el.find('.chat-form input').val("");
		});
		
    	this.$el.find('.chat-form input').keypress(function (e) {
			if (e.which == 13) {
				that.sendMessage(that.$el.find('.chat-form input').val(),that.$el.find('.chat-list-wdgt'),that.$el.find('.scroller'));
				that.$el.find('.chat-form input').val("");
				return false;
			}
		});
    	
    	var view = new chatContactListView({model:this.model, panelView:this.panelView});
    	this.$el.find(".box-body").append(view.render().$el);
    	view.setStatusColor();
    },
    
    setScroll: function(){
    	this.$el.find(".scroller").niceScroll({
	    	horizrailenabled: false, 
	    	fixed:false, 
	    	styler:"fb",
	    	cursorcolor:"#A1B2BD", 
	    	cursorborderradius: '10px', 
	    	cursoropacitymin: 0.8, 
	    	cursorborder: '0', 
	    	background: '#cedbec', 
	    	spacebarenabled:false,  
	    	zindex: '1000', 
	    	autohidemode: true
	    });
    },
		
    expandCollapseWidget: function(e) {
        var el = $(this).parents(".chatbox").children(".box-body");
        el.slideToggle(200);
        var el = $(this).parents(".chatbox").find(".chat-people-collapse");
        el.slideToggle(200);

    	$(this).parents(".chatbox").find(".chat-content").show();
        $(this).parents(".chatbox").find(".contact-content").hide();
        
	},
	
	closeWidget: function(e) {
		chat.closeChat(e.data.model.id);
	},
	
	showPeople: function(e) {
	    $(this).parents(".chatbox").find(".chat-content").hide();
        $(this).parents(".chatbox").find(".contact-content").show();
    },
	
	sendMessage: function(text,chatListWdgt,scrollDiv){
        if (text.length == 0) {
            return;
        }
        
        text = this.safe_text(text);
        
		var curr_time = moment().format('YYYY-MM-DD HH:mm:ss');
		
		var data = {message:text, curr_time:curr_time, urlUserPic:sessionUser.get("imgURI")};
		var msg = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatWindow/template/chatMessageRight.ejs'}).render(data));
		
		chatListWdgt.append(msg);
		
		$("abbr.timeago").timeago();
		scrollDiv.getNiceScroll().resize();
		scrollDiv.getNiceScroll(0).doScrollTop(chatListWdgt.height(), 0);

		var userLabel = sessionUser.get("name") + " " + sessionUser.get("lastname") + "_" + sessionUser.get("id");
        var user = {name:sessionUser.get("name"), lastname:sessionUser.get("lastname"), id:sessionUser.get("id"), username:sessionUser.get("username")};
		realtime.publishChannel("Chat_" + this.model.id, {user: userLabel, userObj: user, message: {text:text, time:curr_time}});
	},
	
	// prevent XSS attacks
	safe_text: function(text) {
	    return (''+text).replace( /[<>]/g, '' );
	},
	
	getHistory: function(){
		var that = this;
		realtime.instance.history({
		    channel: that.model.get("channel"),
		    callback: function(m){
		    	that.putMessages(m[0],that.model.get("channel"));
		    }
		 }); 
	},
	
	putMessages: function(message, channel){
		var that = this;
		_.each(message,function(item,i){
			var contentMessage;
			var urlProfilePic = "https://s3-us-west-1.amazonaws.com/blapp-users/" + item.userObj.username + "/user/avatar.png"
    		var data = {user:item.userObj.name, message:item.message.text, curr_time:item.message.time, urlUserPic:urlProfilePic};
    		if(sessionUser.get("id") != item.userObj.id){
    			contentMessage = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatWindow/template/chatMessageLeft.ejs'}).render(data));
    		}else{
    			contentMessage = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatWindow/template/chatMessageRight.ejs'}).render(data));
    		}
			that.$el.find('.chat-list-wdgt').append(contentMessage);
    	});
		this.$el.find('.scroller').getNiceScroll().resize();
		this.$el.find('.scroller').getNiceScroll(0).doScrollTop(this.$el.find('.chat-list-wdgt').height(), 0);
		$("abbr.timeago").timeago();
	}

});