var orderPopoverController = {
	
	popovers: new PopoverCollection([]),
	
	templateSVGContainer : '/blueloop-backend/static/js/loop/execution/order/orderPopover/template/SVGContainerTemplate.ejs',

    createOrderPopoverContainer: function(id, cellview){   	
    	$("svg#bbOrderAlert"+ id).remove();	
    	var container = new EJS({url: this.templateSVGContainer}).render({id:id,style:'display:none'}); 
		cellview.append(container);
		
		var popover = new PopoverModel({id:id, container:$("svg#bbOrderAlert"+ id)});
		this.popovers.push(popover);
		
		var data = FormController.formPool[id];
		if(data.orderCount > 0){
			this.setPopover(id,data.orderCount,$("svg#bbOrderAlert"+ id));
		}		
    },
    
    setPopover: function(id,totalOrders,svg) {
		var alertBadge = new orderBadgeView({id:id, totalOrders:totalOrders}); 
		$("div#bbOrderAlert"+ id).html(alertBadge.render().$el);	 
		alertBadge.initPopover();
		$(svg).show(800);
		
		var popover = this.popovers.findWhere({id:id});
		popover.set("badge",alertBadge)
	},  
	
	increaseOrderCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			if(popover.get("badge") == ""){
				this.setPopover(id,1,popover.get("container"));
			}else{
				var currentTotalOrders = popover.get("badge").$el.html().trim();
				var newTotalOrders = parseInt(currentTotalOrders)+1;
				popover.get("badge").$el.html(newTotalOrders);
			}
		}
	},
	
	decreaseOrderCounter: function(id){
		var popover = this.popovers.findWhere({id:id});
		if(popover != undefined){
			if(popover.get("badge") != ""){
				var currentTotalOrders = popover.get("badge").$el.html().trim();
				var newTotalOrders = parseInt(currentTotalOrders)-1;
				popover.get("badge").$el.html(newTotalOrders);
				if(newTotalOrders == 0){
					popover.get("badge").$el.remove();
					popover.set("badge","");
				}
			}
		}
	},
}