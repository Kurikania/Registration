

const express = require("express"); 
const app = express(); 
const ejs = require("ejs");
const bodyParser = require("body-parser"); 
const path = require("path"); 
const methodOverride = require("method-override");
const passport = require("passport"); 
const bcrypt = require("bcrypt"); 
const flash = require('express-flash'); 
const session = require('express-session')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


const PORT = process.env.PORT || 5000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));




app.use(express.urlencoded({ extended: true}));
app.use(express.json());



let users = []; 



app.use(flash())
app.use(session({
  secret: "String",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




app.get("/", (req, res) => {
    res.render("index")
})

app.get("/index",   (req, res) => {
    res.render("index")
})

app.get("/about", (req, res) => {
    res.render("about")
})


app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })

app.post('/register', async (req, res) => { 
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        users.push({
            id: Date.now.toString(), 
            name: req.body.username, 
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
    console.log(users)
});


app.get("/login", (req, res) => {
	res.render("login"); 
}); 

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/loggedin',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get("/loggedin", checkAuthenticated, (req, res) => {
	res.render("loggedin", { name: req.user.name });
})

  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.redirect('/loggedin')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))