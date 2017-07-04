var fcstEditNameView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstEditName.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveFcstName").click(this,this.saveName);
        return this;
    },
    
    saveName: function(e){
        var newname = e.data.$el.find("#newNameFcst").val();
        var dataModel = JSON.parse(e.data.editName(e.data.model, newname));
        if(dataModel.error){
            toastr.error(json.error.tryAgain);
        }else{
            e.data.model.set("name", newname);
            e.data.viewRow.find("b").text(newname);
            toastr.success(json.forecast.tooltips.changeName);
            $("#editNameModal").remove();
        }
    },
    
    editName: function(model,newname){
        var model = {id:model.id,name:newname};
        var dataReturned = $.ajax({
            type: 'POST',
            url: '/blueloop/forecast/saveForecastName/',
            data: JSON.stringify(model),
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
    }

});