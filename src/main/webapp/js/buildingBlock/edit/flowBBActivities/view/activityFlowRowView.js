var activityFlowRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/flowBBActivities/template/row_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find(".editAct").click(this,this.editAct);
        this.$el.find(".deleteAct").click(this,this.deleteAct);
    },
    
    editAct: function(e) {
        var rowView = new editActivityFlowRowView({model:e.data.model, tableView:e.data.tableView});
        e.data.tableView.datatable.row.add(rowView.render().$el).draw();
        e.data.tableView.datatable.rows(e.data.$el).remove().draw();
    },
    
    deleteAct: function(e){
        var that = e; 
        bootbox.confirm(json.activity.confirmDel +' "'+ that.data.model.get('name') + '" ?', function (e) {
            if (e) {
                var authorizationToken = $("meta[name='_csrf']").attr("content");
                var authorizationUri   = $("meta[name='_csrf_header']").attr("content");
                var result= $.ajax({
                    type: 'POST',
                    beforeSend: function (request)
                    {
                        request.setRequestHeader("authorizationToken", authorizationToken);
                        request.setRequestHeader("authorizationUri", authorizationUri);
                    },
                    url: '/blueloop/activityBuildingBlock/deleteActivityFlowBB/',
                    data: JSON.stringify({id:that.data.model.id}),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function(data, textStatus) {
                        toastr.success(json.activity.deleted);
                        that.data.tableView.datatable.rows(that.data.$el).remove().draw();
                    },
                    error: function(httpRequest, textStatus, errorThrown) { 
                       console.log("status=" + textStatus + " ,error=" + errorThrown);
                       toastr.error(json.activity.notDeleted + ". " + httpRequest.responseJSON.error);
                    }
                });
            }
        });
    }
});