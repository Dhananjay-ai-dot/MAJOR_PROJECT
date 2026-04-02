const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); //require only for {deleting reviews of listing if listing is deleted}

const listingSchema = new Schema({ //cretaing schema
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename: String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId, //storing object_id in array of individual item
            ref:"Review", //model we have exported from reviews.js file
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
        }
      }
});
//delete listing array reviews=> as listing is deleted
listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
     await Review.deleteMany({_id : {$in:listing.reviews}}); //$in=> means part of
    }
});
//using schema to create model
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ; //export model to app.js