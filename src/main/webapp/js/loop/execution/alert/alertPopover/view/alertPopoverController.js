var alertPopoverController = {
	
	popovers: new PopoverCollection([]),
	
	templateSVGContainer : '/blueloop/static/js/loop/execution/alert/alertPopover/template/SVGContainerTemplate.ejs',
		
    createAlertPopoverContainer: function(id, cellview){   
    	$("svg#bbGeneralAlert"+ id).remove();	
    	var container = new EJS({url: this.templateSVGContainer}).render({id:id}); 
		cellview.append(container);
		
		var popover = new PopoverModel({id:id, container:$("svg#bbGeneralAlert"+ id)});
		this.popovers.push(popover);		
		
		var data = FormController.formPool[id];
		if(data.cbbAlertsCount > 0){
			this.setPopover(id,data.cbbAlertsCount,$("svg#bbGeneralAlert"+ id));
		}
    },
    
    setPopover: function(id,totalAlerts,svg) {
		var alertBadge = new alertBadgeView({id:id, totalAlerts:totalAlerts}); 
		$("div#bbGeneralAlert"+ id).html(alertBadge.render().$el);	 
		alertBadge.initPopover();
		$(svg).show(800);
		
		var popover = this.popovers.findWhere({id:id});
		popover.set("badge",alertBadge)
	}, 

	increaseAlertCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			if(popover.get("badge") == ""){
				this.setPopover(id,1,popover.get("container"));
			}else{
				var currentTotalAlerts = popover.get("badge").$el.find(".alertCounter").html().trim();
				var newTotalAlerts = parseInt(currentTotalAlerts)+1;
				popover.get("badge").$el.find(".alertCounter").html(newTotalAlerts);
			}
		}
	},
	
	decreaseAlertCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			if(popover.get("badge") != ""){
				var currentTotalAlerts = popover.get("badge").$el.find(".alertCounter").html().trim();
				var newTotalAlerts = parseInt(currentTotalAlerts)-1;
				popover.get("badge").$el.find(".alertCounter").html(newTotalAlerts);
				if(newTotalAlerts == 0){
					popover.get("badge").$el.remove();
					popover.set("badge","");
				}
			}
		}
	},
}