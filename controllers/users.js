const User = require("../models/user.js");

module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res, next) => {
    try {
       let { username, email, password } = req.body;
       const newUser = new User({ email, username });
       const registeredUser = await User.register(newUser, password); //user stored in db
       console.log(registeredUser);
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to Wanderlust!");
          res.redirect("/listings");
       });
 
    } catch (e) {
       req.flash("error", e.message);
       res.redirect("/signup");
    }
 };

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login = async(req,res)=>{ //async=>user exist or not
    req.flash("success","welcome back!");
  res.redirect(res.locals.redirectUrl || "listings"); //see in middleware.js // || means or
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{ //req.logout=> method takes callback as a parameter ; means what work to do after logout
     if(err){
        return next(err);
     }
     req.flash("success","You are logged out !");
     res.redirect("/listings");
    });
};