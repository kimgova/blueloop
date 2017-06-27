var instanceAddTeamMemberColl;

var addTMemberCollection = Backbone.Collection.extend({
    model: addTMemberModel
});

addTMemberCollection.getInstance = function (params) {
    if (!instanceAddTeamMemberColl || params.clean == true) {
        instanceAddTeamMemberColl = new addTMemberCollection();
    }
    return instanceAddTeamMemberColl;
};