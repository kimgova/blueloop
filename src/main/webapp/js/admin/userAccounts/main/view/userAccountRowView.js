var userAccountRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/userAccounts/main/template/userAccountRowTemplate.ejs',
    
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
        this.$el.find("#resetPass").click(this,this.resetPass);
        this.$el.find("#editUser").click(this,this.editUser);
        this.$el.find("#deleteUser").click(this,this.deleteUser);
        this.$el.find("#activateUser").click(this,this.activateUser);
        this.$el.find('.dropdown-closed').click(this, this.openDropdown);
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
        var permissionsView = new dropDownPermissionsView( { model: this.model} );
        this.$el.find('.permissions').append(permissionsView.render().$el);
    },
    
    resetPass: function(e) {
        var that = e; 
        bootbox.confirm(json.admin.passwordConfirm + that.data.model.get('name') + '?', function (e) {
            if (e) {
                $.ajax({
                    type: 'POST',
                    url: '/blueloop/administrator/resetPassword/',
                    data: JSON.stringify({id:that.data.model.get("id"),email:that.data.model.get("email")}),
                    contentType: "text/json",
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        toastr.success(json.admin.passwordReminder)
                    },
                    error: function(httpRequest, textStatus, errorThrown) { 
                       console.log("status=" + textStatus + " ,error=" + errorThrown);
                    }
                });
            } else {
                return;
            }
        });
    },
    
    editUser: function(e){
        $("#edit-user-modal").remove();    
        var modalView = new editUserModalView({userId:e.data.model.get("id"),email:e.data.model.get("email"),tablerow:e.data});
        modalView.render().$el.modal("show");
    },
    
    deleteUser: function(e){
        var that = e; 
        bootbox.confirm(json.admin.confirmUserDelete + that.data.model.get('name') + '?', function (e) {
            if (e) {
                if(that.data.model.get("bbs") == 0 && that.data.model.get("loops") == 0 && that.data.model.get("countFlow") == 0){
                    var result = ajaxCall('GET', '/blueloop/user/disableUser/', {id:that.data.model.id}, "text/json", "json", false);
                    if(result.success){
                        toastr.success(result.message);
                        that.data.tableView.datatable.rows(that.data.$el).remove();
                        that.data.model.set("userStatus","DISABLED");
                        var elNewRow = that.data.tableView.addNewRow(that.data.model); 
                        that.data.tableView.datatable.rows.add(elNewRow).draw();
                        that.data.tableView.filter(that.data.tableView.currentFilter);
                    }else{
                        toastr.error(result.message);
                    }
                }else{
                    var modalView = new delUserModalView({model:that.data.model,tableView:that.data.tableView,row_el:that.data.$el});
                    modalView.render().$el.modal("show");
                }
            }
        });
    },
    
    activateUser: function(e){
        var that = e; 
        bootbox.confirm(json.admin.confirmUserActivate + that.data.model.get('name') + '?', function (e) {
            if (e) {
                var result = ajaxCall('POST', '/blueloop/user/enableUser/', JSON.stringify({id:that.data.model.get("id")}), "text/json", "json", false);
                if(result.success){
                    toastr.success(result.message);
                    that.data.tableView.datatable.rows(that.data.$el).remove();
                    that.data.model.set("userStatus","ENABLED");
                    var elNewRow = that.data.tableView.addNewRow(that.data.model); 
                    that.data.tableView.datatable.rows.add(elNewRow).draw();
                    that.data.tableView.filter(that.data.tableView.currentFilter);
                }else{
                    toastr.error(result.message);
                }
            }
        });
    }

});