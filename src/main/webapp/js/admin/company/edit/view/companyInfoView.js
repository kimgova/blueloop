var companyInfoView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/company/edit/template/companyInfoTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
  
    initialize: function(){
        this.country_id = null;
        this.city_id    = null;
        this.languageList = null;
    },
    
    render: function() {
        $("#companyInfoModal").remove();
        this.getCountries();
        this.$el = $(new EJS({url: this.template }).render({user:this.model.toJSON(),countries:this.countries,cyties:this.cyties,city_id:this.city_id,country_id:this.country_id,languageList:this.languageList}));
        this.setEvents();
        return this;
    },
    
    getCountries: function(){
        var data = ajaxCall('GET','/blueloop-backend/city/getLocationInfo/', {}, "text/json", "json", false);
        this.countries = data.countries;
        this.cyties    = data.cities;
        this.languageList = data.languageList;
        if(data.defaultCountry){
            this.country_id   = data.defaultCountry;
        }
        if(data.defaultCity){
            this.city_id      = data.defaultCity;
        }
        this.loadTimeZone();
    },
    
    setEvents: function(){
        this.$el.find("#btnSaveInfo").click(this,this.saveUserInfo);
        this.$el.find("#country").change(this,this.loadCityList);
    },
    
    saveUserInfo: function(e){
        var userData = $(e.data.$el).find("form").serializeObject();
        userData.id = e.data.model.id;
        var data = $.ajax({
            type: 'POST',
            url: '/blueloop-backend/administrator/updateInfo/',
            data: JSON.stringify(userData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            beforeSend : function() {
                $("body").addClass("loading");
            },
            success: function(data, textStatus) {
                toastr.success(json.user.saved);
                e.data.model.set("company_name",data.comp_name);
                e.data.model.set("country_id",data.country_id);
                e.data.model.set("country_name",data.country_name);
                e.data.model.set("city_id",data.city_id);
                e.data.model.set("city_name",data.city_name);
                e.data.model.set("language_id",data.language_id);
                e.data.model.set("language_name",data.language_name);
                e.data.model.set("email",data.email);
                
                $("#comp_name").html(data.comp_name);
                $("#comp_country").html(data.country_name);
                $("#comp_city").html(data.city_name);
                $("#comp_language").html(data.language_name);
                $("#comp_timezone").html(data.comp_timezone);
                e.data.$el.remove();
                $("body").removeClass("loading");
            },
            error: function(httpRequest, textStatus, errorThrown) {
                $("body").removeClass("loading");
                toastr.error(httpRequest.responseJSON.error);
            }
        });
    },
    
    loadTimeZone: function(){
        var that = this;
        jQuery.ajax({
            type : 'POST',
            url : '/blueloop-backend/administrator/getSelectTimezone',
            success : function(data, textStatus) {
                that.$el.find(".timezone").html(data);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                console.info("Error getting select of timezone");
            }
        });
    },
    
    loadCityList: function(data){
        var that = data;
        var id =$("#country option:selected").val();
        jQuery.ajax({
            type : 'GET',
            data:{id:id},
            url : '/blueloop-backend/city/getCities',
            success : function(data, textStatus) {
                that.data.$el.find(".city").html(data);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                console.info("Error getting select of timezone");
            }
        });
    }
});