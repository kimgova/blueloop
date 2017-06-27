var fileModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/file/template/fileModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.setTable();
		this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	
    },
    
    setTable: function(){
        this.tableView = new fileTableView({idBB:this.idBB});
        this.$el.find("#file-content").html(this.tableView.render().$el);
     }

});