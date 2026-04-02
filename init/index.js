const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("../models/listing.js");

main().then(()=>{
    console.log("conneected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB =async () =>{
    await Listing.deleteMany({}); //delete everything that exist in db
    //just before storing data in db
    const newData = initData.data.map((obj)=>({ //shortcut=>store owner feature in every dataset in data.js
        ...obj , owner:"69c1e705cca469ee8f500587"
    }));
    await Listing.insertMany(newData); //data is key in sample data(see in data.js)
    console.log("data was initialized");
};
initDB();
