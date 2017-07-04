var skuNewAssoModalView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAsso/skuNewAssoModal.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());

		var modelView = new skuNewAssoTableView({skuAssociateList : this.skuAssociateList, view : this.view});
		this.$el.find('#skuAssoTable').html(modelView.render().$el);
		this.setEvents();
		
		return this;
	},
	
	setEvents: function(view){
		this.$el.find("#btnCancel").click(this,this.cancel);
		this.$el.find(".close").click(this,this.cancel);		
	},
	
	setPagination: function() {
		this.$el.find("tbody#tbodyAssoSelectSku").css("display", "none");
		var numEntries = this.$el.find("tbody#tbodyAssoSelectSku tr").length;
		this.$el.find("#paginationAsso").pagination(numEntries, {
			num_edge_entries: 1,
			num_display_entries: 6,
			callback: this.pageSelectCallback,
			items_per_page: 6
		});
	},
	
	pageSelectCallback: function(pageIndex, jq) {
		var max_elem = Math.min((pageIndex+1) * 6, $("#tableAssoSelectSku").find('#tbodyAssoSelectSku tr').length);
		$("#tableAssoSelectSku").find('#displayAssoSelectSku').empty();
		for(var i=pageIndex*6;i<max_elem;i++){
			$("#tableAssoSelectSku").find('#displayAssoSelectSku').append($("#tableAssoSelectSku").find("#tbodyAssoSelectSku tr:eq("+i+")").clone(true,true));
		}
		
		return false;
	},
	
	cancel : function(e){
		$("#newSkuAssoModal").remove();
	},
});