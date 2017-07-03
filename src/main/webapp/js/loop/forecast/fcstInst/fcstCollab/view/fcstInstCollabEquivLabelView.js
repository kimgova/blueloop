var fcstInstCollabEquivLabelView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabEquivLabel.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        var that = this;
        this.$el.find(".chkFilter").on('ifChecked', function(e){
            that.selectFilter(e,that);
        });
    },

    selectFilter: function(e,that){
        var filterType = that.getFilterType();
        var unit = $('input[name="chkFilterEquiv"]:checked').val();
        var data = fcstCollabEquivCollection.getInstance({}).findWhere({unit:unit});
        var tableView = new collaborativeTableView({instanceId: that.instanceId,filterType:filterType,unit:unit,isDefault:data.get("isDefault")});
        $("#adjustmentsTable").html(tableView.render().$el);
        tableView.initTreeGrid();
    },
    getFilterType: function(){
        var catIndex = 0, subCatIndex = 0, roleIndex;
        fcstCollabFilterCollection.getInstance({}).sort().each(function(item,i){
            if(item.get("id") == 1){
                catIndex = i;
            }else if(item.get("id") == 2){
                subCatIndex = i;
            }else if(item.get("id") == 3){
                roleIndex = i;
            }
        });
        if(catIndex > subCatIndex){
            toastr.error("Error: Verify Filter Order");
            return
        }
        
        return roleIndex;
    }
});