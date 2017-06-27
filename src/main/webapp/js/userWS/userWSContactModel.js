userWSContactModel = Backbone.Model.extend({

    defaults : {
        id : "",
        path : "",
        firstName : "",
        lastName : "",
        currentUser : false,
        partners : false,
        pendingRequestApprove : false,
        pendingRequestSend : false
    }

});