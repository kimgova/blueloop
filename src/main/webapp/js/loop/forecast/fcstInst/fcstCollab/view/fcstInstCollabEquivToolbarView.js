var equivToolbarView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabEquivToolbar.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getEquivListCollection();
        this.collection.each(this.addModel, this);
        return this;
    },
    
    getEquivListCollection: function(){
        var cont = 1;
        this.collection = new fcstCollabEquivCollection.getInstance({clean:true});
        _.each(this.retrieveEquivList(), function(item,i){
            if(i == "equivList" ){
                _.each(item, function(val,i){
                    var model = new fcstCollabEquivModel({})
                    model.set("id", cont);
                    model.set("unit", val.name);
                    this.collection.add(model);
                    cont ++;
                },this);
            }else{
                var model = new fcstCollabEquivModel({})
                model.set("id", cont);
                model.set("unit", item.name);
                model.set("isDefault", true);
                this.collection.add(model);
                cont ++;
            }
        },this);
    },
    
    retrieveEquivList: function(){
        var dataReturned = $.ajax({
            type: 'GET',
            url: "/blueloop-backend/fcstCollaborative/getEquiv/",
            data: {id:this.instanceId},
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                data = data;
            },
        error: function(httpRequest, textStatus, errorThrown) { 
            console.log("status=" + textStatus + " ,error=" + errorThrown);
            toastr.error(json.error.tryAgain);
            }
        });
        
        return dataReturned.responseJSON;
    },

    addModel: function(model) {
        var modelView = new fcstInstCollabEquivLabelView({model: model, instanceId:this.instanceId});
        this.$el.append(modelView.render().$el);
    }
});