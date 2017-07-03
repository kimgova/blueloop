var forecastRoleFilterTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/filters/tableRoleFiltersTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {        
        this.setFilterCollection();        
        if(this.filterCollection.length == 0){
        	toastr.warning("This role has no filters. Add one using the 'Add Filter' button.");
        }
        this.$el = $(new EJS({url: this.template }).render({filtersLength:this.filterCollection.length}));
        this.filterCollection.each(this.addTh, this);
        
        if(this.skusFilterCollection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.skusFilterCollection.each(this.addRow, this);                      
        this.$el.find("#addRoleFilter").click(this,this.addRoleFilter);
        return this;
    },
    
    setFilterCollection: function(){
    	this.filterCollection = new forecastRoleFilterCollection([]);
    	this.skusFilterCollection = new forecastRoleSkuFilterCollection([]);
    	var list = this.getFilterList();

    	_.each(list[0],function(item,i){    		
    		var modelFilter = new forecastRoleFilterModel({
    			id : item.id,
    			name : item.name
      		},this);
    		this.filterCollection.add(modelFilter);
	    },this);
    	
    	_.each(list[1],function(item,i){    		
    		var model = new forecastRoleSkuFilterModel({
    			idFRSku : item.frsku.id,
    			idSku: item.sku.id,
    			skuDescription:item.sku.description,
    			skuIdentifier:item.sku.identifier,
    			filterList:item.filterList
      		},this);
    		this.skusFilterCollection.add(model);
	    },this);

    },
    
    getFilterList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstRoleFilter/getForecastRoleFilters/',
	        data: {instanceId:this.instanceId,roleId:this.roleId},
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

    addTh: function(model) {
        var thView = new forecastRoleFilterThView( { model: model } );
        thView.instanceId = this.instanceId;
    	thView.roleId =  this.roleId;  
 		this.$el.find('thead tr').append(thView.render().$el);
    },
    
    addRow: function(model) {
        var rowView = new forecastRoleFilterRowView( { model: model } );
        rowView.table = this;
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    addRoleFilter: function(e){
    	var countFilters = e.data.$el.find('thead th').length;
    	var countNewInputs = e.data.$el.find('thead #nameNewFilter').length;
    	
    	if(countNewInputs < 1){    	
    		if(countFilters == 7){
    			toastr.error("You can not add more filters, just 5 filters allowed by role.");
        	}else{
        		var newThView = new forecastRoleFilterThNewView( { roleId: e.data.roleId } );
            	newThView.instanceId = e.data.instanceId;
            	newThView.roleId =  e.data.roleId;    	
            	e.data.$el.find('thead tr').append(newThView.render().$el);
        	}
    	}   	
    },
   
    setICheck: function() {
    	$('#tableRoleFilters').find("input:checkbox").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		}); 
    },
    
    setPagination: function() {
    	this.$el.find("tbody#all").css("display", "none");
	    var numEntries = this.$el.find('tbody#all tr').length;
	    this.$el.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 6,
	        callback: this.pageSelectCallback,
	        items_per_page: 30
	    });	    
    },
    
    pageSelectCallback: function(pageIndex, jq) {
	    var max_elem = Math.min((pageIndex+1) * 30, $("#tableRoleFilters").find('tbody#all tr').length);
	    $("#tableRoleFilters").find('#display').empty()
		for(var i=pageIndex*30;i<max_elem;i++){
			$("#tableRoleFilters").find('#display').append($("#tableRoleFilters").find("tbody#all tr:eq("+i+")").clone(true,true));
		}
	    return false;
	},
});