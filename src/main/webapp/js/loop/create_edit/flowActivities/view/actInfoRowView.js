var actInfoRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/create_edit/flowActivities/template/act_info_row_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render({model:this.model,team_members:this.team_members}));
        this.setEvents();
        this.fitFont();
        this.setResponsible();
        return this;
    },
    
    setEvents: function(){
        this.$el.find('.sp1').change(this, this.changeResponsible);
        this.$el.find('.sp2').change(this, this.changeLeadType);
        this.$el.find('#act_lead_time').change(this, this.changeLeadTime);
        this.$el.find(".selectpicker").selectpicker();
    },
    
    setResponsible: function(){
        var option  = this.$el.find(".sp1 option:selected").val();
        this.model.set("responsible",parseInt(option));
        var option2 = this.$el.find(".sp2 option:selected").val();
        this.model.set("leadTimeType",parseInt(option2));
    },
    
    changeResponsible: function(e){
        var option = e.data.$el.find(".sp1 option:selected").val();
        e.data.model.set("responsible",parseInt(option));
    },
    
    changeLeadType: function(e){
        var option = e.data.$el.find(".sp2 option:selected").val();
        e.data.model.set("leadTimeType",parseInt(option));
    },
    
    
    changeLeadTime: function(e){
        var option = e.data.$el.find("#act_lead_time").val();
        if(e.data.validLeadTime(option,e.data.$el)){
            e.data.$el.find("#act_lead_time").parent().removeClass("has-error");
            e.data.$el.find(".error").removeClass("show").addClass("invisible").text("");
            e.data.model.set("leadTime",parseInt(option));
        }else{
            e.data.$el.find("#act_lead_time").parent().addClass("has-error");
            e.data.$el.find(".error").removeClass("invisible").addClass("show");
        }
    },
    
    fitFont: function(){
        if( this.model.get("description").length > 45){
            this.$el.find('.act_des label').css('font-size',"0.8em");
        }
    },
    
    validLeadTime : function(option,label){
        var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;     
        var regexBlank  = /^\s*$/;
        var regexNumPositive = /^([0-9])*[.]?[0-9]*$/;
        
        if(option.trim() == "" || regexBlank.test(option)){
            toastr.error(json.flowActivities.errorEmptyLeadTime);
            label.find(".error").txt = json.flowActivities.errorEmptyLeadTime;
            return false;
        }
        
        if (!regexNum.test(option.trim())){
            toastr.error(json.flowActivities.errorNumericLeadTime);
            label.find(".error").text(json.flowActivities.errorNumericLeadTime);
            return false;
        }
        
        if (!regexNumPositive.test(option.trim())){
            toastr.error(json.flowActivities.errorPositiveLeadTime);
            label.find(".error").text(json.flowActivities.errorPositiveLeadTime);
            return false;
        }
        
        if (option == 0){
            toastr.error(json.flowActivities.errorZeroLeadTime);
            label.find(".error").text(json.flowActivities.errorZeroLeadTime);
            return false;
        }
        
        return true;
    }
});