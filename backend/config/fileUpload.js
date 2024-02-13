const path = require('path');
const fs = require('fs');
const multer = require('multer');


// Generic function for configuring multer storage
const configureStorage = (folderPath) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = folderPath;
            // Create the directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname).toLowerCase();
            cb(null, fileUniqueName + fileExtension);
        }
    });
};

module.exports = { configureStorage };
