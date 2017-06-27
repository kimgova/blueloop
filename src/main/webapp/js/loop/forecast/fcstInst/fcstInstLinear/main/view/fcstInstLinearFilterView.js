var forecastInstLinearFilterView = Backbone.View.extend({

    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearFilter.ejs',

    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.getCategories();
        this.getLinearFilterCollection();
        this.$el = $(new EJS({url: this.template }).render({categories:this.catCollection,subCategories:this.subCatCollection,roles:this.roleCollection.models}));
        this.roleCollection.each(this.addFilterModel, this);
        this.$el.find("#catFilter").change(this,this.selectCategory);
        this.$el.find("#subCatFilter").change(this,this.selectSubCategory);
        this.$el.find("#rolesFilter").change(this,this.selectRole);
        return this;
    },
    
    getCategories: function(){
        this.catCollection = [];
        this.subCategoryCollection = [];
        _.each(this.retrieveCatRoleFilters(),function(item,i){
            if(i == "catList"){
                _.each(item,function(cat,i){
                    this.catCollection.push({id:cat.id,name:cat.name});
                },this);
            }else{
                _.each(item,function(subCat,i){
                    this.subCategoryCollection.push({id:subCat.id,name:subCat.name,cat:subCat.cat});
                },this);
            }
        },this);
        this.subCatCollection = [];
    },

    getLinearFilterCollection: function(){
        this.roleCollection = forecastLinearRoleCollection.getInstance({clean:true});
        _.each(this.retrieveFilters(),function(item,i){
            var model = new forecastLinearRoleModel({
                id:item.id,
                name: item.name,
                filters: item.filters
            });
            this.roleCollection.add(model);
        },this);
    },

    retrieveFilters: function(){
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/fcstLinearPlan/getRoleFilters/',
            data: {instanceId:this.instanceId},
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

    retrieveCatRoleFilters: function(){
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/fcstLinearPlan/getCatForRoleFilters/',
            data: {instanceId:this.instanceId},
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
    
    addFilterModel: function(model) {
        _.each(model.get("filters"),function(item,i){
            var modelView = new forecastInstLinearRoleFilterView( { model: item } );
            this.$el.find('#roleFilters').find("#filters").append(modelView.render().$el);
        },this);
    },
    
    selectCategory: function(e) {
        var idCategory = parseInt($(e.target).val());
        e.data.fillSubcategories(e,idCategory);
        var tableView = new forecastInstLinearTableView({instanceId: 0, categoryId:idCategory, subCategoryId:0, roleId:$("#rolesFilter").val(), filters:[]});
        $("#linearTable").html(tableView.render().$el);
        tableView.initPagination();
    },
    
    selectSubCategory: function(e) {
        var idSubCategory = parseInt($(e.target).val());
        var tableView = new forecastInstLinearTableView({instanceId: 0, categoryId:$("#catFilter").val(), subCategoryId:idSubCategory, roleId:$("#rolesFilter").val(), filters:[]});
        $("#linearTable").html(tableView.render().$el);
        tableView.initPagination();
    },
    
    selectRole: function(e) {
        var idRole = parseInt($(e.target).val());
        e.data.fillFilters(e,idRole);
        var tableView = new forecastInstLinearTableView({instanceId: 0, categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:idRole, filters:[]});
        $("#linearTable").html(tableView.render().$el);
        tableView.initPagination();
    },
    
    fillSubcategories: function(e,idCategory){
        if(idCategory == 0){
            var modelView = new forecastInstLinearSubCatOptionView( { model: {id:0,name:"All Subcategories"} } );
            e.data.$el.find("#subCatFilter").empty();
            e.data.$el.find("#subCatFilter").append(modelView.render().$el);
        }else{
            e.data.$el.find("#subCatFilter").empty();
            var modelView = new forecastInstLinearSubCatOptionView( { model: {id:0,name:"All Subcategories"} } );
            e.data.$el.find("#subCatFilter").append(modelView.render().$el);
            _.each(e.data.subCategoryCollection,function(item,i){
                if(item.cat == idCategory){
                    var modelView = new forecastInstLinearSubCatOptionView( { model: {id:item.id,name:item.name} } );
                    e.data.$el.find("#subCatFilter").append(modelView.render().$el);
                }
            });
        }
    },
    
    fillFilters: function(e,idRole){
        e.data.$el.find('#roleFilters').find("#filters").empty();
        if(idRole != 0){
            e.data.addFilterModel(forecastLinearRoleCollection.getInstance({}).findWhere({id:idRole}));
        }else{
            e.data.roleCollection.each(e.data.addFilterModel, e.data);
        }
        $('#linearFilter').find("input:checkbox").iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%'
        });
    }

});