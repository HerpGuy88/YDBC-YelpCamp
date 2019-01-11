var express = require("express");
var router = new express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===========================
// COMMENTS ROUTES
// ==========================
//INDEX
//  -Not necessary, show page for campsites serves as index page for comments
//SHOW
//  -Not necessary, comment type is brief and does not require a show page
//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});
//CREATE

router.post("/",  middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgroudns");
        } else {
            //add username and id to comment
            console.log(req.user.username);
            //save comment to database
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit",  middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            console.log(err);
        } else {
            Campground.findById(req.params.id, function(err, foundCampground){
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {comment: foundComment, campground: foundCampground});
                }
            });
        }
    });
});
//UPDATE

router.put("/:comment_id",  middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id",  middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
    }
    });
});


module.exports = router;