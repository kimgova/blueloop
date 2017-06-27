var bbGridView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/bbGrid/template/bbGridViewTemplate.ejs',
    emptyGridTemplate: '/blueloop-backend/static/js/buildingBlock/bbGrid/template/bbGridDefaultEmptyTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
    
    initialize: function (){
        _.bindAll(this, 'render');
        this.render();
    },
    
    render: function() {
        this.getBBCollection();
        if(this.$el){
            this.$el.empty();
        }
        if(this.collection.length != 0){
            this.$el = $(new EJS({url: this.template }).render());
            this.collection.each(this.addModel, this);
            this.collection.byOwner('All');
        }else{
            this.$el = $(new EJS({url: this.emptyGridTemplate }).render({creationPermission:this.creationPermission}));
        }
        return this;
    },
    
    getBBCollection: function(){
        this.collection = new bbGridElementCollection([]);
        var response = this.getAllBB(null);
        var myBBList = response.listMyBB;
        var teamBBList = response.listBBTeam;
        var filePath = response.filePath;
    
        this.addMyBBList(this.collection,myBBList, filePath);
        this.addTeamBBList(this.collection,teamBBList, filePath);
    },

    getAllBB:function(categories){
        var jsonObject = new Object();
        jsonObject.categories = '';
        if(categories != null){
            jsonObject.categories = categories.toString()
        }
        jsonObject.includeTeamBB = 'true';
        jsonObject.includeArchived = 'true';
        
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/buildingBlock/getAllBuildingBlock/',
            data: jsonObject,
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
        return dataReturned.responseJSON; //send only the responseJSON 
    },
    
    addMyBBList: function(collection, myBBList, filePath){
        _.each(myBBList,function(item,i){
            var model = new bbGridElementModel({    
              id: item.id,
                name: item.name,
                type: item.type,
                ownerName: item.ownerName,
                responsible: item.ownerName,//?
                company: item.companyName,
                email: item.emailAddress,
                phone: item.phoneNumber,
                lastUpdated: '12.8.2015',
                path : filePath + item.fileName,
                loops: item.chainBbs.length,
                ownership: 'My ' + item.category + ' Building Block',
                archived: item.deleted
              });
            collection.add(model);
        });
    },
        
    addTeamBBList: function(collection, teamBBList, filePath){
        _.each(teamBBList,function(item,i){
            var model = new bbGridElementModel({    
              id: item.id,
                name: item.name,
                type: item.type,
                ownerName: item.ownerName,
                responsible: item.ownerName, //?
                company: item.companyName,
                email: item.emailAddress,
                phone: item.phoneNumber,
                lastUpdated: '12.8.2015',
                path : filePath + item.fileName,
                loops: item.chainBbs.length,
                ownership: 'Invited ' + item.category + ' Building Block',
                invited:true,
                archived: item.deleted
              });
            collection.add(model);
        });
    },

    addModel: function(model) {
       var modelView = new bbGridElementView( {model: model} );
       this.$el.append(modelView.render().$el);
    },
    
    filterSearch: function(letters){
        this.collection.byName(letters);
    },
    
    clicked: function(e){
        e.preventDefault();
        var elementId = e.target.id;
        this.filteredCollection(elementId);
    },
    
    filteredCollection: function(elementId){
        var filteredElements;
      
        if(elementId === 'filter-mine'){
            this.collection.byOwner('My Building Block');
        }else if(elementId === 'filter-invited'){
            this.collection.byOwner('Invited Building Block');
        }else if(elementId === 'filter-all'){
            this.collection.byOwner('All');
        }else if(elementId === 'filter-archived'){
            this.collection.byOwner('Archived');
        }
    }
});