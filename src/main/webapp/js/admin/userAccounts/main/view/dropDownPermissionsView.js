var dropDownPermissionsView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/userAccounts/main/template/dropDownTemplate.ejs',
    
     render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.loadPermissions();
        this.collection.each(this.appendPermission, this);
        
        return this;
    },
    
    loadPermissions: function(){
        this.collection = new componentCollection([]);
        _.each(COMPONENTPERMISSIONENUM,function(item,i){
            var model = new componentModel({ 
                          id: item.value,
                          name: item.text,
                          id_user:this.model.get("id")
                        });
            this.collection.add(model);
        },this);
        
        this.setPermissions();
    },
    
    appendPermission: function(model) {
        var modelView = new dropDownElementView( {model: model} );
        this.$el.find(".permissions-dropdown").append(modelView.render().$el);
    },
    
    setPermissions: function(){
        _.each(this.model.get("permissions"),function(item,i){
            this.collection.findWhere({id:item.id}).set("checked","checked"); 
        },this);
    }
    
});