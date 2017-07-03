var collaborativeFilterView = Backbone.View.extend({
	
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabAdjmtFilter.ejs',
    filterType: 2,
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function() {
    	this.viewItems = [];
    	this.canSave = true;
    	var that = this;
    	this.$el = $(new EJS({url: this.template }).render());
    	fcstCollabFilterCollection.getInstance({}).sort().each(this.addModel, this);  	
    	this.$el.find('#sortable').sortable({
            update: function(ev, ui){
               that.updateList();
            }
        });
    	this.$el.find("#saveFilterOrder").click(this,this.saveFilterOrder);
    	return this;
    },
	
	addModel: function(model) {
		var rowView = new collaborativeFilterRowView({ model: model});
		this.$el.find('#sortable').append(rowView.render().$el);
		this.viewItems.push(rowView);
	},
    
    updateList: function(){
    	this.validateOrder();
    	if(this.canSave){
	    	_.each(this.viewItems, function(item){
	            item.model.set('step', item.$el.index()+1);
	    	});
    	}
    },
    
    validateOrder: function(){
    	var catIndex = 0, subCatIndex = 0;
    	_.each(this.viewItems, function(item){
    		if(item.model.id == 1){
    			catIndex = item.$el.index();
    		}else if(item.model.id == 2){
    			subCatIndex = item.$el.index();
    		}else if(item.model.id == 3){
    			roleIndex = item.$el.index();
    		}
    	});
    	if(catIndex > subCatIndex){
    		this.canSave = false;
    	}else{
    		this.filterType = roleIndex;
    	}
    },
    
    saveFilterOrder: function(e){
    	if(e.data.canSave){
    		var tableView = new collaborativeTableView({instanceId: e.data.instanceId, filterType: e.data.filterType,unit:e.data.unit,isDefault:e.data.isDefault});
    		$("#adjustmentsTable").html(tableView.render().$el);
    		tableView.initTreeGrid();
    	}else{
    		toastr.error("Error: Verify Filter Order");
    	}
    	
    }
	
});