const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "dn47bnyxc",
  api_key: "554799146984844",
  api_secret: "xuKgIfQp9_aYIBmz6zsrhXvnopM"
})

const storage= new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'AssistProject',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
})

module.exports = {
    cloudinary,
    storage
}