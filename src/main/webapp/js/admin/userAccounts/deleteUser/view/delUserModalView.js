var delUserModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/userAccounts/deleteUser/template/delUserModal.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render());
        this.bbCollection = new bbCollection([]);
        this.flowCollection = new bbCollection([]);
        this.loopCollection = new loopCollection([]);
        this.getAdminUsers();
        this.setFirstStep("next");
        this.setEvents();
        return this;
    },
    
    getAdminUsers: function(){
    	this.userCollection = new userCollection([]);
        var result = ajaxCall('GET', '/blueloop-backend/administrator/getActiveUsersByCompany/', {}, "text/json", "json", false);

        _.each(result,function(item,i){
            var user = new userModel({
                id:       item.id,
                name:     item.name
            });
            this.userCollection.push(user);
        },this);
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
    	var view = new firstStepView();
        this.$el.find('#content').html(view.render().$el);
    },
    
    setBBStep: function(action){
    	this.step = 2;
    	if(action == "next"){
    		this.setStepColor("#step-2","#step-line-1",action);
    	}else{
    		this.setStepColor("#step-3","#step-line-2",action);
    	}
    	this.$el.find("#back").show();
    	var view = new bbStepView({model:this.model,userCollection:this.userCollection,bbCollection:this.bbCollection});
        this.$el.find('#content').html(view.render().$el);
    },
    
    setLoopStep: function(action){
        this.step = 3;
        if(action == "next"){
            this.setStepColor("#step-3","#step-line-2",action);
        }else{
            this.setStepColor("#step-4","#step-line-3",action);
        }
        this.$el.find("#next").show();
        this.$el.find("#finish").hide();
        var view = new loopStepView({model:this.model,userCollection:this.userCollection,loopCollection:this.loopCollection});
        this.$el.find('#content').html(view.render().$el);
    },
    
    setFlowStep: function(action){
    	this.step = 4;
    	if(action == "next"){
    		this.setStepColor("#step-4","#step-line-3",action);
    	}else{
    		this.setStepColor("#step-5","#step-line-4",action);
    	}
    	this.$el.find("#next").show();
    	this.$el.find("#finish").hide();
    	var view = new flowBBStepView({model:this.model,flowCollection:this.flowCollection,userCollection:this.userCollection});
        this.$el.find('#content').html(view.render().$el);
    },
    
    setLastStep: function(action){
    	this.step = 5;
    	this.setStepColor("#step-5","#step-line-4",action);
    	this.$el.find("#next").hide();
    	this.$el.find("#finish").show();
    	var view = new lastStepView();
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
    
    setEvents: function(){
        this.$el.find("#next").click(this,this.next);
        this.$el.find("#back").click(this,this.back);
        this.$el.find("#finish").click(this,this.finish);
    },
    
    next: function(e){
    	switch(e.data.step) {
	        case 1:
	            e.data.setBBStep("next");
	            break;
	        case 2:
	        	if(e.data.checkOwner("bb")){
	        		e.data.setLoopStep("next");
	        	}else{
	        		toastr.error(json.admin.nextBBError);
	        	}
	            break;
	        case 3:
	            if(e.data.checkOwner("loop")){
	                e.data.setFlowStep("next");
                }else{
                    toastr.error(json.admin.nextLoopError);
                }
	            break;
	        case 4:
	        	if(e.data.checkOwner("flow")){
	        		e.data.setLastStep("next");
		    	}else{
		    		toastr.error(json.admin.nextFlowError);
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
	            e.data.setBBStep("back");
	            break;
	        case 4:
	            e.data.setLoopStep("back");
	            break;
	        case 5:
	            e.data.setFlowStep("back");
	            break;
    	}
    },
    
    checkOwner: function(listType){
    	var next = true;
    	if(listType == "bb"){
	    	_.each(this.bbCollection.models,function(item,i){
	           if(item.get("owner") == this.model.id){
	        	   next = false;
	           }
	        },this);
    	}else if(listType == "loop"){
    		_.each(this.loopCollection.models,function(item,i){
 	           if(item.get("owner") == this.model.id){
 	        	   next = false;
 	           }
 	        },this);
    	}else{
            _.each(this.flowCollection.models,function(item,i){
                if(item.get("responsible") == this.model.id){
                    next = false;
                }
             },this);
         }
    	return next;
    },
    
    finish: function(e){
        var data = {listBB:e.data.bbCollection.models,listLoop:e.data.loopCollection.models,
                    listFlow:e.data.flowCollection.models,user_id:e.data.model.id};
        var result = ajaxCall('POST', '/blueloop-backend/administrator/deleteUser/', JSON.stringify(data), "text/json", "json", false);
        if(result.success){
            toastr.success(json.admin.msgDelUser);
            e.data.$el.remove();
            
            e.data.tableView.datatable.rows(e.data.row_el).remove();
            e.data.model.set("userStatus","DISABLED");
            var elNewRow = e.data.tableView.addNewRow(e.data.model); 
            e.data.tableView.datatable.rows.add(elNewRow).draw();
            e.data.tableView.filter(e.data.tableView.currentFilter);
            
            _.each(e.data.loopCollection.models,function(item,i){
                var user = e.data.tableView.collection.findWhere({id:parseInt(item.get("owner"))});
                var cant = parseInt(user.get("loops")) + 1;
                user.set("loops", cant)
            },this);
            
            _.each(e.data.bbCollection.models,function(item,i){
                var user = e.data.tableView.collection.findWhere({id:parseInt(item.get("owner"))});
                var cant = parseInt(user.get("bbs")) + 1;
                user.set("bbs", cant)
            },this);
            
            _.each(e.data.flowCollection.models,function(item,i){
                var user = e.data.tableView.collection.findWhere({id:parseInt(item.get("responsible"))});
                var cant = parseInt(user.get("countFlow")) + 1;
                user.set("countFlow", cant)
             },this);
            
        }else{
            toastr.error(json.admin.errorDelUser);
        }
    }

});