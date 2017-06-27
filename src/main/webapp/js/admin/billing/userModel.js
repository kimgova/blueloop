var userModel = Backbone.Model.extend({

    defaults : {
        id : 0,
        name : "",
        cardNumber : "",
        month : "",
        year: "",
        cvc : "",
        city: "",
        country: "",
        address: "",
        zip: "",
        state: ""
    }

});