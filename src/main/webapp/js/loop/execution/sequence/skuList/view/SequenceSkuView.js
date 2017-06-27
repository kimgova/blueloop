var SequenceSkuView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/execution/sequence/skuList/template/SequenceSkuTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
    	SequenceExitModel.getInstance({}).set('skuTabView',this);
    	SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
    			
    	this.$el = $(new EJS({url: this.template }).render());
        
        this.listSkusToSave = [];
        
        this.treeData = this.getData();
        this.setEvents();
        
        return this;
    },
    
    setTree: function() {
    	$('div#jstreeSkus.demo').jstree({'plugins':["wholerow","checkbox"], 'core' : {
			'data' : this.treeData
		}});
    },
    
    setEvents: function() {  
    	var that = this;
    	this.$el.on('changed.jstree', function (e, data) {
    		var skuList = that.changeSkuState(data);
    	});
    	
    	this.$el.find("#SaveSkusBtn").click(this,this.saveSkus);
    },
    
    updateSkusToSave: function(skuList, mode){
    	var found = false;
    	if(mode == "select_node"){
    		for(var i=0; i<skuList.length;++i){
    			this.listSkusToSave.push(skuList[i]);
    			SequenceExitModel.getInstance({}).set('skuPendingChanges',true);
    		}

    	}else if(mode == "deselect_node"){
    		for(var j=0; j<skuList.length;++j){
    			for(var k=0; k<this.listSkusToSave.length;++k){
    				if(this.listSkusToSave[k] == skuList[j]){				   
    					this.listSkusToSave.splice(k,1); 
    					SequenceExitModel.getInstance({}).set('skuPendingChanges',true);
    				}			     
    			}
    		}
    	}
    },
    
    getData: function(){
    	var list = this.retrieveSkuList();
    	var treeData = [];
    	var that = this;
    	_.each(list,function(item,i){    		
    		var cat = {"text":item.name,"id":"c"+item.id,"nodeType":"cat","state" : { "opened" : false }};
    		var subList = []
    		_.each(item.subCatList,function(item2,j){
    			var subCat = {"text":item2.name, "id":"s"+item2.id, "nodeType":"subcat","state" : { "opened" : false }};
    			var skuList = []
    			_.each(item2.skuList,function(item3,k){
        			var sku = {"text":item3.identifier + " - " + item3.description, "id":item3.id, "nodeType":"sku", "icon" : "glyphicon glyphicon-file","state" : { "selected" : item3.selected }};
        			skuList.push(sku);
        			if(item3.selected){
        				that.listSkusToSave.push(item3.id);
        				SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
        			}
        		});
    			subCat["children"] = skuList;
    			subList.push(subCat);
    		});
    		cat["children"] = subList;
    		treeData.push(cat);
	    });
    	return treeData;
    },
    
    retrieveSkuList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop-backend/orderSequence/getCatAndSkusBySequence/',
			data: {sequenceId:this.sequenceId},
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

    changeSkuState: function(data) {
    	var listSku = [];
    	if(data.action == "select_node"){
    		if(data.node.original.nodeType == "cat"){
    			_.each(data.node.children_d,function(item,i){
    				if(item.substring(0, 1) != "s"){
    					listSku.push(item);
    				}
    			});
    		}else if(data.node.original.nodeType == "subcat"){
    			listSku = data.node.children_d;
    		}else{
    			listSku.push(data.node.id);
    		}
    		
    		this.updateSkusToSave(listSku,"select_node");
    		
    	}else if(data.action == "deselect_node"){
    		if(data.node.original.nodeType == "cat"){
    			_.each(data.node.children_d,function(item,i){
    				if(item.substring(0, 1) != "s"){
    					listSku.push(item);
    				}
    			});
    		}else if(data.node.original.nodeType == "subcat"){
    			listSku = data.node.children_d;
    		}else{
    			listSku.push(data.node.id);
    		}
    		
    		this.updateSkusToSave(listSku,"deselect_node");
    	}
    	
    	return listSku;
    },
    
    saveSkus: function(e){
    	e.data.save(e.data.sequenceId,e.data.listSkusToSave);
    },
    
    save: function(sequenceId,skuList){
    	var skusData = {sequenceId:sequenceId,skuList:skuList}
    	var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/orderSequence/saveSequenceSkus/',
			data: JSON.stringify(skusData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data = data;
				SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
				toastr.success(json.sequence.skusSaved);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.sequence.skusNoSaved);
			}
		});
		return dataReturned.responseJSON;
    },
	
});