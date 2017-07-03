var teamworkTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/teamwork/template/teamworkTable.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        
        this.getTeamMembers();
        
        this.collection.each(this.addRow, this);
        
        this.initDatatable();
        
        this.setEvents();
        
        return this;
    },
    
    setEvents: function(){
        this.$el.find('#addUsersBtn').click(this, this.addUsersToTeam);
    },
    
    addRow: function(model) {
        var rowView = new teamMemberRowView( { model: model, parent:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    removeRow: function(member){
         this.parent.model.members.each(function(model,i){
            if(model != undefined){
                if(model.cid == member.cid){
                    this.parent.model.members.models.splice(i,1); 
                }
            }
        },this); 
        this.parent.resetDatatable();
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#teamworkTable').DataTable( {
            "autoWidth"        : false,
            "scrollCollapse": true,
            "paging"        : false,
            "processing"    : true,
            "destroy"        : true,
            "jQueryUI"        : false,
            "select"        : false,
            "columnDefs": [{ "orderable": false, "targets": [ 2,3] },
                           { "className": "center", "targets": [ 0,1,2,3 ] }]
        });    
    },
    
    getTeamMembers: function(){
        var listTeamwork    = ajaxCall('POST', '/blueloop/teamwork/getTeamworkForEditBB/',  JSON.stringify({id:this.team_id}), "text/json", "json", false);
        
        this.collection = new teamMemberCollection([]);
        
         _.each(listTeamwork.members,function(item,i){
            var model = new dataCategoryModel({ 
                          id: item.id_teamMember,
                          name: item.user.name,
                          user_id:item.user.id,
                          company: item.user.company,
                          role: item.role,
                          bbPermissions: item.bbPermissions
                        });
            this.collection.add(model);
        },this);
        
    },
    
    addUsersToTeam: function(e){
        $('#addTMemberModal').remove();
        var addMember = new addTMemberModalView({membersCollection:e.data.collection, tableView:e.data});
        addMember.render().$el.modal('show');
    },
    
    addNewTeamUser : function(model){
        var rowView = new teamMemberRowView( { model: model, parent:this } );
        this.datatable.rows.add(rowView.render().$el).draw();
        this.collection.add(model);
    }
});