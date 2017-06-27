var riskBadgeView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/execution/resilience/riskPopover/template/badgeTemplate.ejs',
	templatePopoverContent: '/blueloop-backend/static/js/loop/execution/resilience/riskPopover/template/popoverContentTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el =  $(new EJS({url: this.template}).render({id:this.id,totalRisks:this.totalRisks}));;
        return this;
    },
    
    initPopover: function(){
    	this.popover = $('div#bbRiskAlert'+ this.id).popover({
			title:json.risk.riskAlertsTitle, 
			content: "",
			container:"body", 
			html:"true", 
			placement:"left", 
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
    	var risks = ajaxCall('GET', '/blueloop-backend/chainBuildingBlock/getBBRisksByCBB/', {idCBB:e.id}, "text/json", "json", false);
    	var content = new EJS({url: this.templatePopoverContent}).render({dataRisks:risks,status:" Active"})
    	e.popover.data('bs.popover').options.content = content;    
    },
});