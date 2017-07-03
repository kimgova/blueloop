var companyInfoViewMain = Backbone.View.extend({
    
    constructor : function (options) {
        _.extend(this, options);
    },
  
    render: function() {
        this.userInfoModel(this.getUserInfo());
        this.setEvents();
    },
    
    getUserInfo : function(){
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop/user/getUserInfo/',
            data: new Object(),
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
        this.model = new companyModel({
            id          : data.id,
            current_id  : data.current_id,
            company_name: data.company,
            country_id  : data.country_id,
            country_name: data.country_name,
            city_id     : data.city_id,
            city_name   : data.city_name,
            language_name: data.language,
            email       : data.email,
            path        : data.path,
            phone       : data.phone
        });
    },
    
    setEvents: function(){
        $("#btnEditProfile").click(this,this.showEditMode);
        $("#edit-pic").click(this,this.editPic);
        $("#inputFile").change(this,this.changePic);
    },
    
    showEditMode: function(e){
        var modalView = new companyInfoView({model:e.data.model,containerView:e.data.containerView});
        modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    editPic: function(e){
       $("#inputFile").trigger( "click" );
    },
    
    changePic: function(e){
        $("#formUpload").ajaxSubmit({
            async: true,
            url: "/blueloop/user/uploadFile", 
            beforeSubmit: function() { 
                $("body").addClass("loading");
            },
            success: function (data) {
                $("body").removeClass("loading");
                $('.ws-info-pic').attr("src", data.photoUrlUpload + "?" + new Date().getTime());
                $.ajax({type: 'GET', data: {fileName:data.filename}, url: '/blueloop/user/deleteImage/', dataType:"json", success: function(data, textStatus){ } });
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

$().ready(function() {
    window.companyProfile = new companyInfoViewMain();
    companyProfile.render();
});