var forecastInstanceRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/main/template/fcstInstRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#editInstace").click(this,this.editRow);
        this.$el.find("#selectBudget").click(this,this.selectBudget);
        this.$el.find("#checkActivities").click(this,this.checkUActivities);
        this.$el.find("#viewForecast").click(this,this.viewForecast);
        this.$el.find("#signOff").click(this,this.signOff);
        this.$el.find("#deleteInstance").click(this,this.deleteRow);
    },
    
    editRow: function(e) {
        // this view is a clone (pagination), this.$el must be reset with the event target parent (tr)
        e.data.$el =  $(e.target).parent().parent().parent() 
        var editView = new forecastInstanceEditRowView( { model: e.data.model } );
        e.data.$el.html(editView.render().$el);
    },
    
    checkUActivities: function(e){
        $("#forecast-inst-act").remove();
        var modelView = new forecastInstActModalView( { model:e.data.model } );
        modelView.render().$el.modal("show");
    },
    
    viewForecast: function(e){
        localStorage.setItem("chainTitle",e.data.model.get("chainTitle"))
        localStorage.setItem("instanceTitle",e.data.model.get("name"))
        window.location.href = '#forecastInstance/' + e.data.model.get("forecastId") + '/' + e.data.model.id;
    },
    
    selectBudget: function(e){
        if(e.data.model.get('haveBudget') == false){
            toastr.error(json.forecast.budget.errorBudget);
        }else{
            $("#fcst-instance-budget-modal").remove();
            var modelView = new fcstInstBudgetModalView( { model:e.data.model } );
            modelView.render().$el.modal("show");
        }
    },
    
    signOff: function(e){
        var signOffData = {id:e.data.model.attributes.id};
        var forecastId =  e.data.model.attributes.forecastId;
        e.preventDefault();
        bootbox.confirm(json.forecast.confirmSignOff, function (e) {
            if (e) {
                var dataReturned = $.ajax({
                    type: 'POST',
                    url: '/blueloop/forecast/signOffInstance/',
                    data: JSON.stringify(signOffData),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function(data, textStatus) {
                        data = data;
                        
                        var tableView = new forecastInstanceTableView({ forecastId:forecastId});
                        $('#tableInstancesContent').html(tableView.render().$el);
                        tableView.setPagination();
                    },
                    error: function(httpRequest, textStatus, errorThrown) { 
                        console.log("status=" + textStatus + " ,error=" + errorThrown);
                        toastr.error(httpRequest.responseJSON.error);
                    }
                });
            } else {
                return;
            }
        });
    },
    
    deleteRow: function(e){
        var instanceData = {id:e.data.model.attributes.id};
        var forecastId   =  e.data.model.attributes.forecastId;
        bootbox.confirm(json.general.deleteRow, function (e) {
            if (e) {
                var dataReturned = $.ajax({
                    type: 'POST',
                    url: '/blueloop/forecast/deleteFcstInstance/',
                    data: JSON.stringify(instanceData),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function(data, textStatus) {
                        data = data;
                        
                        var tableView = new forecastInstanceTableView({ forecastId:forecastId});
                        $('#tableInstancesContent').html(tableView.render().$el);
                        tableView.setPagination();
                        toastr.success(json.forecast.deletePlanning)
                    },
                    error: function(httpRequest, textStatus, errorThrown) { 
                        console.log("status=" + textStatus + " ,error=" + errorThrown);
                        toastr.error(httpRequest.responseJSON.error);
                    }
                });
            } else {
                return;
            }
        });
    }

});