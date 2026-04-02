const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

//no need to write , describe name
userSchema.plugin(passportLocalMongoose); //this will make username automatically , hash it , salt it , and save in (passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);