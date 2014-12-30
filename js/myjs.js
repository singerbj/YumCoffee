//////////////////////////////////////////////////////////////////////////
//Serialize Form to Obj

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//////////////////////////////////////////////////////////////////////////

var Coffees = Backbone.Collection.extend({
    url: "/coffee"
});

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

var Ratings = Backbone.Collection.extend({
    url: "/rating"
});

var Rating = Backbone.Model.extend({
    urlRoot: "/rating"
});

//////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////

var RatingList = Backbone.View.extend({
    el: '.page',
    render: function(){
        var that = this;
        var ratings = new Ratings();
        ratings.fetch({
            success: function(ratings){
                window.ratings = _.sortBy(ratings.toJSON(), function(o) {
                    return parseInt(o.coffee_id, 10);
                });
                var template = _.template($('#rating-list-template').html());
                that.$el.html(template);
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

//////////////////////////////////////////////////////////////////////////

var EditRating= Backbone.View.extend({
    el: '.page',
    reset: function(){
        this.render();
    },
    render: function(options){
        var that = this;
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
    },
    events: {
        'submit .ratingForm': 'saveRating'
    },
    saveRating: function(ev){
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

//////////////////////////////////////////////////////////////////////////

var Router = Backbone.Router.extend({
   routes: {
       '': 'home',
       'coffee': 'coffee',
       'coffee/new': 'editCoffee',
       'coffee/edit/:id': 'editCoffee',
       'rating': 'rating',
       'rating/new': 'editRating',
       'rating/edit/:id': 'editRating'
   }
});

var router = new Router();
router.on('route:home', function(){
    router.navigate("#/coffee", true);
});
router.on('route:coffee', function(){
    coffeeList.render();
});
router.on('route:editCoffee', function(id){
    editCoffee.render({id: id});
});
router.on('route:rating', function(){
    ratingList.render();
});
router.on('route:editRating', function(id){
    editRating.render({id: id});
});

Backbone.history.start();
