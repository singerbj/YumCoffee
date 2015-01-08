define(function (require) {
    var Backbone = require("backbone");

    var Coffees = Backbone.Collection.extend({
        url: "/coffee"
    });

    return Coffees;
});	