//means are enviroment is not production , we are in development phase=>
// then we have to use dotenv
//and when our project is in production then we have to use something else
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;//session store
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("conneected to db");
}).catch(err=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.set("trust proxy", 1); //production=> for cookies to work well in render

//MongoStore.create() =>method used for creating mongo Store
const store =MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
      },
      touchAfter: 24 * 3600 ,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

//cokies are formed 
const sessionOptions = {
    store:store,
    secret :process.env.SECRET,//write any string
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true,
    },
};

// app.get("/" , (req,res)=>{
//     res.send("hi iam root");
// });
//assosiate sessions with our website


app.use(session(sessionOptions));
app.use(flash()); 

//passport in middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));//authenticate is static method

//to serialize and deserializes=>store user info in session & delete after session closed
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middeleware define for flash msg
app.use((req,res,next)=>{
    res.locals.success = req.flash("success") ; //key => save in res.locals.message
    res.locals.error = req.flash("error") ;
    res.locals.currentUser = req.user ; //created currentUser variable to store req.user information(for signin,logout,signup)
    // console.log(res.locals.success);
    next();
});

//demo user
// app.get("/demo/user", async (req,res,next)=>{
//     try{
//      let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"dhananjay-delta"
//      });
//      //static method=> store username and password in database
//      let registeredUser = await User.register(fakeUser,"helloworld");
//      res.send(registeredUser);
//     }catch(e){
//         next(e);
//     }
// });

//connection with listing.js page
//when req comes on listing/something it hands on to listing.js

// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });

app.use("/" , userRouter);
app.use("/", listingRouter);

app.use("/:id/reviews", reviewRouter);



//for payments => razorpay
const paymentRoutes = require("./routes/payment");
app.use("/", paymentRoutes);

app.use((req, res, next) => {
    console.log("❌ 404 URL:", req.originalUrl);
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    console.log(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    res.status(statusCode).render("error.ejs", { message });
});

 // res.status(statusCode).send(message); //deconstuct custom error

 //  PORT FIX (VERY IMPORTANT) for production
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
});