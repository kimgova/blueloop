var forecastInstEditSkuView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewTab/fcstInstSkuView.ejs',
	that : this,
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		var tableView = new forecastInstSkuTableView({fcInstanceId: this.fcInstanceId});
		this.$el.find("#skuListTable").append(tableView.render().$el);
		this.$el.find("#addNewSku").click(this,this.addNewSku);
		
		return this;
	},
	
	setPagination: function() {
		this.$el.find("tbody#tbodySku").css("display", "none");
		var numEntries = this.$el.find('tbody#tbodySku tr').length;
		this.$el.find("#pagination").pagination(numEntries, {
			num_edge_entries: 1,
			num_display_entries: 30,
			callback: this.pageSelectCallback,
			items_per_page: 30
		});
	},
	
	pageSelectCallback: function(pageIndex, jq) {
		var max_elem = Math.min((pageIndex+1) * 30, $("#tableFCPSkuList").find('tbody#tbodySku tr').length);
		$("#tableFCPSkuList").find('#display').empty();
		for(var i=pageIndex*30;i<max_elem;i++){
			$("#tableFCPSkuList").find('#display').append($("#tableFCPSkuList").find("tbody#tbodySku tr:eq("+i+")").clone(true,true));
		}
		
		return false;
	},
	
	setICheckPlugin: function(){
		$("#tableFCPSkuList").find("input:checkbox").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%' 
		});
		
		var that = this;
		$("#tbodySku input:checkbox").on('ifChecked', function(e){
			that.changeCheckboxStatus(e, that, "display","addClass", 'P');
		});
		$("#tbodySku input:checkbox").on('ifUnchecked', function(e){
			that.changeCheckboxStatus(e, that, "display","removeClass",null);
		});
		$("#display input:checkbox").on('ifChecked', function(e){
			that.changeCheckboxStatus(e, that, "tbodySku","addClass", 'P');
		});
		$("#display input:checkbox").on('ifUnchecked', function(e){
			that.changeCheckboxStatus(e, that, "tbodySku","removeClass",null);
		});
	},
	
	changeCheckboxStatus: function(e,that,tbody, action, value){
		that.changePromoStatus($(e.currentTarget).attr('value'), value,that.fcInstanceId);
		
		var id = $(e.currentTarget).attr('id');
		if(action == "removeClass"){
			$(e.target).parents("#tableFCPSkuList").find("#"+tbody).find("#"+id).parent().removeClass("checked");
		}else{
			$(e.target).parents("#tableFCPSkuList").find("#"+tbody).find("#"+id).parent().addClass("checked");
		}
	},
	
	changePromoStatus: function(skuChain,status,fcstInst){
		var actData = {skuChain:skuChain,status:status,fcstInst:fcstInst};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstSku/changePromoStatus/',
			data: JSON.stringify(actData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.general.successfullySaved);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
	},
	
	addNewSku: function(e){
		var newSkuModalView = new skuNewAddModalView({});
		newSkuModalView.fcInstanceId = e.data.fcInstanceId;
		newSkuModalView.skuView = e;
		newSkuModalView.callFrom = 'addNewSku';
		newSkuModalView.render().$el.modal("show");		
	}
	
});