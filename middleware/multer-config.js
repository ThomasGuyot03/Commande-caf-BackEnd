const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // Remplace les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    
    // Extraire l'extension de fichier à partir du nom original
    const extension = path.extname(name).toLowerCase(); // Ex: .jpg
    const baseName = path.basename(name, extension); // Ex: mon_image

    // Création d'un nom de fichier unique
    callback(null, baseName + "_" + Date.now() + extension); // Ex: mon_image_123456789.jpg
  },
});

module.exports = multer({ storage: storage }).single("image");
