var express = require("express");
var router = new express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//NEW
router.get("/new",  middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//CREATE
router.post("/",  middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, price: price, image: image, description: description};
    Campground.create(newCampground,function(err,campground){
        if(err) {
            console.log(err);
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            console.log ("Campground created");
            console.log (campground);
        }
    });
    //redirect to campgrounds get route
    res.redirect("/campgrounds");
});

//SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//EDIT
router.get("/:id/edit",  middleware.checkCampgroundOwnership, function(req, res) {
    console.log("EDIT BUTTON CLICKED");
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log("CAMPGROUND NOT FOUND");
            res.redirect("/campgrounds");
        } else {
            console.log("CAMPGROUD FOUND");
            res.render("campgrounds/edit", {campground: foundCampground});
        }
});  


});
//UPDATE
router.put("/:id",  middleware.checkCampgroundOwnership, function(req, res){
    console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROYYYYYY!!!!
router.delete("/:id",  middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;