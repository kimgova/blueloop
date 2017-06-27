var fcInstLinearVarModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/template/fcstInstLinearVarModal.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
    	var user = this.getUser();
    	this.$el = $(new EJS({url: this.template }).render({identifier:this.model.get("identifier")}));
    	var tableView = new fcInstLinearVarTableView({planningId: this.model.get("idForecastPlanning"),userId:user.id});
		this.$el.find("#varTable").append(tableView.render().$el);
		
		this.$el.find("#addVarBtn").click(this,this.addVar);
    	
        return this;
    },
    
    addVar: function(e){
    	var modelView = new fcInstLinearVarNewRowView({planningId:e.data.model.get("idForecastPlanning")});
		e.data.$el.find('#varTable #no-data-td').remove();
		e.data.$el.find('#varTable tbody').append(modelView.render().$el);
    },
    
    getUser: function(){
    	var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop-backend/user/getCurrent/',
			data: {},
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
    }

});