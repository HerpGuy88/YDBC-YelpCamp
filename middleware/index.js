var Campground  = require("../models/campground.js"),
    Comment     = require("../models/comment.js"),
    User        = require("../models/user.js");
    
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
    req.flash("error", "You must be logged in to perform that function");
    res.redirect("/login");
    }
};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        console.log("USER IS AUTHENTICATED");
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                //Does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)) {
                    console.log("ID's match!!!");
                    return next();
                }
                console.log("ID's DON'T MATCH!");
                req.flash("error","You do not own that campground!");
                res.redirect("back");
            }
        });  
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        console.log("USER IS AUTHENTICATED");
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            } else {
                //Does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    console.log("ID's match!!!");
                    return next();
                }
                console.log("ID's DON'T MATCH!");
                console.log(foundComment.author.id);
                console.log(req.user._id);
                res.redirect("back");
            }
        });  
    } else {
        console.log("Log in, bro!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;