var forecastInstLinearTableView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearTable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getLinearCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}
		this.collection.each(this.addModel, this);
		return this;
	},

	getLinearCollection: function(){
		if(this.instanceId != 0){
			this.collection = new forecastLinearCollection.getInstance({clean:true});
			_.each(this.retrieveLinearCollection(),function(item,i){
				var model = new forecastLinearModel({
					idSKU:item.idSKU,
					idForecastPlanning:item.idForecastPlanning,
					instanceId:this.instanceId,
					identifier:item.identifier,
					showInTable:true,
					description: item.description,
					category: item.category,
					subcategory: item.subcategory,
					suggested:item.suggested,
					variations: item.variations,
					variationsList: item.variationsList,
					finalTrade: item.finalTrade,
					negociation: item.negociation,
					role: item.role,
					filters: item.filters,
					custom:item.custom
				});
				this.collection.add(model);
			},this);
		}else{
			this.selectItemsToShow();
			this.collection = forecastLinearCollection.getInstance({});
		}
	},

	retrieveLinearCollection: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcstLinearPlan/getLinearPlanning/',
			data: {instanceId:this.instanceId},
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
		if(model.get("showInTable") == true){
			var modelView = new forecastInstLinearRowView( { model: model } );
			this.$el.find('tbody').append(modelView.render().$el);
		}
	},
	
	selectItemsToShow: function(){
		_.each(forecastLinearCollection.getInstance({}).models,function(item,i){
			if(this.categoryId == 0){
				forecastLinearCollection.getInstance({}).at(i).set({showInTable:true});
			}else{
				if(item.get("category").id == this.categoryId){
					forecastLinearCollection.getInstance({}).at(i).set({showInTable:true});
				}else{
					forecastLinearCollection.getInstance({}).at(i).set({showInTable:false});
				}
			}
		},this);
		
		if(this.subCategoryId != 0){
			_.each(forecastLinearCollection.getInstance({}).models,function(item,i){
				if(item.get("showInTable")){
					if(item.get("subcategory").id == this.subCategoryId){
						forecastLinearCollection.getInstance({}).at(i).set({showInTable:true});
					}else{
						forecastLinearCollection.getInstance({}).at(i).set({showInTable:false});
					}
				}
			},this);
		}
		
		if(this.roleId != 0){
			_.each(forecastLinearCollection.getInstance({}).models,function(item,i){
				if(item.get("showInTable")){
					if(item.get("role").id == this.roleId){
						forecastLinearCollection.getInstance({}).at(i).set({showInTable:true});
					}else{
						forecastLinearCollection.getInstance({}).at(i).set({showInTable:false});
					}
				}
			},this);
		}
		
		if(this.filters.length > 0){
			_.each(forecastLinearCollection.getInstance({}).models,function(item,i){
				if(item.get("showInTable")){
					forecastLinearCollection.getInstance({}).at(i).set({showInTable:false});
					_.each(item.get("filters"),function(item2,j){
						_.each(this.filters,function(filter,k){
							if(item2.filter.id == filter){
								forecastLinearCollection.getInstance({}).at(i).set({showInTable:true});
							}
						});
					},this);
				}
			},this);
		}
	},
	
	initPagination: function(){
		this.$el.find("tbody#all").css("display", "none");
		var numEntries = forecastLinearCollection.getInstance({}).where({showInTable: true}).length;
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