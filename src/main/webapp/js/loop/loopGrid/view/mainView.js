var mainView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/loopGrid/template/mainViewTemplate.ejs',
	
    initialize: function (){

		this.render();
		
		this.topbar = new topbarView({mainView: this});
		this.renderTopbar();

		this.loopGrid = new loopGridView({mainView: this});
    	this.renderLoopGrid();
    	
		this.panel = new panelView({creationPermission:this.creationPermission});
    	this.renderPanel();
	},
	
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	$('#grid-section').append(this.$el);
    	this.getCreationPermission();
        return this;
    },
    
    renderTopbar : function(){
    	this.$el.find('#loop-grid-topbar').append(this.topbar.render().$el);
    },
    
    renderLoopGrid: function() {
       this.$el.find('#loop-grid-container').append(this.loopGrid.render().$el);
    },  
    
    renderPanel: function() {
        this.$el.find('#loop-panel-container').append(this.panel.render().$el);
    },
    
    getCreationPermission:function(){
        var data = ajaxCall('GET', '/blueloop-backend/user/verifyLoopCreationPermission/', {}, "text/json", "json", false);
        this.creationPermission = data.permission 
    }

});

$().ready(function() {
	window.loopView = new mainView();
});