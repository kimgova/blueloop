var flowActivityModel = Backbone.Model.extend({

    defaults : {
        id          : null,
        id_activity : null,
        id_flow_bb  : null,
        valve_flow_id:null,
        description : "",
        leadTime    : 0,
        leadTimeType: 0,
        responsible : 0,
        imgURI      : "",
        valve       : "",
        haveOrders  : false,
        checked     : "",
        rl          :true,
        mc          :false,
        ra          :false
    }

});