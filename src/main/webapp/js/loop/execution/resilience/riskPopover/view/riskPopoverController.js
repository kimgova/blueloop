var riskPopoverController = {
	
	popovers: new PopoverCollection([]),
	
	templateSVGContainer : '/blueloop-backend/static/js/loop/execution/resilience/riskPopover/template/SVGContainerTemplate.ejs',

    createRiskPopoverContainer: function(id, cellview){   
    	$("svg#bbRiskAlert"+ id).remove();	
    	var container = new EJS({url: this.templateSVGContainer}).render({id:id}); 
		cellview.append(container);
		
		var data = FormController.formPool[id];
		var idBB = data.data[4].id;
		
		var popover = new PopoverModel({id:id, container:$("svg#bbRiskAlert"+ id), idBB:idBB});
		this.popovers.push(popover);		
		
		if(data.activeRiskCount > 0){
			this.setPopover(id,data.activeRiskCount,$("svg#bbRiskAlert"+ id));
		}		
		
		this.setCellviewPopover(id,cellview);
		this.setEvents();
    },
    
    setPopover: function(id,totalRisks,svg) {
		var riskBadge = new riskBadgeView({id:id, totalRisks:totalRisks}); 
		$("div#bbRiskAlert"+ id).html(riskBadge.render().$el);	 
		riskBadge.initPopover();
		$(svg).show(800);
		
		var popover = this.popovers.findWhere({id:id});
		popover.set("badge",riskBadge)
	}, 
	
	setCellviewPopover: function(id,cellview) {
		var cellviewPopover = new cellviewPopoverView({id:id, cellview:cellview}); 
		cellviewPopover.render();
		var popover = this.popovers.findWhere({id:id});
		popover.set("cellviewPopover",cellviewPopover)
	}, 
	
	increaseRiskCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			var that = this;
			this.increase(popover);			
			var othersOfSameBB = this.popovers.where({idBB:popover.get("idBB")});
			$.each(othersOfSameBB, function(i, otherPopover){
				if(otherPopover.get("id") != id)
					that.increase(otherPopover);
			});
			
		}
	},
	
	increase: function(popover){
		if(popover.get("badge") == ""){
			this.setPopover(popover.get("id"),1,popover.get("container"));
			FormController.formPool[popover.get("id")].activeRiskCount = 1;
		}else{
			var currentTotalRisks = popover.get("badge").$el.html().trim();
			var newTotalRisks = parseInt(currentTotalRisks)+1;
			popover.get("badge").$el.html(newTotalRisks);
			FormController.formPool[popover.get("id")].activeRiskCount = newTotalRisks;
		}
	},
	
	decreaseRiskCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			var that = this;
			this.decrease(popover);
			var othersOfSameBB = this.popovers.where({idBB:popover.get("idBB")});
			$.each(othersOfSameBB, function(i, otherPopover){
				if(otherPopover.get("id") != id)
					that.decrease(otherPopover);
			});
			
		}
	},
	
	decrease: function(popover){
		if(popover.get("badge") != ""){
			var currentTotalRisks = popover.get("badge").$el.html().trim();
			var newTotalRisks = parseInt(currentTotalRisks)-1;
			popover.get("badge").$el.html(newTotalRisks);
			if(newTotalRisks == 0){
				popover.get("badge").$el.remove();
				popover.set("badge","");
			}
			FormController.formPool[popover.get("id")].activeRiskCount = newTotalRisks;
		}
	},
	
	updateRiskStateButton: function(bbRiskStatus,bbRiskId) {
		if(bbRiskStatus == '1') {
			$("button.riskstate"+bbRiskId).text("Deactivate risk");
		}else{
			$("button.riskstate"+bbRiskId).text("Activate risk");					
		}
	},
	
	setEvents: function() {
		var that = this;
		$(document).scroll(function(e){	
			that.popovers.each(function(popover) {
        		var popoverView = popover.get("cellviewPopover");
        		popoverView.hidePopup();
    		}, that)
    	});
	},
}