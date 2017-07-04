var alertModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/alert/main/template/alertModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() { 	
    	this.getAlerts();
    	this.$el = $(new EJS({url: this.template }).render({isResponsible:this.isResponsible}));
    	this.setTable();
		this.setEvents();
        return this;
    },
    
    getAlerts: function() {
    	this.collection = new alertCollection([]);
    	var result = ajaxCall('GET', '/blueloop/chainBuildingBlockAlert/getCBBAlerts/', {jsonId:this.cbbJsonId}, "text/json", "json", false);
    	this.idCBB = result.idcbb;
    	
    	this.disabled = "";
    	this.isResponsible = true;
    	if(result.responsible == false){
    		this.disabled = "disabled";
    		this.isResponsible = false;
    	}
    	
    	_.each(result.cbbAlerts,function(item,i){
    		var alert = new alertModel({
    			id:item.id,
    			title: item.name,
    			description: item.description,
    			disabled:this.disabled
    		});
    		this.collection.push(alert);
	    },this); 
    },
    
    setEvents: function(){
        this.$el.find("#newCBBAlert").click(this,this.newAlertRow);
    },
    
    newAlertRow: function(e) {
    	var newRowView = new alertNewRowView( { tableView:e.data, idCBB:e.data.idCBB, disabled: e.data.disabled} );
        e.data.$el.find('#alert-table tbody').prepend(newRowView.render().$el);
    },    
    
    setTable: function(){
    	var tableView = new alertTableView({idCBB:this.idCBB, collection:this.collection, tableView:this});
		this.$el.find("#alert-content").html(tableView.render().$el);
		this.datatable = tableView.datatable;
    },
});