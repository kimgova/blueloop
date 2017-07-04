var bbConnectionsPermissionsElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/workspace/connections/template/bbConnectionsPermissionsElementTemplate.ejs',
    
    
    initialize: function(){
    	_.bindAll(this, 'setPermission'); 
    },
    
     render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	var permission = this.model.get('permission');
    	if(permission == "checked"){
    		this.$el.find('#permission-checkbox').prop('checked', true);
    	}else{
    		this.$el.find('#permission-checkbox').prop('checked', false);
    	}
    	this.$el.find('#permission-checkbox').change(this, this.setPermission);
    	
        return this;
    },
    
    setPermission : function(){
    	if(this.model.get('permission')!='checked'){
    		this.model.set({permission: 'checked'});
    	}else{
    		this.model.set({permission: ''});
    	}
    	
    }
    
});
