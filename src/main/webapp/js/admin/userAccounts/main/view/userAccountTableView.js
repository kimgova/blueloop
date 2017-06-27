var userAccountView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/userAccounts/main/template/userAccountTableTemplate.ejs',
    
    currentFilter : ['ENABLED'],

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getUsers();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        this.setEvents();
        this.filter(['ENABLED']);
        return this;
    },
    
    setEvents: function(){
    	 this.$el.find("#add_user").click(this,this.addUserForm);
    	 this.$el.find('#filter li').click(this,this.changeFilter);
    },
    
    addUserForm: function(e){
		$("#new-user-modal").remove();	
    	var modalView = new createUserModalView({tableView:e.data});
    	modalView.render().$el.modal("show");
	},
    
    getUsers: function(){
        this.collection = new userCollection([]);
        var result = ajaxCall('GET', '/blueloop-backend/administrator/getUsersByCompany/', {}, "text/json", "json", false);

        _.each(result,function(item,i){   
            var user = new userModel({
                id          : item.id,
                name        : item.name,
                email       : item.email,
                lastLogin   : item.lastLogin,
                image       : item.image,
                permissions : item.permissions,
                bbs         : item.bbCount,
                loops       : item.loopCount,
                countFlow   : item.countFlow,
                userStatus  : item.userStatus
            });
            this.collection.push(user);
        },this);
    },

    addRow: function(model) {
        var rowView = new userAccountRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    addNewRow: function(model) {
        var rowView = new userAccountRowView( { model: model, tableView:this } );
        return rowView.render().$el;
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#usersTable').DataTable( {
            "autoWidth"     : false,
            "scrollCollapse": true,
            "paging"        : true,
            "pageLength": 5,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "processing"    : true,
            "destroy"       : true,
            "jQueryUI"      : false,
            "select"        : false,
            "columnDefs": [{ "orderable": false, "targets": [ 0,3,5 ] },
                           { "className": "center", "targets": [ 0,1,2,3,4,5 ] }]
        }); 
    },
    
    changeFilter: function(e){
        e.data.$el.find(".selectedFilter").html($(e.target).html());
        if(e.target.id === 'filter-enabled'){
            e.data.currentFilter = ['ENABLED'];
            e.data.filter(['ENABLED']);
        }else if(e.target.id === 'filter-disabled'){
            e.data.currentFilter = ['DISABLED'];
            e.data.filter(['DISABLED']);
        }else if(e.target.id === 'filter-all'){
            e.data.currentFilter = ['ENABLED', 'DISABLED'];
            e.data.filter(['ENABLED', 'DISABLED']);
        }
    },
    
    filter : function(values) {
        $.fn.dataTableExt.afnFiltering.push(function(settings, data, dataIndex) {
            for (i = 0; i < values.length; i++) {
                if (data[5] == values[i]) {
                    return true;
                }
            }
            return false;
        });
        this.datatable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    }
});

$().ready(function() {
    var userAccountTableView = new userAccountView();
    $("#users_accounts_table").append(userAccountTableView.render().$el)
});