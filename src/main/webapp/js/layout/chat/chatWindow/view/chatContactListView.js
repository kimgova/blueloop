var chatContactListView = Backbone.View.extend({
    
    template: '/blueloop/static/js/layout/chat/chatWindow/template/chatContactList.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function() {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find('.btnEditChatGroup').click(this,this.editGroup);
        this.$el.find('.btnBack').click(this,this.btnBack);
        
    },
    
    editGroup: function(e){
        chat.editChat(e.data.panelView.model,e.data.model);
    },
    
    btnBack: function(e){
        $(e.target).parents(".chatbox").find(".chat-content").show();
        $(e.target).parents(".chatbox").find(".contact-content").hide();
    },
    
    setStatusColor: function(){
        _.each(this.model.get("people"),function(obj,i){
            var userStatus = chatView.singleChatsCollection.findWhere({userId:obj.id}).get("status");
            var status = this.$el.find('i.user-id-'+ obj.id).parent();
            if(userStatus == "Away"){
                status.css("background-color", "#F5A623");
            }else if(userStatus == "Online"){
                status.css("background-color", "#7ED321");
            }else if(userStatus == "Busy"){
                status.css("background-color", "#FF001F");
            }else if(userStatus == "Default"){
                status.css("background-color", "#D5D5D5");
            }
        },this);
    }

});