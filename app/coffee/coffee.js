define(function (require) {    
    var Backbone = require("backbone");

    var Coffee = Backbone.Model.extend({
        urlRoot: "/coffee",
        fetchCurrent: function (id, options) {
            options = options || {};
            if (options.url === undefined) {
                options.url = this.urlRoot + '/' + id + "/ratings";
            }

            return Backbone.Model.prototype.fetch.call(this, options);
        }
    });

    return Coffee;
});

    