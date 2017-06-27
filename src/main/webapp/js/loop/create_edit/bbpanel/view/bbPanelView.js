var bbPanelView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/create_edit/bbpanel/template/bbPanelTemplate.ejs',
    el : $('#bb-panel-container'),
    
    initialize: function (){
        _.bindAll(this, 'render', 'closePanel');
        this.render();    
    },
      
    render: function() {
        this.getBBCreationPermission();
        this.$el.append($(new EJS({url: this.template }).render({bbCreationPermission:this.bbCreationPermission})));
        this.setMyBBList();
        this.setShareBBList();
        this.setNewBBList();
        this.renderBBList();
        this.$el.find('.accordion_toolkit').accordion({ 
            active: 0,
            collapsible: true,
            animate: 200,
            heightStyle: "fill"
        });
        
        this.$el.find('#close-panel').click(this,this.closePanel);
        this.setSearchEvent();
        return this;
    },
    
    setSearchEvent: function(){
        var that = this;
        this.$el.find("#searchbox").keyup(function(e) {
            that.myBBCollection.search(e.currentTarget.value);
            that.shareBBCollection.search(e.currentTarget.value);
        });
    },
        
    openBBPanel: function(e){
        e.preventDefault();
        this.$el.find('#bb-panel').addClass('is-visible');
    },
      
    closePanel: function(e){
        e.preventDefault();
        this.$el.find('#bb-panel').removeClass('is-visible');
    },
    
    renderBBList: function(){
        this.clearHTML();
        this.myBBCollection.each(this.addMyBB, this);
        this.shareBBCollection.each(this.addShareBB, this);
        if(this.bbCreationPermission == true){
            this.newBBCollection.each(this.addNewBB, this);
        }
    },
    
    clearHTML: function(){
        this.$el.find("#stockContent").html("<h5>Stock</h5>");
        this.$el.find("#flowContent").html("<h5>Flow</h5>");
        this.$el.find("#sharedStock").html("<h5>Stock</h5>");
        this.$el.find("#sharedFlow").html("<h5>Flow</h5>");
        this.$el.find("#new-bb").html("");
    },
    
    setMyBBList: function(){
        var myBBdata = ajaxCall('GET', '/blueloop-backend/buildingBlock/getAllBuildingBlock/', {categories:""}, "text/json", "json", false);
        this.myBBCollection = new bbPanelCollection([]);
        _.each(myBBdata.listMyBB,function(item,i){
            var model = new bbPanelModel({
                id:item.id,
                idForm:"cb_"+item.id,
                name: item.name,
                type: item.type,
                category: item.category,
                config: JSON.parse(String.fromCharCode.apply(null, new Uint16Array(item.config))),
                fileName:item.fileName,
                filePath:myBBdata.filePath,
                panelType:"mybb"
            });
            this.myBBCollection.push(model);
        },this);
    },
    
    addMyBB: function(model){
        var view = new bbView({model:model,panelView:this});
         if(model.get("category") == "Stock"){
             this.$el.find("#stockContent").append(view.render().$el);
         }else if(model.get("category") == "Flow"){
             this.$el.find("#flowContent").append(view.render().$el);
         }
         
    },
    
    setShareBBList: function(panel){
        var shareBBdata = ajaxCall('GET', '/blueloop-backend/buildingBlock/searchBBToBeShared/', {searchWord:""}, "text/json", "json", false);
        this.shareBBCollection = new bbPanelCollection([]);
        _.each(shareBBdata.listBB,function(item,i){
            var model = new bbPanelModel({
                id:item.id,
                idForm:"cb_"+item.id,
                name: item.name,
                type: item.type,
                category: item.category,
                config: JSON.parse(String.fromCharCode.apply(null, new Uint16Array(item.config))),
                fileName:item.fileName,
                filePath:shareBBdata.filePath,
                panelType:"sharebb"
            });
            this.shareBBCollection.push(model);
        },this);
    },
    
    addShareBB: function(model){
        var view = new bbView({model:model,panelView:this});
        if(model.get("category") == "Stock"){
            this.$el.find("#sharedStock").append(view.render().$el);
        }else if(model.get("category") == "Flow"){
            this.$el.find("#sharedFlow").append(view.render().$el);
        }
    },
    
    getBBCreationPermission:function(){
        var data = ajaxCall('GET', '/blueloop-backend/user/verifyBBCreationPermission/', {}, "text/json", "json", false);
        this.bbCreationPermission = data.permission 
    },
    
    setNewBBList: function(){
        if(this.bbCreationPermission == true){
            var newBBdata = ajaxCall('GET', '/blueloop-backend/buildingBlockType/getAllBuildingBlockType/', {}, "text/json", "json", false);
            this.newBBCollection = new bbPanelCollection([]);
            _.each(newBBdata.listBBType,function(item,i){
                var model = new bbPanelModel({
                    id:item.id,
                    idForm:"bbt_"+item.id,
                    name: item.name,
                    type: "new",
                    category: item.category,
                    config: JSON.parse(String.fromCharCode.apply(null, new Uint16Array(item.config))),
                    fileName:item.fileName,
                    filePath:newBBdata.filePath,
                    panelType:"new"
                });
                this.newBBCollection.push(model);
            },this);
        }
    },
    
    addNewBB: function(model){
        var view = new bbView({model:model,panelView:this});
         this.$el.find("#new-bb").append(view.render().$el);
    }

});