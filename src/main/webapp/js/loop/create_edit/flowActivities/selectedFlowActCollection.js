var instanceFlowActCollection;

var selectedFlowActCollection = Backbone.Collection.extend({
    model: flowActivityModel
});

selectedFlowActCollection.getInstance = function (params) {
    if (!instanceFlowActCollection || params.clean == true) {
        instanceFlowActCollection = new selectedFlowActCollection();
    }
    return instanceFlowActCollection;
};