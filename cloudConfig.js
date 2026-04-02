const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//credentials needs to connect with .env to cloudinary
cloudinary.config({ //all names written are standard fixed
     cloud_name: process.env.CLOUD_NAME,//from .env
     api_key: process.env.CLOUD_API_KEY,
     api_secret: process.env.CLOUD_API_SECRET
});

//copy storage part
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_dev',
      allowedformats: ["png","jpg","jpeg"],
    },
  });

module.exports = {
    cloudinary,
    storage
}