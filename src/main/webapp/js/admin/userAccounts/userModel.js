var userModel = Backbone.Model.extend({

    defaults : {
        id : 0,
        name : "",
        email : "",
        lastLogin : "",
        image: "",
        permissions : {},
        bbs: 0,
        loops: 0
    }

});