const path = require('path');
const fs = require('fs');

const handleFileUpload = async (file, allowedExtensions, folderPath, res) => {
    if (file) {
        const fileExtension = path.extname(file.name).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ message: 'Invalid file type. Please Try Another File Type' });
        }

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filePath = path.join(folderPath, fileUniqueName + fileExtension);

        file.mv(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error while uploading file' });
            }
        });

        return fileUniqueName+fileExtension;
    }
};

module.exports = { handleFileUpload };
