const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res,next)=>{
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is missing");
    }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ;  //author is assosiated with every review created
    console.log(newReview);
    listing.reviews.push(newReview); //reviews here is ARRAY in reviews.js file

    await newReview.save();//save review in database
    await listing.save(); //call .save() to make changes in existing document
    req.flash("success" , "New Review created!");
    res.redirect(`/listings/${listing._id}`);
    
};

module.exports.destroyReview =async (req,res,next)=>{
    let {id,reviewId} = req.params ; 

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //find in listing array of reviews , delete and update
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted!");
    res.redirect(`/listings/${id}`);
}