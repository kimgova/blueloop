var forecastInstanceTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/main/template/fcstInstTable.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.setInstanceCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addRow, this);        
        this.$el.find("#addInstanceBtn").click(this,this.newInstance);
        return this;
    },
    
    setInstanceCollection: function(){
        this.collection = new forecastInstanceCollection([]);
        var list = this.getInstanceList();  
        this.$el.find("#titleForecast").text(list[1])
        _.each(list[0],function(item,i){
            var model = new forecastInstanceModel({
                id:         item.forecastInstance.id,
                name:       item.forecastInstance.name,
                status:     item.forecastInstance.status.name,
                createDate: item.forecastInstance.createDate,
                signOffDate:item.forecastInstance.signOffDate,
                forecastId: this.forecastId,
                chainTitle: list[1],
                autorizedBy:item.autorized,
                month:      item.forecastInstance.month,
                year:       item.forecastInstance.year,    
                percentageComplete: item.percentage,
                userLeader: item.userLeader,
                haveBudget: item.haveBudget
            },this);
            this.collection.add(model);
        },this);
    },
    
    getInstanceList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/forecast/getAllInstancesByForecastChain/',
	        data: {id:this.forecastId},
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

    addRow: function(model) {
        var rowView = new forecastInstanceRowView( { model: model } );
 		this.$el.find('tbody#all').append(rowView.render().$el);
    },
    
    newInstance: function(e){
    	var newRowView = new forecastInstanceNewRowView( { forecastId: e.data.forecastId } );
        e.data.$el.find('#no-data-td').remove();
        e.data.$el.find('tbody#display').prepend(newRowView.render().$el);
    },

    setPagination: function() {
    	this.$el.find("tbody#all").css("display", "none");
	    var numEntries = this.$el.find('tbody#all tr').length;
	    this.$el.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 12,
	        callback: this.pageSelectCallback,
	        items_per_page: 12
	    });
    },
    
    pageSelectCallback: function(pageIndex, jq) {
	    var max_elem = Math.min((pageIndex+1) * 12, $("#tableForecastInstances").find('tbody#all tr').length);
	    $("#tableForecastInstances").find('#display').empty()
		for(var i=pageIndex*12;i<max_elem;i++){
			$("#tableForecastInstances").find('#display').append($("#tableForecastInstances").find("tbody#all tr:eq("+i+")").clone(true,true));
		}
	    return false;
	},
});