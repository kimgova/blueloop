var orderValveActivityView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderValveActivity/template/activityTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.panelOpen = false;
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find(".expandAttachments").click(this,this.attachmentPanel);
        this.$el.find(".doneCheckbox").change(this,this.doneCheckboxChange);
    },
    
    attachmentPanel: function(e) {
        if(e.data.panelOpen == true){
            e.data.panelOpen = false;
            $(e.target).removeClass("fa-minus-circle").addClass("fa-plus-circle");
            e.data.$el.find("#actAttachments").slideToggle(100);
            
            e.data.$el.find("#actAttachments").removeClass("bordedAttachmentPanel");
            e.data.$el.find(".activityGeneralContent").removeClass("noBorded");
            
            e.data.$el.find(".attachTable").html("");
        }else{
            e.data.panelOpen = true;
            $(e.target).removeClass("fa-plus-circle").addClass("fa-minus-circle");
            e.data.$el.find("#actAttachments").slideToggle(100);
            
            e.data.$el.find("#actAttachments").addClass("bordedAttachmentPanel");
            e.data.$el.find(".activityGeneralContent").addClass("noBorded");
            
            var attachmentView = new attachmentsTableView({model:e.data.model, activityView:e.data});
            e.data.$el.find(".attachTable").append(attachmentView.render().$el);
        }        
    },
    
    updateAttachmentCount: function(totalAttachments){
    	this.$el.find(".totalAttachments").html("(" + totalAttachments + " " + json.activity.attachment + ")");
    },
    
    doneCheckboxChange: function(e){
    	if($(e.target).parent().find('input:checked').length > 0){ //checked
    		if(e.data.model.get("requireAttachments") == true && e.data.model.get("attachments").length == 0 ){
    			toastr.error(json.activity.errorCheckAttachments);
    			$(e.target).parent().find('input:checked').removeAttr('checked');
    		}else{
    			e.data.model.set("status", "checked");
    		}
        }else{ //unchecked
        	e.data.model.set("status", "");	
        }
    },
    
});