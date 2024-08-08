var express               = require('express'),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStatergy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession        = require("express-session"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    sanitizer             = require("express-sanitizer");

const { resourceLimits } = require('worker_threads');

mongoose.connect("mongodb+srv://gauravsingh09068:Gaurav@123@bugdebug.r5azu.mongodb.net/?retryWrites=true&w=majority&appName=bugDebug",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// DataBase Models...
var Comment    = require("./models/comment"),
    Post = require("./models/post"),
    User       = require("./models/user");


// resourceLimits...
var post = require("./routes/post");
    comment = require("./routes/comment");
    index = require("./routes/index");



// Basic Config...
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(sanitizer());


// ===========================
// Passport Config
// ===========================

// Session..........
app.use(expressSession({
    secret: "Welcome to bugDebug...",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// ==============================================
// Routes
// ==============================================
app.use(index);
app.use("/post",post);
app.use("/post/:id",comment);


// Error root
app.get("*",(req,res)=>{
    res.send("Sorry! Something went wrong.");
})

// Starting Server
app.listen(process.env.PORT || 3000,()=>{
    console.log("bugDebug is running on port 3000");
})