var userWSInfoView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/userWS/template/userWSInfoViewTemplate.ejs',
    
    initialize: function(){
        this.userId;
        
    },
    
    constructor : function (options) {
        _.extend(this, options);
    },
  
    render: function() {
        this.userInfoModel(this.getUserInfo());
        this.model.set("formType",this.userId);
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        
        var footerTemplate;
        if(this.userId!='profile'){
            footerTemplate = '/blueloop-backend/static/js/userWS/template/WSInfoFooterContactTemplate.ejs';
            var footer = $(new EJS({url: footerTemplate }).render(this.model.toJSON()));
            this.$el.find('#ws-info-footer').append(footer);
        }else{
            footerTemplate = '/blueloop-backend/static/js/userWS/template/WSInfoFooterTemplate.ejs';
            var footer = $(new EJS({url: footerTemplate }).render());
            this.$el.find('#ws-info-footer').append(footer);
        }
        this.setChat();
        this.setEvents();
        
        return this;
    },
    
    getUserInfo : function(){
        var currentPath = location.pathname;
        this.userId = currentPath.substr(currentPath.lastIndexOf('/') + 1);
        
        var jsonObject = new Object();
        
        if(this.userId!='profile'){
            jsonObject.userId = this.userId; 
        }

        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/user/getUserInfo/',
            data: jsonObject,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                data =  data;
            },
            error: function(httpRequest, textStatus, errorThrown) { 
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
             }
        });
        
        return dataReturned.responseJSON; 
    },

    userInfoModel : function(response) {
        var data = response.userContactInstance;
        this.model = new userWSInfoModel({
            id          : data.id,
            path        : data.path,
            firstName   : data.firstName,
            lastName    : data.lastName,
            lastSeen    : data.lastSeen,
            email       : data.email,
            phone       : data.phone,
            areaCode    : data.areaCode,
            company     : data.company,
            countryId   : data.country_id,
            country     : data.country_name,
            department  : data.department,
            occupation  : data.occupation,
            current_id  : data.current_id
        });
    },
    
    setEvents: function(){
        this.$el.find("#btnEditProfile").click(this,this.showEditMode);
        this.$el.find(".startChatting").click(this,this.startChatting);
        this.$el.find("#edit-pic").click(this,this.editPic);
        this.$el.find("#inputFile").change(this,this.changePic);
    },
    
    showEditMode: function(e){
        var modalView = new userWSEditInfoView({model:e.data.model,containerView:e.data.containerView});
        modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    setChat: function(){
    	var model = new singleChatModel({	
  		  	  userId: this.model.get("id"),
    		  firstName: this.model.get("firstName"),
    		  lastName: this.model.get("lastName"),
    		  channel: "",
    		  type: 2,
    		  path: this.model.get("path")
		});
    	this.modelChat = model;
    },
    
    startChatting: function(e){
    	var model = e.data.modelChat.attributes;
    	chat.createChatFromPanel(model.chatId, model.userId, model.firstName, model.channel, $(e.data))
    	e.data.modelChat.set({count: 0}); 
    	e.data.modelChat.set({state: 1});
    	chatView.unreadMessagesCount();
    },
    
    editPic: function(e){
    	e.data.$el.find("#inputFile").trigger( "click" );
    },
    
    changePic: function(e){
    	e.data.$el.find("#formUpload").ajaxSubmit({
            async: true,
            url: "/blueloop-backend/user/uploadFile", 
            beforeSubmit: function() { 
            	$("body").addClass("loading");    
 			},
            success: function (data) {
            	$("body").removeClass("loading");
                e.data.$el.find('.ws-info-pic').attr("src", data.photoUrlUpload + "?" + new Date().getTime());
		    	$.ajax({type: 'GET', data: {fileName:data.filename}, url: '/blueloop-backend/user/deleteImage/', dataType:"json", success: function(data, textStatus){ } });
		    	toastr.success(data.message);	
            },
            error: function(httpRequest, textStatus, errorThrown) { 
               $("body").removeClass("loading");
 	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
 	     	   toastr.error(httpRequest.responseJSON.error);
 	     	}
        });
    }
    
});