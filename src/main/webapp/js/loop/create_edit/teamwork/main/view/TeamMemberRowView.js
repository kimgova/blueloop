var TeamMemberRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/teamwork/main/template/TeamMemberRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#removeMember").click(this,this.removeMember);
        this.$el.find(".roleCheckbox").click(this,this.roleCheckboxChange);
        this.$el.find(".layerCheckbox").change(this,this.layerCheckboxChange);
        this.$el.find(".viewerCheckbox").change(this,this.viewerCheckboxChange);
    },
    
    removeMember: function(e) {
    	bootbox.confirm(json.teamwork.confirmMemberRemove, function(event){          
            if(event){
                var model = new addTMemberModel({
                    id:e.data.model.get("idUser"), name:e.data.model.get("name"), company:e.data.model.get("company")
                });
                
                addTMemberCollection.getInstance({}).add(model);
                
                e.data.parent.removeRow(e.data.model);
            }
        });
    },
    
    roleCheckboxChange: function(e) {
        if($(e.target).parent().find('input:checked').length > 0){ //checked
        	e.data.model.attributes.roles.push({id:0,roleName:$(e.target).val()});
        }else{ //unchecked
        	e.data.removeRole(e.data.model,$(e.target).val());	
        }
    },
    
    removeRole(model, roleName){
    	_.each(model.get('roles'),function(role,i){
    		if(role != undefined){
    			if(role.roleName == roleName)
    				model.attributes.roles.splice(i,1);	
    		} 
		},this); 
    },
    
    layerCheckboxChange: function(e) {
        if($(e.target).parent().find('input:checked').length > 0){ //checked
        	e.data.model.attributes.layers.push({name:$(e.target).val()});
        }else{ //unchecked
        	e.data.removeLayer(e.data.model,$(e.target).val());	
        }
    },
    
    removeLayer(model, layerName){
    	_.each(model.get('layers'),function(layer,i){
    		if(layer != undefined){
    			if(layer.name == layerName)
    				model.attributes.layers.splice(i,1);	
    		} 
		},this); 
    },
    
    viewerCheckboxChange: function(e) {
    	var parentTr = $(e.target).parent().parent().parent();
    	var idUser = e.data.model.attributes.idUser;
    	var checkboxOrder = parentTr.find('input#checkboxOrderResponsible'+idUser);
    	var checkboxGeneral = parentTr.find('input#checkboxLayerGeneral'+idUser);
    	var checkboxRisk = parentTr.find('input#checkboxLayerRisk'+idUser);

    	if($(e.target).parent().find('input:checked').length > 0){ //checked
    		e.data.checkViewer(e.data,checkboxOrder,checkboxGeneral,checkboxRisk);
        }else{ //unchecked
        	e.data.uncheckViewer(e.data,checkboxOrder,checkboxGeneral,checkboxRisk);
        }
    },
    
    checkViewer:function(data,checkboxOrder,checkboxGeneral,checkboxRisk){
    	data.model.attributes.viewer = true;   	
    	checkboxOrder.removeAttr('disabled');
    	checkboxRisk.removeAttr('disabled');
    	
    	checkboxGeneral.attr('checked','');
    	data.model.attributes.layers.push({name:$(checkboxGeneral).val()});
    },
    
    uncheckViewer:function(data,checkboxOrder,checkboxGeneral,checkboxRisk){
    	data.model.attributes.viewer = false;	
    	checkboxOrder.removeAttr('checked');
    	checkboxGeneral.removeAttr('checked');
    	checkboxRisk.removeAttr('checked');
    	
    	checkboxOrder.attr('disabled','');
    	checkboxGeneral.attr('disabled','');
    	checkboxRisk.attr('disabled','');
    	
    	data.removeRole(data.model,$(checkboxOrder).val());
    	data.removeLayer(data.model,$(checkboxGeneral).val());	
    	data.removeLayer(data.model,$(checkboxRisk).val());
    },
});