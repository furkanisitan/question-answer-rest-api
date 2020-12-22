const multer = require("multer");
const CustomError = require("../error/CustomError");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        // req.user.id => from JWTAuth middleware
        req.savedImage = `image_${req.user.id}.${extension}`;
        cb(null, req.savedImage)
    }
})


const fileFilter = (req, file, cb) => {

    const allowedTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.mimetype))
        return cb(new CustomError("Please provide a valid image file", 400), false)

    return cb(null, true);
}

const photoUpload = multer({ storage, fileFilter });

module.exports = { photoUpload };


