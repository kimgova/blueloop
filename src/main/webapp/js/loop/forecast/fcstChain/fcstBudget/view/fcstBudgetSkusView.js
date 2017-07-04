var forecastBudgetSkusView = Backbone.View.extend({
    
    constructor : function (options) {
		_.extend(this, options);
	},
	
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstBudgetSkusTemplate.ejs',

    render: function() {
    	this.tableData = this.getBudgetSkusList();
    	this.$el = $(new EJS({url: this.template }).render({periods:this.tableData.periods,skus:this.tableData.skus}));    	
		this.$el.find("#backBtn").click(this,this.backToIPOList);
        return this;
    },
    
    backToIPOList: function(e){
    	var tableView = new forecastBudgetTableView({ forecastId: e.data.forecastId}); 
    	$('#budgetContent').append(tableView.render().$el);
    	$('#titleBudget').html(json.forecast.budget.modalSubTitle);
    	$("#budgetDetailContent").empty();
    	$("#budgetDetailContent").toggle( "slide" );
    	$("#budgetContent").toggle( "slide" );
    },
    
    getBudgetSkusList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstBudget/getBudgetSkusByIPO/',
	        data: {id:this.model.id},
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
		return dataReturned.responseJSON;
    },
    
    setPagination: function() {
    	this.$el.find("tbody#allSkuBudget").css("display", "none");
	    var numEntries = this.$el.find('tbody#allSkuBudget tr').length;
	    this.$el.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 6,
	        callback: this.pageSelectCallback,
	        items_per_page: 30
	    });
    },
    
    pageSelectCallback: function(pageIndex, jq) {
	    var max_elem = Math.min((pageIndex+1) * 30, $("#tableBudgetSkus").find('tbody#allSkuBudget tr').length);
	    $("#tableBudgetSkus").find('#displaySkuBudget').empty()
		for(var i=pageIndex*30;i<max_elem;i++){
			$("#tableBudgetSkus").find('#displaySkuBudget').append($("#tableBudgetSkus").find("tbody#allSkuBudget tr:eq("+i+")").clone(true,true));
		}
	    return false;
	},

});