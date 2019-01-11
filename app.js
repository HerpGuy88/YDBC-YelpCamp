var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var app = express();

//IMPORT AUTHENTICATION PACKAGES
var passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js");

//IMPORT ROUTES
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

//Other settings
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//comment out after firstuse!!!!
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Oh no I forgot that I am late to the pants eating competition. Who, now will eat my pants?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//=================================================
//                   ROUTES
// ================================================
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// ================================================
//        CATCH ROUTE AND LAUNCH LISTENER
// ================================================

app.get("*",function(req, res){
    res.send("Page not found.");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp Server is running...");
    console.log("Port:" + process.env.PORT);
    console.log("IP: " + process.env.IP);
});