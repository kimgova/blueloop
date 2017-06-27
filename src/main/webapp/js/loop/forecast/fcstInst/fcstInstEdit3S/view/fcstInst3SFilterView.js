var fcstinst3SFilterView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEdit3S/template/fcstInst3SFilter.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.getRoles();
		console.log(this.roleCollection)
		this.$el = $(new EJS({url: this.template }).render({roles:this.roleCollection.models}));
		this.$el.find("#rolesFilter").change(this,this.selectRole);
		return this;
	},
	
	getRoles: function(){
		this.roleCollection = new forecastRoleCollection();
		_.each(this.retrieveRoles(),function(item,i){
			var model = new forecastLinearRoleModel({
				id:item.id,
				name: item.name
			});
			this.roleCollection.add(model);
		},this);
	},

	retrieveRoles: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop-backend/fcstRole/getRolesByForecastInstance/',
			data: {id:this.instanceId},
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
	
	selectRole: function(e) {
		var idRole = parseInt($(e.target).val());
		var tableView = new fcstInst3STableView({instanceId: e.data.instanceId, roleId:idRole, fromEdit: false});
		$("#3sTable").html(tableView.render().$el);
		tableView.initPagination();
	}

});