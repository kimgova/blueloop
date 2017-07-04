var teamMemberRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/teamwork/template/teamMemberRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},

    initialize: function(){
        _.bindAll(this, 'openDropdown', 'closeDropdown', "mouseleave"); 
    },
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setPermissions();
        this.setEvents();
        
        return this;
    },
    
    setEvents: function(){
        this.$el.find('.dropdown-closed').click(this, this.openDropdown);
        this.$el.find('.deleteUser').click(this, this.deleteTeamMember);
        this.$el.find('.permissions-dropdown').mouseleave(this, this.closeDropdown);
    },
    
    openDropdown : function(e){
        e.data.$el.find('.dropdown-toggle').removeClass('dropdown-closed');
        e.data.$el.find('.dropdown-toggle').addClass('dropdown-open');
        e.data.$el.find('.permissions-dropdown').removeClass('dropdown-invisible');
        e.data.$el.find('.permissions-dropdown').addClass('dropdown-visible');
        e.data.$el.find('.dropdown-open').unbind("click");
        e.data.$el.find('.dropdown-open').click(e.data, e.data.closeDropdown);
    },
    
    closeDropdown : function(e){
        e.data.$el.find('.permissions-dropdown').removeClass('dropdown-visible');
        e.data.$el.find('.permissions-dropdown').addClass('dropdown-invisible');
        e.data.$el.find('.dropdown-toggle').removeClass('dropdown-open');
        e.data.$el.find('.dropdown-toggle').addClass('dropdown-closed');
        e.data.$el.find('.dropdown-closed').unbind("click");
        e.data.$el.find('.dropdown-closed').click(e.data, e.data.openDropdown);
    },
    
    setPermissions : function(){
        this.model.set("bb_category",this.parent.bb_category);
        var permissionsView = new dropDownPermissionsView( { model: this.model} );
        this.$el.find('.permissions').append(permissionsView.render().$el);
    },
    
    deleteTeamMember : function(context){
        bootbox.confirm(json.teamwork.confirmMemberRemove, function(e) {
            if (e) {
                var jsonObject = new Object();
                jsonObject.id_teamMember = context.data.model.get("id");
                jsonObject.bb_id         = context.data.parent.bb_id;
                
                $.ajax({
                    type: 'POST',
                    url: '/blueloop/teamwork/removeTeamBBMember/',
                    data: JSON.stringify(jsonObject),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function(data, textStatus) {
                        toastr.success(data.message);
                        context.data.parent.datatable.rows(context.data.$el).remove().draw();
                        context.data.parent.collection.remove({id:context.data.model.get("id")});
                    },
                    error: function(httpRequest, textStatus, errorThrown) { 
                        console.log("status=" + textStatus + " ,error=" + errorThrown);
                        toastr.error(json.error.tryAgain);
                    }
                });
            }
        });
    }
});