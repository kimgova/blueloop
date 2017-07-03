var chatCategoryView = Backbone.View.extend({
    
    template: '/blueloop/static/js/layout/newUIChat/template/chatCategoryViewTemplate.ejs',
    
    initialize: function(collection, type){
    	this.chatsCollection = collection;
    	this.chatsCollection.bind("add remove", this.emptyCollection, this);
    	this.type = type;
    },
  
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.$el.find('h4').html(this.type + " Chats");
    	this.chatsCollection.each(this.appendChatView, this);
    	
        return this;
    },
    
    addChatModel: function(model) {
	       this.chatsCollection.add(model);
	       this.appendChatView(model);
    },
    
    appendChatView: function(model) {
	       var modelView = new groupChatView( {model: model} );
	       this.$el.find('#chat-container').append(modelView.render().$el);
	       this.$el.removeClass('empty-category');
	},
	
	emptyCollection: function(){
		var len = this.chatsCollection.length;
		if(len == 0){
			this.$el.addClass('empty-category');
		}
	},
	
	removeChat : function(chatId){
		this.chatsCollection.find(function(model) {
			if(model && (model.get('id') == chatId)){
				this.chatsCollection.remove(model);
			}; 
        }, this);
	},
	
	refreshName : function(chatId, name){
		this.chatsCollection.find(function(model) {
			if(model.get('id') == chatId){
				model.set("chatName", name); 
			}; 
		});
	}
});