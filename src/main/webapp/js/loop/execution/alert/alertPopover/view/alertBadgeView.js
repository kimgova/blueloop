var alertBadgeView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/execution/alert/alertPopover/template/badgeTemplate.ejs',
	templatePopoverContent: '/blueloop-backend/static/js/loop/execution/alert/alertPopover/template/popoverContentTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el =  $(new EJS({url: this.template}).render({id:this.id,totalAlerts:this.totalAlerts}));;
        return this;
    },
    
    initPopover: function(){
    	this.popover = $('div#bbGeneralAlert'+ this.id).popover({
			title:json.execution.generalAlerts, 
			content: "",
			container:"body", 
			html:"true", 
			placement:"top", 
			trigger:"hover"
		});	
    	this.setEvents();
    },
    
    setEvents: function(){
    	var that = this;
    	this.popover.on('show.bs.popover', function(){
            that.updateContent(that);
        });
    },
    
    updateContent: function(e){
    	var data = ajaxCall('GET', '/blueloop-backend/chainBuildingBlockAlert/getCBBAlerts/', {jsonId:e.id}, "text/json", "json", false);
    	var content = new EJS({url: this.templatePopoverContent}).render({dataAlerts:data.cbbAlerts})
    	e.popover.data('bs.popover').options.content = content;    
    },
});