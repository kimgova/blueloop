var fcstInst3STableView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEdit3S/template/fcstInst3STable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.get3SCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}
		this.collection.each(this.addModel, this);
		
		return this;
	},

	get3SCollection: function(){
		if(!this.fromEdit){
			if(this.instanceId != 0 && this.roleId == 0){
				fcstInst3SCollection.getInstance({clean:true});
				var result = this.retrieve3SList();
				this.editable = false;
			}else{
				fcstInst3SCollection.getInstance({clean:true});
				var result = this.retrieveFiltered3SList();
				this.editable = true;
			}
			_.each(result,function(item,i){
				var model = new fcstInst3SModel({
					idSkuChain: item.idSkuChain,
					identifier: item.identifier,
					description: item.description,
					initInv: item.initInv,
					transit: item.transit,
					fcstTrade: item.fcstTrade,
					finalInv: item.finalInv,
					dos: item.dos,
					dailySales: item.dailySales,
					invPolicy: item.invPolicy,
					invAdj: item.invAdj,
					order: item.order,
					suggAdj: item.suggAdj,
					fcstExport: item.fcstExport,
					editable:this.editable,
					roleId:this.roleId,
					instanceId:this.instanceId
				});
				fcstInst3SCollection.getInstance({}).add(model);
			},this);
		}
		this.collection = fcstInst3SCollection.getInstance({});
	},

	retrieve3SList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcst3S/getAll3S/',
			data: {id:this.instanceId},
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
	
	retrieveFiltered3SList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcst3S/get3SByRole/',
			data: {id:this.instanceId,roleId:this.roleId},
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

	addModel: function(model) {
		var modelView = new fcstInst3SRowView( { model: model } );
		this.$el.find('tbody').append(modelView.render().$el);
	},
	
	initPagination: function(){
		this.$el.find("tbody#all").css("display", "none");
		var numEntries = this.collection.length
		this.$el.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 5,
	        callback: this.pageSelectCallback,
	        items_per_page: 30
	    });
	},
	
	pageSelectCallback: function(pageIndex, jq){
		var max_elem = Math.min((pageIndex+1) * 30, $(jq.prevObject[0]).find('tbody#all tr').length);
		$(jq.prevObject[0]).find('#display').empty()
		for(var i=pageIndex*30;i<max_elem;i++){
			$(jq.prevObject[0]).find('#display').append($(jq.prevObject[0]).find("tbody#all tr:eq("+i+")").clone(true,true));
		}
		return false;
	}

});