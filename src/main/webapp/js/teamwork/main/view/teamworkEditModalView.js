var teamworkEditModalView = Backbone.View.extend({

	template: '/blueloop/static/js/teamwork/main/template/teamworkEditModal.ejs',

	render: function() {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON())); 
		this.getTeamwork();
		this.listTeamMembers.each(this.addRow, this);
		this.setMembersTable();
		this.activeEditMembers();
		this.setEvents();
        return this;
	},
	
	setEvents: function(){
		this.$el.find("#saveBtn").click(this,this.saveTW);
	},
	
	getTeamwork: function(){
		this.listTeamMembers = new teammemberCollection([]);
		var listTeamwork = ajaxCall('GET', '/blueloop/teamwork/getTeamwork/', {id:this.model.id}, "text/json", "json", false);

		_.each(listTeamwork, function(val, i) {
			_.each(val.members, function (item, j) {
				var permissions  = "";
				if(val.group.type == 1){
					permissions = "<b>Categories: </b> GENERAL <b> / </b>";
					$.each(item.bbPermissions, function (k, permis) {
						permissions += permis.categoryName + "<b> / </b>";
					});
				}else{
					permissions = "<b>Layers: </b>";
					$.each(item.permissions, function (m, permiss) {
						permissions += permiss.name + "<b> / </b>";
					});
				}
				var member = new teammemberModel({
	    			id:				item.tmId,
	    			name: 			item.user.firstName +  ' ' + item.user.lastName,
	    			role:			item.role.roleName,
	    			permissions: 	permissions,
	    			department: 	item.user.department,
	    			company:		item.user.company
	    		});
				this.listTeamMembers.push(member);
			},this);
		},this);
		
	},
	
	addRow: function(model) {
        var rowView = new teammemberRowView( { model: model } );
 		this.$el.find('tbody').append(rowView.render().$el);
    },
	
	setMembersTable: function(){
		this.teammemberTable = this.$el.find('#tm-table').DataTable({
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"select"		: "single",
			"jQueryUI"		: false,
			"columnDefs"	: [{ "orderable": false, "targets": [ 4 ] }, 
			            	   { "visible": false, "targets": [0] }]
		});
	},
	
	activeEditMembers: function(){
		this.$el.find("#editTeamworkMembers").css({'display': 'none'});
		_.each(this.listTeamMembers.models, function (member,i) {
			if(member.id == sessionUser.get("id") && member.get("role") == "ROLE_ADMIN"){
				this.$el.find("#editTeamworkMembers").css({'display': 'inline'});
			}
		},this);
	},
	
	saveTW: function(e){
		e.data.$el.find("form").validate({
			success: "valid",
			submitHandler: function(form,data) {
				var obj = {id:e.data.model.id,name:e.data.$el.find("#groupNameEdit").val(),description:e.data.$el.find("#groupDescEdit").val()};
				var teamWork = ajaxCall('GET','/blueloop/teamwork/updateGroup/', obj, "text/json", "json", false);
				toastr.success(json.teamwork.modified);
			}
		});
	}
	
});