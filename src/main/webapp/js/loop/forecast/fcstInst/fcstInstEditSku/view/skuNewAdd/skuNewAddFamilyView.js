var skuNewAddFamilyView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddFamily.ejs',
	
	subCollection : null,
		
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
		
		this.getCatCollection();
		
		var familySkuView = new skuNewAddFamSelectView({});
		familySkuView.collection = this.collection;
		familySkuView.skuCollection = this.skuCollection;
		familySkuView.idSelect ="familySku";
		familySkuView.disabled ="";
		
		if(this.skuCollection){
			familySkuView.disabled ="disabled";
			familySkuView.description = this.skuCollection.first().attributes.description;
		}
		
		var render = familySkuView.render();
		this.$el.find("#divFamilySku").append(render.$el);
		
		this.subCollection = render.subCollection;
		this.setBrands(render.subCatList, render.subCatSelected);
		this.setEvents();
		return this;
	},

	getCatCollection: function(){
		this.collection = forecastCatCollection.getInstance({});
	},
	
	setEvents: function(){
		this.$el.find("input:checkbox").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%' 
		});
		
		this.$el.find('#familySku').change(this,this.changeFamily);
	},

	setBrands : function(subCatList,subCatSelected){
		this.subCollection = new forecastSubCollection();
		_.each(subCatList,function(item,i){
			var model = new forecastSubModel({
				id:item.id,
				name: item.name,
				status: CATEGORY_STATUS[item.status.name],
				categoryId:this.categoryId
			});
			this.subCollection.add(model);
		},this);

		var brandSelectView = new skuNewAddBrandSelectView({});
		brandSelectView.collection = this.subCollection;
		brandSelectView.idSelect ="brandSku";
		brandSelectView.subCatSelected = subCatSelected;
		brandSelectView.disabled ="";
		if(this.skuCollection){
			brandSelectView.disabled ="disabled";
		}
		
		this.$el.find("#divBrandSku").html(brandSelectView.render().$el);
	},
	
	changeFamily : function(e){
		var family = e.data.collection.findWhere({id:parseInt(e.data.$el.find('#familySku').val())});
		e.data.setBrands(family.attributes.subCatList,'');
	}
});