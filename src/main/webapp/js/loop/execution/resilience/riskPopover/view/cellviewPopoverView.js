var cellviewPopoverView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/resilience/riskPopover/template/cellviewPopoverContentTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
    	this.initPopover();
        return this;
    },
    
    initPopover: function(){
    	this.popover = this.cellview.popover({
			title:json.risk.riskInfoTitle, 
			content: "No data found",
			container:"body", 
			html:"true", 
			placement:"top", 
			trigger:"click"					
		});
    	this.setEvents();
    },
    
    setEvents: function(){
    	var that = this;
    	this.popover.on('show.bs.popover', function(){
            that.updateContent(that);
        });
    	
    	this.popover.on('shown.bs.popover', function(){
            that.setEventsOfContent(that);
        });
    },
    
    updateContent: function(context){
    	var data = ajaxCall('GET', '/blueloop/chainBuildingBlock/getCBBResilienceData/', {idCBB:context.id}, "text/json", "json", false);
    	var risks = data.risks;
    	var staticImgUrl = data.staticImgUrl;
    	if(risks.length > 0){
    		var routes = data.routes;
        	var bbResposible = data.bbResposible;
        	var enabled = "disabled";
    		
        	if (sessionUser.get("id") == bbResposible.id){
    			enabled = "";
    		}			
        	
        	var content = new EJS({url: this.template}).render({risks:risks,routes:routes,enabled:enabled,idCBB:context.id,staticImgUrl:staticImgUrl})
        	context.popover.data('bs.popover').options.content = content;    
    	}    	
    },
    
    setEventsOfContent: function(that){
    	 $(".changeriskstate").off('click');
    	 $(".changeriskstate").on('click', function(e){
 	        that.changeRiskState(e);
 	    });
    	 
    	 $(".changeroutestate").off('click');
    	 $(".changeroutestate").on('click', function(e){
  	        that.changeRouteState(e);
  	    });
    	 
    	 $(".showRoute").off('click');
    	$(".showRoute").on('click', function(e){
   	        that.showRoute(e);
   	    });
    },

    changeRiskState : function(e) {
        var idRisk = $(e.target).attr("idRisk");
        var idCBB  = $(e.target).attr("idCBB");
        var object = {idRisk : idRisk,idCBB : idCBB};
        var data   = ajaxCall('GET', '/blueloop/bbRisk/changeState/', object, "text/json", "json", false);
    },
	
	changeRouteState:function(e){  
		var routeId = $(e.target).attr("idRoute");
		var jsonObject = {routeId:routeId};
		var data = ajaxCall('GET', '/blueloop/route/changeState/', jsonObject, "text/json", "json", false);
		if(data.result == true){
			if(data.routeInst.active) 
				$("button.routestate"+routeId).text("Deactivate route");
			else
				$("button.routestate"+routeId).text("Activate route");			
		}
	},
	
	showRoute: function(e) {
		var idJSONRoute = $(e.target).attr("idJSONRoute");
		window.DIAGRAM_FACADE.altRoutController.showAltRoute(idJSONRoute);
	},
	
    showPopup:function (){
    	this.popover.popover("show");
	},
	
	hidePopup:function (){
		this.popover.popover("hide");
	},
});