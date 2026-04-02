const Listing = require("../models/listing.js");
const axios = require("axios"); 


module.exports.index = async (req,res,next)=>{ //index is function we created
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm = async(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", //with each review author must come in nested
        populate:{
            path:"author", //nested populate author 
        },
    })
    .populate("owner");//all owner info will come with review 
    
    if (!listing) {  // ← add this check
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async (req,res,next)=>{
    let url =req.file.path;
    let filename = req.file.filename;

    //let{title,desc,country,price....} = req.body
     const newListing =new Listing(req.body.listing); //created listing as obejct ,& title,desc..etc as key (see in new.ejs)
     newListing.owner = req.user._id ; //new listing owner must be current user id
     newListing.image = {url,filename}; //add values in newListing.image
     
     // 🗺️ Geocoding — convert location text to coordinates
  try {
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
            q:`${req.body.listing.location} ${req.body.listing.country}`,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "WanderLust/1.0" // required by Nominatim!
        }
      }
    );
    console.log(geoResponse.data);
    
    const geoData = geoResponse.data[0];
    if (geoData) {
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData.lon), parseFloat(geoData.lat)]
      };
    }
  } catch (err) {
    console.log("Geocoding failed:", err.message);
    // listing will still save, just without coordinates
  }

     await newListing.save(); //save listing
     req.flash("success" , "new listing created!"); //using flash message
     res.redirect("/listings");
};

module.exports.renderEditListing = async(req,res,next)=>{
    let {id}= req.params ;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested");
        res.render("/listings");
    }

    let originalImageUrl = listing.image.url; //extracting image url
    //decreasing pixels of edit image => ** Claudinary image transformation **
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res,next) => {
  let {id}= req.params ;

  let listing = await Listing.findByIdAndUpdate(
      id,
      {...req.body.listing},
      { new: true }
  );

  // ✅ geocode updated location
  try {
      const geoResponse = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
              params: {
                  q: `${req.body.listing.location} ${req.body.listing.country}`,
                  format: "json",
                  limit: 1
              },
              headers: {
                  "User-Agent": "WanderLust/1.0"
              }
          }
      );

      const geoData = geoResponse.data[0];

      if (geoData) {
          listing.geometry = {
              type: "Point",
              coordinates: [
                  parseFloat(geoData.lon),
                  parseFloat(geoData.lat)
              ]
          };
      }

  } catch (err) {
      console.log("Geocoding failed:", err.message);
  }

  // image update
  if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url , filename };
  }

  await listing.save();

  req.flash("success" , "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res,next)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
}