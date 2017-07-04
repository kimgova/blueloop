var cbbListView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/sequence/cbbSequence/template/cbbList.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find(".addToSeq").click(this,this.addToSequence);
    },
    
    addToSequence: function(e){
        e.data.cbbCollection.remove(e.data.model);
        e.data.seqCollection.add(e.data.model);
        
        e.data.tabView.setListCBBToShow(e.data.model.get("idFormJSON"));
        
        var listView = new cbbSequenceListView({
            model : e.data.model, 
            seqCollection:e.data.seqCollection, 
            cbbCollection:e.data.cbbCollection, 
            viewItems:e.data.viewItems,
            tabView:e.data.tabView
        });
        
        $('#sortable').append(listView.render().$el);
        
        e.data.viewItems.push(listView);
        
        _.each(e.data.viewItems, function(item,i){
            item.model.set('step', item.$el.index() + 1);
        });
        
        $(e.currentTarget).parents('li').remove();
        
        e.data.tabView.removeFromCBBList(e.data.model.get("idFormJSON"));
        e.data.tabView.showCBBList();
        e.data.tabView.hideShowSequenceBtns();
        SequenceExitModel.getInstance({}).set('cbbPendingChanges',true);
    }

});