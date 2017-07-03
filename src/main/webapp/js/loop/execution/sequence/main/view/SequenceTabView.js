var SequenceTabView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/sequence/main/template/SequenceTab.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render());
        this.renderSeqTab(this.orderSeqId);
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#liSeqDefinition").click(this,this.renderSeqDefinitionTab);
        this.$el.find("#liSeqSkus").click(this,this.renderSeqSkusTab); 
    },
    
    renderSeqDefinitionTab: function(e){
		if(SequenceExitModel.getInstance({}).get('skuPendingChanges') || SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
			bootbox.confirm(json.sequence.sequenceConfirm, function (r) {
				if(r){
					if(SequenceExitModel.getInstance({}).get('skuPendingChanges')){
						var tabSkus = SequenceExitModel.getInstance({}).get('skuTabView'); 
						tabSkus.save(tabSkus.sequenceId,tabSkus.listSkusToSave)
					}
					if(SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
						var tabCbbs = SequenceExitModel.getInstance({}).get('cbbTabView'); 
						tabCbbs.save(tabCbbs.orderSeqId,tabCbbs.sequenceCollection)
					}
				}
				e.data.renderSeqTab(e.data.orderSeqId);
				$(e.target).tab('show') 
				SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
				SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
			});
		}else{
			e.data.renderSeqTab(e.data.orderSeqId);
			$(e.target).tab('show') 
		}		    	
    },
    
    renderSeqTab: function(orderSeqId){
        var sequencePaneView = new cbbSequenceTabView();
        sequencePaneView.orderSeqId = orderSeqId;
        this.$el.find('#seqDefinition').html(sequencePaneView.render().$el);
    },
    
    renderSeqSkusTab: function(e){
    	if(SequenceExitModel.getInstance({}).get('skuPendingChanges') || SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
			bootbox.confirm(json.sequence.sequenceConfirm, function (r) {
				if(r){
					if(SequenceExitModel.getInstance({}).get('skuPendingChanges')){
						var tabSkus = SequenceExitModel.getInstance({}).get('skuTabView'); 
						tabSkus.save(tabSkus.sequenceId,tabSkus.listSkusToSave)
					}
					if(SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
						var tabCbbs = SequenceExitModel.getInstance({}).get('cbbTabView'); 
						tabCbbs.save(tabCbbs.orderSeqId,tabCbbs.sequenceCollection)
					}
				}
				e.data.renderSkusTab(e);	
				$(e.target).tab('show') 
				SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
				SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
			});
		}else{
			e.data.renderSkusTab(e);
			$(e.target).tab('show') 
		}
    },
    
    renderSkusTab: function(e){
    	var treeView = new SequenceSkuView({sequenceId:e.data.orderSeqId});
		e.data.$el.find("#seqSkus").html(treeView.render().$el);
		treeView.setTree();
    }
});