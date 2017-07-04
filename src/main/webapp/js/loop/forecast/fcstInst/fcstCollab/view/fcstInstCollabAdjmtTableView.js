var collaborativeTableView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabAdjmtTable.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.$el.find('tbody').empty();
		this.getCollaborativeAdjustCollection();
		return this;
	},
	
	getCollaborativeAdjustCollection: function(){
		this.collection = fcstCollabDataCollection.getInstance({clean:true});
		_.each(this.retrieveCollaborativeData(), function(item,i){
			var model = new fcstCollabDataModel({item:item});
			this.collection.add(model);
			this.addModel(item,i);
		},this);
	},
	
	retrieveCollaborativeData: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: "/blueloop/fcstCollaborative/getCollaborativeData/",
			data: {id:this.instanceId,filterType:this.filterType,unit:this.unit,isDefault:this.isDefault},
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
	
	addModel: function(firstItem,i) {
		var treeClass = "treegrid-"+i+"-0";
		var firstRowView = this.getCollabRowView(firstItem,treeClass,true);
		this.$el.find('tbody').append(firstRowView.render().$el);
		
		_.each(firstRowView.model.get('subList'),function(item,j){
			var treeClass 	= "treegrid-"+i+"-"+(j+1) + " treegrid-parent-"+i+"-0";
			var secondRowView = this.getCollabRowView(item,treeClass,true);
			this.$el.find('tbody').append(secondRowView.render().$el);
			
			_.each(secondRowView.model.get('subList'),function(item,k){
					var treeClass 	= "treegrid-"+i+"-"+(j+1)+"-" + (k+1) + " treegrid-parent-"+i+"-"+(j+1);
					var thirdRowView = this.getCollabRowView(item,treeClass,true);
					this.$el.find('tbody').append(thirdRowView.render().$el);

					_.each(thirdRowView.model.get('subList'),function(item,x){
						var treeClass = "treegrid-"+i+"-"+(j+1)+"-" + (k+1) +"-" + (x+1)+ " treegrid-parent-"+i+"-"+(j+1)+"-" + (k+1);
						var fourthRowView = this.getCollabRowView(item,treeClass,false);
						this.$el.find('tbody').append(fourthRowView.render().$el);
					}, this);
			}, this);
		}, this);
	},
	
	getCollabRowView: function(item,treeClass,editable,list,description,detail){
		var arrow = this.getArrow(item.finalExport,item.budget);
		var model = new fcstCollabRowModel({
				id:item.id,
				detailRow:item.identifier + " " + item.name,
				exportRow:item.fcstExport,
				budgetRow:item.budget,
				adjustmentsRow:item.tAdjmt,
				finalRow:item.finalExport,
				risksRow:item.tAdjmtRisk,
				subList:item.subList,
				treeClass:treeClass,
				arrow:arrow,
				rowType:item.rowType,
				rowLevel:item.rowLevel,
				idRole:item.idRole,
				idSubCat:item.idSubCat,
				idFP:item.idFP,
				filterType:this.filterType,
				instanceId:this.instanceId,
				editable:editable
			});

		var rowView = new collaborativeRowView( { model: model,collabTable:this } );
		return rowView;
	},

	getArrow: function(finalExport,budget){
		var arrow = 'fa-check';
		if(finalExport < budget){
			arrow = 'fa-arrow-down';
		}else if(finalExport > budget){
			arrow = 'fa-arrow-up';
		}
		return arrow
	},
	
	initTreeGrid: function(){
		this.$el.find(".tree").treegrid({
			expanderExpandedClass: 'fa fa-minus-square',
			expanderCollapsedClass: 'fa fa-plus-square',
			initialState: 'collapsed',
			saveState: true
		});
	},
	
});