var forecastRoleFilterThNewView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/filters/newThTableRoleFilterTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find(".saveNewFilter").click(this,this.saveNewFilter);
        this.$el.find(".cancelNewFilter").click(this,this.cancelNewFilter);
        return this;
    },
 
    saveNewFilter: function(e){
        var filterName = e.data.$el.find('#nameNewFilter').val()
        if(e.data.validate(filterName)){
        	 var newFilter = JSON.parse(e.data.saveFilter(filterName, e.data.roleId));
             var tableView = new forecastRoleFilterTableView();
             tableView.instanceId = e.data.instanceId;
             tableView.roleId =  e.data.roleId;
             $("#roleFilters").html(tableView.render().$el);
             
             tableView.setICheck();
             tableView.setPagination(); 	
        }        
    },
    
    saveFilter: function(filterName, roleId){
        var dataFilter = {filterName:filterName,roleId:roleId}; 
        var dataReturned = $.ajax({
            type: 'POST',
            url: '/blueloop-backend/fcstRoleFilter/saveForecastRoleFilter/',
            data: JSON.stringify(dataFilter),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                data =  data;
                toastr.success(json.forecast.fcstInstFilterRoleAdded);
            },
            error: function(httpRequest, textStatus, errorThrown) { 
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
             }
        });
        return dataReturned.responseText;
    },
    
    validate: function(filterName){
		var valid = true;
		if(filterName.trim() == "" || /^\s*$/.test(filterName)){
			toastr.error(json.error.errorEmptyFilterName);
			valid = false;
		}
		return valid;
	},
	
    cancelNewFilter: function(e) {
        e.data.remove();
    }

});