var bbMainView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/bbGrid/template/bbMainViewTemplate.ejs',
    
    initialize: function (){

        this.render();
        
        this.gridTopbar = new bbGridTopbarView();
        this.renderGridTopbar();

        window.bbGrid = new bbGridView({creationPermission:this.creationPermission});
        this.renderBBGrid();
        
        window.bbPanel = new bbPanelElementView({creationPermission:this.creationPermission});
        this.renderBBPanel();
    },
    
    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        $('#grid-section').append(this.$el);
        this.getCreationPermission();
        return this;
    },
    
    renderGridTopbar : function(){
        this.$el.find('#bb-grid-topbar').append(this.gridTopbar.render().$el);
    },
    
    renderBBGrid: function() {
       this.$el.find('#bb-grid-container').append(bbGrid.render().$el);
    },
    
    
    renderBBPanel: function() {
        this.$el.find('#bb-panel-container').append(bbPanel.render().$el);
     },
     
    getCreationPermission:function(){
        var data = ajaxCall('GET', '/blueloop/user/verifyBBCreationPermission/', {}, "text/json", "json", false);
        this.creationPermission = data.permission 
    }
});

$().ready(function() {
    window.bbView = new bbMainView();
});