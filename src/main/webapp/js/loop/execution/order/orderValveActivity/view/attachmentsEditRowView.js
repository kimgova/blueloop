var attachmentsEditRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/orderValveActivity/template/attachmentsEditRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#saveEditAttach").click(this,this.saveEditAttach);
        this.$el.find("#cancelEditAttach").click(this,this.cancelEditAttach);
    },
    
    saveEditAttach: function(e){
        if(e.data.validate(e.data.$el.find("#fileDescription").val())){
            e.data.model.set("description",e.data.$el.find("#fileDescription").val())
            e.data.saveDescription(e.data);
        }
    },
    
    cancelEditAttach: function(e) {
        e.data.tableView.datatable.rows(e.data.$el).remove();
        e.data.remove();
        
        var rowView = new attachmentsRowView( { model: e.data.model, tableView:e.data.tableView } );
        e.data.tableView.datatable.rows.add(rowView.render().$el).draw(); 
    },
    
    validate: function(description){
        var regexBlank  = /^\s*$/;
        var valid = true;
    
        if(description.trim() == "" || regexBlank.test(description)){
            toastr.error(json.file.errorEmptyDescription);
            valid = false;
        }
        
        return valid;
    },
    
    saveDescription: function(context) {
        var actData = {id:context.model.get("id"),description:context.model.get("description"),type:context.tableView.model.get("type")};
        var dataReturned = $.ajax({
            type: 'POST',
            url: '/blueloop/valve/changeAttachmentDescription/',
            data: JSON.stringify(actData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            beforeSend: function() { 
                $("body").addClass("loading");    
            },
            success: function(data, textStatus) {
                context.tableView.model.set("attachments",context.model.collection.toJSON());
                
                var tableView = new attachmentsTableView( { model: context.tableView.model, tableView:context.tableView } );
                context.$el.parents(".attachTable").html(tableView.render().$el);
                
                $("body").removeClass("loading");
                toastr.success(json.file.successMessage);
            },
            error: function(httpRequest, textStatus, errorThrown) {
                $("body").removeClass("loading");
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
            }
        });
    }
});