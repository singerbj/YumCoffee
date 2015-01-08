define(function (require) {
    var _ = require("underscore");    
    var $ = require("jquery");
    var Backbone = require("backbone");
    var serializeObject = require("serializeObject");
    var router = require("router");

    var Rating = require("rating");
    var Ratings = require("ratings");
    var Coffees = require("coffees");

    var RatingList = Backbone.View.extend({
        el: '.page',
        render: function(){
            var that = this;
            var coffees = new Coffees();
            coffees.fetch({
                success: function(coffees){
                    coffees = coffees.toJSON();
                    var ratings = new Ratings();
                    ratings.fetch({
                        success: function(ratings){
                            //create coffee map
                            var coffeeMap = {};
                            _.forEach(coffees, function(c){
                                coffeeMap[c.id]= c;
                            }); 
                            //apply coffee to each rating
                            ratings = ratings.toJSON();
                            _.forEach(ratings, function(o) {
                                o.coffee = coffeeMap[o.coffee_id];
                            });
                            window.ratings = _.sortBy(ratings, function(o) {
                                return parseInt(o.coffee_id, 10);
                            });
                            var template = _.template($('#rating-list-template').html());
                            that.$el.html(template);
                        }
                    });
                }                
            }); 
        },
        events: {
            'click .ratingDelete': 'deleteRating'
        },
        deleteRating: function(ev){
            var ratingid = parseInt($(ev.currentTarget)['0'].attributes['2'].value, 10);
            var rating = new Rating({id: ratingid});
            var r = window.confirm("Are you sure?");
            if(r) {
                rating.destroy({
                    success: function () {
                        router.navigate('#/rating', {trigger: true});
                    },
                    error: function () {
                        router.navigate('#/rating', {trigger: true});
                    }
                });
            }
        }
    });

    var ratingList = new RatingList();

    var EditRating= Backbone.View.extend({
        el: '.page',
        reset: function(){
            this.render();
        },
        render: function(options){
            var that = this;
            var coffees = new Coffees();
            coffees.fetch({
                success: function(coffees){
                    window.coffees = _.sortBy(coffees.toJSON(), function(o) {
                        return parseInt(o.id, 10);
                    });

                    if(options.id) {
                        var rating = new Rating({id: options.id});
                        rating.fetch({
                            success: function(rating) {
                                window.rating = rating.toJSON()[0];
                                var template = _.template($('#rating-form-template').html());
                                that.$el.html(template);
                            }
                        });
                    }else{
                        window.rating = null;
                        var template = _.template($('#rating-form-template').html());
                        that.$el.html(template);
                    }
                }
            });
        },
        events: {
            'submit .ratingForm': 'saveRating'
        },
        saveRating: function(ev){
            ev.preventDefault();
            var ratingDetails = $(ev.currentTarget).serializeObject();
            var rating = new Rating();
            rating.save(ratingDetails, {
                success: function(){
                    router.navigate('#/rating', {trigger: true});
                },
                error: function(){
                    router.navigate('#/rating', {trigger: true});
                }
            });
            return false;
        }
    });

    var editRating = new EditRating();

    return { editRating: editRating, ratingList: ratingList};
});