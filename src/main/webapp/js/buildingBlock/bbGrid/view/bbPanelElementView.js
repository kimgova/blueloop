var bbPanelElementView = Backbone.View.extend({
    
    defaultTemplate: '/blueloop/static/js/buildingBlock/bbGrid/template/bbPanelElementDefaultViewTemplate.ejs',
    infoTemplate: '/blueloop/static/js/buildingBlock/bbGrid/template/bbPanelElementInfoViewTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
    
    initialize: function (){
    	 _.bindAll(this, 'render'); 
		this.render();
	},
    
    render: function() {
    	this.$el = $(new EJS({url: this.defaultTemplate }).render({creationPermission:this.creationPermission}));//render(this.model.toJSON()));   	
        return this;
    },
    
    refresh: function(model){
    	this.model = model;
    	this.$el.empty();
    	this.info = $(new EJS({url: this.infoTemplate }).render({model:model.toJSON(),creationPermission:this.creationPermission}));
    	this.$el.append(this.info);
    	//this.$el.find('#bb-btn').click(this, this.goToWorkspace);
    }
    
});