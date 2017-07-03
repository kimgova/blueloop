var forecastRoleSkuView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/treeRoleSkuTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        var treeData = this.getData();
        this.setTree(treeData);
        this.setEvents();
        return this;
    },
    
    setTree: function (treeData) {    	
    	this.$el.jstree({'plugins':["wholerow","checkbox"], 'core' : {
			'data' : treeData
		}});
    },
    
    setEvents: function () {  
    	var that = this;
    	this.$el.on('changed.jstree', function (e, data) {
    		var skuList = that.changeSkuState(data);
    		that.changeSkuStateDB(that.instanceId,that.roleId,skuList,data.action)
    	});
    },
    
    getData: function(){
    	var list = this.retrieveSkuList();
    	var treeData = [];
    	
    	_.each(list,function(item,i){    		
    		var cat = {"text":item.name,"id":"c"+item.id,"nodeType":"cat","state" : { "opened" : false }};
    		var subList = []
    		_.each(item.subCatList,function(item2,j){
    			var subCat = {"text":item2.name, "id":"s"+item2.id, "nodeType":"subcat","state" : { "opened" : false }};
    			var skuList = []
    			_.each(item2.skuList,function(item3,k){
        			var sku = {"text":item3.identifier + " - " + item3.description, "id":item3.id, "nodeType":"sku", "icon" : "glyphicon glyphicon-file","state" : { "selected" : item3.selected }};
        			skuList.push(sku);
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
			url: '/blueloop/fcstRole/getCatWithSkusByFcInstanceAndRole/',
			data: {instanceId:this.instanceId,roleId:this.roleId},
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
    	}
    	
    	return listSku;
    },
    
    changeSkuStateDB: function(instanceId,roleId,skuList,action){
    	var reqUrl = "";
    	if(action == "select_node"){
    		reqUrl = "/blueloop/fcstRole/addRoleSkus/"
    	}else if(action == "deselect_node"){
    		reqUrl = "/blueloop/fcstRole/removeRoleSkus/"
    	}
    	
    	if(reqUrl != ""){
	    	var reqData = {instanceId:instanceId,roleId:roleId,skuList:skuList}
	    	var dataReturned = $.ajax({
				type: 'POST',
				url: reqUrl,
				data: JSON.stringify(reqData),
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
    	}
    }
	
});