var dropDownPermissionsView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/teamwork/template/dropDownTemplate.ejs',
    
     render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.loadPermissions();
        this.collection.each(this.appendPermission, this);
        
        return this;
    },
    
    loadPermissions: function(){
        this.collection = new dataCategoryCollection([]);
        _.each(BB_DATA_CATEGORY,function(item,i){
            var model = new dataCategoryModel({ 
                          id: item.value,
                          name: (this.model.get("bb_category") == "Flow" && item.value == 5) ? "Activities" :item.message,
                          id_team_member:this.model.get("id")
                        });
            
            if(this.model.get("bb_category") == "Flow" && item.value == 8){
                return;
            }
            this.collection.add(model);
        },this);
        
        this.setPermissions();
    },
    
    appendPermission: function(model) {
        var modelView = new dropDownElementView( {model: model} );
        this.$el.find(".permissions-dropdown").append(modelView.render().$el);
    },
    
    setPermissions: function(){
        this.collection.findWhere({id:1}).set("checked","checked");
        this.collection.findWhere({id:1}).set("disabled","disabled");
        _.each(this.model.get("bbPermissions"),function(item,i){
            this.collection.findWhere({id:item.id}).set("checked","checked"); 
        },this);
    }
    
});