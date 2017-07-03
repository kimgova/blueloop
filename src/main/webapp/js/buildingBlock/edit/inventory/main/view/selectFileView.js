var selectFileView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/inventory/main/template/selectFileModal.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render());
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#selectFile").click(this,this.uploadFile);
    },
    
    uploadFile: function(e){
        if(e.data.validateFile()){
            e.data.submitForm($("#formUploadInventory"), "/blueloop/loadFile/uploadInventoryFile", e.data )
        }else{
            toastr.error(json.forecast.budget.format);
        }
    },
    
    submitForm: function(formObj, url, view) {
        var params = this.model.toJSON();
        var that = this;
        $(formObj).ajaxSubmit({
            data: params,
            async: true,
            url: url,
            beforeSubmit: function() { 
                $("body").addClass("loading");
            },
            success: function (data) {
                $("body").removeClass("loading"); 
                toastr.success(json.forecast.budget.submitted);
                that.model.set("file_name",data.fileName);
                that.model.set("upload_date",data.date);
                that.selectFile(that);
            },
            error: function(httpRequest, textStatus, errorThrown) { 
                $("body").removeClass("loading"); 
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(httpRequest.responseJSON.message);
              }
        });
    },
    
    validateFile: function(){
        var valid = false;
        var allowed_extensions = new Array(".xls", ".xlsx"); 
        
        var fileName = $("#inputFileInventory").val();
        var extension = (fileName.substring(fileName.lastIndexOf("."))).toLowerCase();
        
        for (var i = 0; i < allowed_extensions.length; i++) {
            if (allowed_extensions[i] == extension) {
                valid = true;
                break;
            }
         } 
        
        return valid;
    },
    
    selectFile: function(e){
    	var data = ajaxCall('GET','/blueloop/loadFile/processInventoryFile/', {idBB:e.model.get("bb_id"),fileName:e.model.get("file_name")}, "text/json", "json", false);
		
		if(data.success){
			var invView = new inventoryTableView({idBB:e.model.get("bb_id")});
			$("#uploadInventory-content").html(invView.render().$el);
	        e.$el.modal("hide");
			toastr.success(data.message);
		}else{
			toastr.error(data.message);
		}
    },

});