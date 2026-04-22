const express = require("express");
const router = express.Router({ mergeParams: true }); //handles related requests to listings something
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js"); //requiring listing model
const { isLoggedIn , isOwner ,validateListing} = require("../middleware.js");

const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});//now multer will store our files in CLOUDINARY STORAGE



//all listings routes here 
//replace app=>router

const listingController = require("../controllers/listings.js");

//index and create route
router.route("/")
  .get(wrapAsync(listingController.index)) //stored backend callback code in CONTROLLER
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync (listingController.createListing)
);

//New Route
router.get("/new",isLoggedIn ,listingController.renderNewForm);

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditListing));
    
//show,update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing ,
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    wrapAsync(listingController.destroyListing)
);


  

module.exports = router ; 