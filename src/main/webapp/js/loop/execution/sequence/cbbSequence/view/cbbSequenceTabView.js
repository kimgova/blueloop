var cbbSequenceTabView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/sequence/cbbSequence/template/cbbSequenceTabPane.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	
    	SequenceExitModel.getInstance({}).set('cbbTabView',this);
    	SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
    	
        this.$el = $(new EJS({url: this.template}).render());
        
        this.setCollections(this.getOrderSeqCBBList());
        
        this.viewCBBItems = [];
        this.viewItems = [];
        this.collection.each(this.setCbbList, this);
        this.sequenceCollection.each(this.setSeqList, this);

        this.setEvents();
        
        this.hideShowSequenceBtns();
        return this;
    },
    
    setEvents: function(){
        var that = this;
//        this.$el.find("#sortable").sortable({
//            update: function(ev, ui){
//                that.listUpdate();
//             }        
//        });
        this.$el.find("#sortable").disableSelection();
        
        this.$el.find("#saveSequence").click(this,this.saveSequence);
    },
    
    saveSequence: function(e){
		e.data.save(e.data.orderSeqId,e.data.sequenceCollection);
    },
    
    save: function(idSequence,listCBB){
    	$.ajax({
			type: 'POST',
			url: '/blueloop/orderSequenceCBB/saveSequence/',
			data: JSON.stringify({idSequence:idSequence,listCBB:listCBB}),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				if(data.success){
					toastr.success(json.prodOrder.sequenceSaved);
				}else{
					toastr.error(data.text);
				}
				SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
    
    getOrderSeqCBBList: function(){
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop/orderSequenceCBB/getCbbSequenceList/',
            data: {orderSeqId:this.orderSeqId},
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                data = data;
            },
            error: function(httpRequest, textStatus, errorThrown) { 
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
            }
        });
        return dataReturned.responseJSON;
    },
        
    
    setCollections: function(cbbList){
        
        this.collection = new cbbCollection([]);
        _.each(cbbList.cbbList,function(item,i){
            var model = new cbbModel({
                id:item.id,
                bbName: item.bbName,
                idFormJSON: item.idFormJSON,
                show:true
            });
            this.collection.add(model); 
        },this);
        
        this.sequenceCollection = new cbbSequenceCollection([]);
        _.each(cbbList.cbbSequenceList,function(item,i){
            var model = new cbbModel({
                id:item.id,
                bbName: item.bbName,
                idFormJSON: item.idFormJSON,
                step:item.step
            });
            this.sequenceCollection.add(model); 
        },this); 
    },
    
    setCbbList: function(model){
        var listView = new cbbListView({
            model : model, 
            seqCollection:this.sequenceCollection, 
            cbbCollection:this.collection, 
            viewItems:this.viewItems,
            tabView:this
        });
        this.viewCBBItems.push(listView);
        this.$el.find('#sortableBB').append(listView.render().$el);
    },
    
    setSeqList: function(model){
        var listView = new cbbSequenceListView({
            model : model, 
            seqCollection:this.sequenceCollection, 
            cbbCollection:this.collection, 
            viewItems:this.viewItems,
            tabView:this
        });
        
        this.viewItems.push(listView);
        this.$el.find('#sortable').append(listView.render().$el);
        if(this.viewItems.length > 0){
        	this.setListCBBToShow(this.viewItems[this.viewItems.length-1].model.get("idFormJSON"));
        	this.showCBBList();
        }
    },
    
    listUpdate: function(){
        _.each(this.viewItems, function(item){
            item.model.set('step', item.$el.index() + 1);
        });
        this.sequenceCollection.sort({silent: true})
        SequenceExitModel.getInstance({}).set('cbbPendingChanges',true);
    },
    
    setListCBBToShow: function(idFormJSON){
    	if(!idFormJSON){
    		_.each(this.collection.models, function(item){
            	item.set("show",true);
            });
    	}else{
    		var bbListToShow = window.DIAGRAM_FACADE.getAvailableCBB(idFormJSON);
            _.each(this.collection.models, function(item){
            	item.set("show",false);
            	_.each(bbListToShow, function(idForm){
                    if(item.get("idFormJSON") == idForm){
                    	item.set("show",true);
                    }
                });
            });
    	}
    },
    
    showCBBList: function(){
    	_.each(this.viewCBBItems, function(item){
    		if(!item.model.get("show")){
    			item.$el.hide();
    		}else{
    			item.$el.show();
    		}
        });
    },
    
    removeFromCBBList: function(idFormJSON){
         _.each(this.viewCBBItems, function(item, i){
             if(item.model.get("idFormJSON") == idFormJSON){
             	this.viewCBBItems.splice(i,1)
             	return false;
             }
         },this); 
    },
    
    hideShowSequenceBtns: function(){
    	 _.each(this.viewItems, function(item,i){
         	if(i != this.viewItems.length - 1){
         		item.hideButton();
         	}else{
         		item.showButton();
         	}
         },this);
    }

});