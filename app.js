const express = require("express"); 
const app = express(); 
const ejs = require("ejs");
const bodyParser = require("body-parser"); 
const path = require("path"); 
const methodOverride = require("method-override");
const mongoose = require("mongoose"); 
const User = require("./models/user"); 
const passport = require("passport"); 
const LocalStrategy  = require("passport-local"); 

const PORT = process.env.PORT || 5000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

mongoose.connect("mongodb://localhost/auth", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I never had a hamster",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/index", (req, res) => {
    res.render("index")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/loggedin", isLoggedIn,function(req, res){
	res.render("loggedin");
})


app.get("/register", (req, res) => {
	res.render("register");
})

app.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err) {
			console.log(err); 
			res.render("register"); 
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/loggedin");
		});
	})
})

app.get("/login", (req, res) => {
	res.render("login"); 
}); 

app.post("/login", passport.authenticate("local", {
	successRedirect: "/loggedin", 
	failureRedirect: "/login"
}), function(req,res){ });

app.post("/login", passport.authenticate("local", {
	successRedirect: "/loggedin", 
	failureRedirect: "/login"
}), function(req,res){ });

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))