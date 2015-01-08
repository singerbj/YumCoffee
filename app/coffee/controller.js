define(function (require) {
    var _ = require("underscore");
    var Q = require("q");
    var $ = require("jquery");
    var Backbone = require("backbone");
    var serializeObject = require("serializeObject");
    var router = require("router");
    var Coffee = require("coffee");
    var Coffees = require("coffees");

    var CoffeeList = Backbone.View.extend({
        el: '.page',
        render: function(){
            var that = this;
            var coffees = new Coffees();

            coffees.fetch({
                success: function(coffees){
                    coffees = coffees.toJSON();
                    var promises = [];
                    coffees.forEach(function(coffee){
                        var deferred = Q.defer();
                        promises.push(deferred.promise);
                        var coffeeRatings = new Coffee({id: coffee.id});
                        coffeeRatings.fetchCurrent(coffee.id, {
                            success: function(ratings){
                                coffee.ratings = ratings.toJSON();

                                var sum = 0;
                                var totalRatings = 0;
                                _.forEach(coffee.ratings, function(rating){
                                    if(rating.rating){
                                        sum = sum + parseInt(rating.rating, 10);
                                        ++totalRatings;
                                    }
                                });

                                coffee.avgRating = Math.round(sum / totalRatings);
                                deferred.resolve();
                            }
                        });
                    });

                    Q.all(promises).spread(function () {
                        window.coffees = _.sortBy(coffees, function(o) {
                            return parseInt(o.id, 10);
                        });

                        var template = _.template($('#coffee-list-template').html());
                        that.$el.html(template);
                    });

                }
            });
        },
        events: {
            'click .coffeeDelete': 'deleteCoffee'
        },
        deleteCoffee: function(ev){
            var coffeeid = parseInt($(ev.currentTarget)['0'].attributes['2'].value, 10);
            var coffee = new Coffee({id: coffeeid});
            var r = window.confirm("Are you sure?");
            if(r) {
                coffee.destroy({
                    success: function () {
                        router.navigate('#/coffee', {trigger: true});
                    },
                    error: function () {
                        router.navigate('#/coffee', {trigger: true});
                    }
                });
            }
        }
    });

    var coffeeList = new CoffeeList();

    var EditCoffee = Backbone.View.extend({
        el: '.page',
        reset: function(){
            this.render();
        },
        render: function(options){
            var that = this;
            if(options.id) {
                var coffee = new Coffee({id: options.id});
                coffee.fetch({
                    success: function(coffee) {
                        window.coffee = coffee.toJSON()[0];
                        var template = _.template($('#coffee-form-template').html());
                        that.$el.html(template);
                    }
                });
            }else{
                window.coffee = null;
                var template = _.template($('#coffee-form-template').html());
                that.$el.html(template);
            }
        },
        events: {
            'submit .coffeeForm': 'saveCoffee'
        },
        saveCoffee: function(ev){
            ev.preventDefault();
            var coffeeDetails = $(ev.currentTarget).serializeObject();
            var coffee = new Coffee();
            coffee.save(coffeeDetails, {
                success: function(){
                    router.navigate('#/coffee', {trigger: true});
                },
                error: function(){
                    router.navigate('#/coffee', {trigger: true});
                }
            });
            return false;
        }
    });

    var editCoffee = new EditCoffee();

    return { editCoffee: editCoffee, coffeeList: coffeeList};
});