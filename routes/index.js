var express = require("express");
var passport = require("passport");
var router = new express.Router();
var User = require("../models/user");

//=============================
//  Auth Routes
//=============================

//landing page
router.get("/", function(req, res){
    res.render("landing");
});

//show register page
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp, " + user.username + "!!!");
                res.redirect("/campgrounds");
            });
        }
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handle login logic

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;