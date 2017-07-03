var dropDownElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/userAccounts/main/template/dropDownElementTemplate.ejs',
    
    initialize: function(){
        _.bindAll(this, 'setPermission'); 
    },
    
     render: function() {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find('.md-check').change(this, this.setPermission);
        
        return this;
    },
    
    setPermission : function(){
        if(this.model.get('checked')!='checked'){
            this.model.set({checked: 'checked'});
        }else{
            this.model.set({checked: ''});
        }
        var data = {model:this.model.toJSON()};
        var dataAjax = ajaxCall('POST', '/blueloop/administrator/saveUserPermissions/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
        toastr.success(json.bb.permissionsSaved);
    }
    
});
