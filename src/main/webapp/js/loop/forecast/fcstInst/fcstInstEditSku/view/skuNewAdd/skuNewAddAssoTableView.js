var skuNewAddAssoTableView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddAssoTable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getSkuCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}

		this.collection.each(this.addModel, this);

		this.$el.find("#btnAssoSku").click(this,this.addAssoSku); 
		return this;
	},
	
	getSkuCollection: function(){
		this.collection = new forecastSkuAssoCollection([]);
		_.each(this.model.attributes.skuAssociateList,function(item,i){
			var modelSku = new forecastSkuModel({
				id:item.id,
				identifier:item.identifier,
				description:item.description,
				type:item.type,
				skuChain:item.skuChain,
				unit:''
			});
			this.collection.add(modelSku);
		},this);
	},

	addModel: function(model) {
		var modelView = new skuNewAddAssoRowView( { model: model, viewModal:this.view} );
		this.$el.find('tbody').append(modelView.render().$el);
	},

	addAssoSku: function(e){
		var assoSkuModal = new skuNewAssoModalView({});
		assoSkuModal.skuAssociateList = e.data.collection;
		assoSkuModal.view = e;

		var assorender = assoSkuModal.render();
		var modal = assorender.$el;
		e.data.view.$el.append(modal);
		assorender.setPagination();
		modal.modal();
	}
});