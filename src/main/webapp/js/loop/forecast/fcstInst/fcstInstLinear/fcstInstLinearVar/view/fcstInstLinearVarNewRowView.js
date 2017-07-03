var fcInstLinearVarNewRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/template/fcstInstLinearVarNewRow.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find("#saveVar").click(this,this.saveVar);
        this.$el.find("#cancelVar").click(this,this.cancelVar);
        return this;
    },

    saveVar: function(e){
       var validate = e.data.validateInputs(e.data);
        if(!validate){
            return false;
        }
        var varSaved = JSON.parse(e.data.saveVarService(e));
        var model = new fcLinearVarModel({
            id:varSaved.id,
            date:varSaved.date,
            observation:varSaved.observation,
            value:varSaved.value,
            user:varSaved.user,
            disabled:"",
            planningId:e.data.planningId
        });
        
        forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).get("variationsList").push(varSaved);
        var newValue = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).get("variations") + varSaved.value;
        var newFinalTrade = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).get("finalTrade") + varSaved.value;
        forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).set("variations",newValue);
        forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).set("finalTrade",newFinalTrade);
        
        if(varSaved.custom == false){
            forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.planningId}).set("negociation",newFinalTrade);
        }
        
        var modelView = new fcInstLinearVarRowView( { model: model,userId:varSaved.user.id } );
        e.data.remove();
        $('#varTable tbody').append(modelView.render().$el);
        var linearTableView = new forecastInstLinearTableView({instanceId: 0, filters:[], categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val()});
        $('#linearTable').html(linearTableView.render().$el);
        linearTableView.initPagination();
    },

    saveVarService: function(e){
        var varData = {planningId:e.data.planningId,observation:e.data.$el.find("#observation").val(),value:e.data.$el.find("#value").val()};
        var dataReturned = $.ajax({
            type: 'POST',
            url: '/blueloop/fcstLinearPlan/saveVarLinearPlanning/',
            data: JSON.stringify(varData),
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
        return dataReturned.responseText;
    },
    
    cancelVar: function(e) {
        e.data.remove();
    },
    
    validateInputs: function(data){
        var regexNum    = /^(\d|-)?(\d|^,)*\.?\d*$/;
        var regexBlank  = /^\s*$/;
        var value       = data.$el.find("#value").val();
        var observation = data.$el.find("#observation").val();
        
        if(observation == "" || regexBlank.test(observation)){
            toastr.error(json.forecast.linearPlan.validate.emptyObs);
            return false;
        }
        
        if (value.indexOf(',') >= 0) {
            toastr.error(json.forecast.linearPlan.validate.decimalMark);
            return false;
        }else if (!regexNum.test(value)){
            toastr.error(json.forecast.linearPlan.validate.numericValue);
            return false;
        }else if(value == "" || regexBlank.test(value)){
            toastr.error(json.forecast.linearPlan.validate.emptyValue);
            return false;
        }
        
        return true;
    }

});