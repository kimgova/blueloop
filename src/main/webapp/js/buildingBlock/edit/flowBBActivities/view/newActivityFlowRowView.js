var newActivityFlowRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/flowBBActivities/template/newRow_template.ejs',
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#saveActFlow").click(this,this.saveActFlow);
        this.$el.find("#cancelActFlow").click(this,this.cancelNewActFlow);
        this.$el.find("#imgFlowSelect").click(this,this.chooseImg);
    },
    
    saveActFlow: function(e){
        var actFlowName = e.data.$el.find("#actFlowName").val();
        var authorizationToken = $("meta[name='_csrf']").attr("content");
        var authorizationUri   = $("meta[name='_csrf_header']").attr("content");
        
        if(e.data.validate(actFlowName, e.data.model)){
            var dataActivity = new Object();
            dataActivity.description = actFlowName;
            dataActivity.img  = e.data.model.get("fileName");
            dataActivity.bb_id  = e.data.tableView.bb_id;

            var result= $.ajax({
                type: 'POST',
                beforeSend: function (request)
                {
                    request.setRequestHeader("authorizationToken", authorizationToken);
                    request.setRequestHeader("authorizationUri", authorizationUri);
                },
                url: '/blueloop/activityBuildingBlock/saveActivityFlowBB/',
                data: JSON.stringify(dataActivity),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function(data, textStatus) {
                    toastr.success(json.activity.savedSuccessfully);
                    e.data.model.set("id",data.activity.id);
                    e.data.model.set("name",data.activity.description);
                    e.data.model.set("imageURI",e.data.model.get("filePath"));
                    
                    e.data.tableView.collection.push(e.data.model);
                    var row = e.data.tableView.addNewRow(e.data.model);
                    e.data.tableView.datatable.row(e.data.$el).remove();
                    e.data.tableView.datatable.row.add(row).draw().node();
                    e.data.remove();
                },
                error: function(httpRequest, textStatus, errorThrown) { 
                   console.log("status=" + textStatus + " ,error=" + errorThrown);
                   toastr.error(json.bbalerts.errorSaving);
                }
                    
            });
        }
    },
    
    validate: function(actFlowName, model){
        var valid = true;
        if(actFlowName.trim() == "" || /^\s*$/.test(actFlowName)){
            toastr.error(json.activity.emptyName);
            valid = false;
        }
        
        if(!model || !model.get("fileName")) {
            toastr.error(json.activity.selectImg);
            valid = false;
        }
        return valid;
    },
    
    cancelNewActFlow: function(e) {
        e.data.tableView.datatable.rows(e.data.$el).remove().draw();
        e.data.remove();
    },
    
    chooseImg: function(e){
        $("#image_chooser_modal").remove();
        var model = new activityFlowModel();
        e.data.model = model;
        var modalView = new imageChooserModalView({context:e.data, imageType:2});
        modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    setSelectedImage: function(modelImage,context){
        var templateImg = "/blueloop/static/js/buildingBlock/edit/flowBBActivities/template/btnChooseImg.ejs";
        context.$el.find(".imgNewFlowDiv").html($(new EJS({url: templateImg }).render({fileName:modelImage.get("key"),filePath:modelImage.get("filePath")})));
        context.$el.find("#imgFlowSelect").click(context,context.chooseImg);
        
        context.model.set("fileName",modelImage.get("key"));
        context.model.set("filePath",modelImage.get("filePath"));
        
        //context.$el.find(".imgNewFlowDiv").html(new EJS({url: templateImg }).render({fileName:modelImage.get("key"),filePath:modelImage.get("filePath")}));
    }
});