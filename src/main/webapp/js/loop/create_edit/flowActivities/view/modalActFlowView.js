var modalActFlowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/flowActivities/template/modal_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.selectedActCollection = selectedFlowActCollection.getInstance({});
        this.collection            = new flowActivityCollection([]);
        this.setFirstStep("next");
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#next").click(this,this.next);
        this.$el.find("#back").click(this,this.back);
        this.$el.find("#finish").click(this,this.next);
        this.$el.find("#closeModal").click(this,this.closeModal);
    },
    
    next: function(e){
        switch(e.data.step) {
            case 1:
                e.data.setStepTwoSelectActivity("next");
                break;
            case 2:
                if(e.data.collection.where({checked:"checked"}).length == 0){
                    toastr.error(json.flowActivities.selectActivities);
                }else{
                    e.data.setStepThreeInfoView("next");
                }
                break;
            case 3:
                if(e.data.validLeadTime()){
                    e.data.setLastStep("next");
                }
                break;
        }
    },
    
    back: function(e){
        switch(e.data.step) {
            case 2:
                e.data.setFirstStep("back");
                break;
            case 3:
                e.data.setStepTwoSelectActivity("back");
                break;
            case 4:
                e.data.setStepThreeInfoView("back");
                break;
        }
    },
    
    setFirstStep: function(action){
        this.step = 1;
        if(action == "next"){
            this.$el.find("#step-1").addClass("mt-element-step-green");
            this.$el.find("#step-1").removeClass("mt-element-step");
        }else{
            this.setStepColor("#step-2","#step-line-1",action);
        }
        this.$el.find("#back").hide();
        var view = new stepOneStartView();
        this.$el.find('#content').html(view.render().$el);
    },
    
    setStepTwoSelectActivity: function(action){
        this.step = 2;
        if(action == "next"){
            this.setStepColor("#step-2","#step-line-1",action);
        }else{
            this.setStepColor("#step-3","#step-line-2",action);
            this.$el.find("#next").show();
            this.$el.find("#finish").hide();
        }
        this.$el.find("#back").show();
        var view = new stepTwoSelectActivityView({model:this.model,collection:this.collection,selectedActCollection:this.selectedActCollection,valve:this.valve});
        this.$el.find('#content').html(view.render().$el);
        
    },
    
    setStepThreeInfoView: function(action){
        this.step = 3;
        if(action == "next"){
            this.setStepColor("#step-3","#step-line-2",action);
            this.$el.find("#next").hide();
            this.$el.find("#finish").show();
        }else{
            this.setStepColor("#step-4","#step-line-3",action);
        }
        
        var view = new stepThreeInfoView({model:this.model,collectionModels:this.collection.where({checked:"checked"}),selectedActCollection:this.selectedActCollection});
        this.$el.find('#content').html(view.render().$el);
    },
    
    setLastStep: function(action){
        this.step = 4;
        this.setStepColor("#step-4","#step-line-3",action);
        this.$el.find("#finish").hide();
        this.$el.find("#back").hide();
        this.finish();
        var view = new stepFourActFlow();
        this.$el.find('#content').html(view.render().$el);
    },
    
    setStepColor: function(step,line,action){
        if(action == "next"){
            this.$el.find(step).removeClass("mt-element-step");
            this.$el.find(step).addClass("mt-element-step-green");
            this.$el.find(line).removeClass("step-line");
            this.$el.find(line).addClass("step-line-green");
        }else{
            this.$el.find(step).removeClass("mt-element-step-green");
            this.$el.find(step).addClass("mt-element-step");
            this.$el.find(line).removeClass("step-line-green");
            this.$el.find(line).addClass("step-line");
        }
    },
    
    finish: function(){
        _.each(this.collection.where({checked:"checked"}),function(item,i){
            var modelAct = selectedFlowActCollection.getInstance({}).findWhere({id_flow_bb:item.get("id_flow_bb"),valve:this.valve,id_activity:item.get("id_activity")});
            if(modelAct){
                modelAct.set("leadTime",item.get("leadTime"));
                modelAct.set("leadTimeType",item.get("leadTimeType"));
                modelAct.set("responsible",item.get("responsible"));
            }else{
                item.set("valve",this.valve);
                selectedFlowActCollection.getInstance({}).push(item);
            }
        },this);
        
        _.each(this.collection.where({checked:""}),function(item,i){
            var modelAct = selectedFlowActCollection.getInstance({}).findWhere({id_flow_bb:item.get("id_flow_bb"),valve:this.valve,id_activity:item.get("id_activity")});
            if(modelAct){
                selectedFlowActCollection.getInstance({}).remove(modelAct);
            }
        },this);

    },
    
    closeModal: function(context){
        $("#flowActivitiesModal").remove();
        $("#form-valve-tooltip").remove();
    },
    
    validLeadTime : function(option,label){
        var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;     
        var regexBlank  = /^\s*$/;
        var regexNumPositive = /^([0-9])*[.]?[0-9]*$/;
        var valid = true;
        
        $("input[name='act_lead_time']").each(function() {
            var option = this.value;
            var message = "";
            if(option.trim() == "" || regexBlank.test(option)){
                message = json.flowActivities.errorEmptyLeadTime;
                valid   = false;
            }
            
            if (!regexNum.test(option.trim()) && valid){
                message = json.flowActivities.errorNumericLeadTime;
                valid   = false;
            }
            
            if (!regexNumPositive.test(option.trim()) && valid){
                message = json.flowActivities.errorPositiveLeadTime;
                valid   = false;
            }
            
            if (option == 0 && valid){
                message = json.flowActivities.errorZeroLeadTime;
                valid   = false;
            }
            
            if(!valid){
                $(this).parent().addClass("has-error");
                $(this).parents(".col-lg-4").find(".error").removeClass("invisible").addClass("show");
                $(this).parents(".col-lg-4").find(".error").text(message);
            }
        });
        
        return valid;
    }
});