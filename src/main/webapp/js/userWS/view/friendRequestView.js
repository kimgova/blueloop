var friendRequestView = Backbone.View.extend({

    template : '/blueloop-backend/static/js/userWS/template/friendRequestTemplate.ejs',

    render : function() {
        this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
        
        this.setEvents();

        return this;
    },
    
    setEvents : function(){
        this.$el.find(".pendingRequestApprove").click(this, this.pendingRequestApprove);
        this.$el.find(".pendingRequestSend").click(this, this.pendingRequestSend);
        this.$el.find(".sendRequest").click(this, this.sendRequest);
        this.$el.find(".close").click(this, this.close);
    },
    
    sendRequest : function(context){
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/user/connetUsers/',
            data: {userConnId : context.data.model.get("id")},
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                data =  data;
                context.data.model.set("pendingRequestSend",true);
                context.data.$el.remove();
                toastr.success("Connection Request Sent");
            },
            error: function(httpRequest, textStatus, errorThrown) { 
               console.log("status=" + textStatus + " ,error=" + errorThrown);
               toastr.error(json.error.tryAgain);
            }
        });
    },
    
    pendingRequestApprove : function(context){
        console.info("pendingRequestApprove")
    },
    
    pendingRequestSend : function(context){
        console.info("pendingRequestSend")
    },
    
    close : function(context){
        context.data.$el.remove();
    }

});