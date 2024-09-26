const multer = require('multer');
const path = require('path');

// Définir le stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'image/'); // Dossier de stockage des images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque image
  },
});

// Vérification du type de fichier
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb('Error: Images uniquement');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de taille de fichier : 5 MB
  fileFilter: fileFilter,
});

module.exports = upload;
