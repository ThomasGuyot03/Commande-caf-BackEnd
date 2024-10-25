const jwt = require("jsonwebtoken");
const models = require('../models/models');

module.exports = async (req, res, next) => {
  const checkToken = req.headers.authorization;
  
  if (checkToken) {
    try {
      // Extraction du token JWT depuis le header Authorization
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decodedToken.userId;

      // Vérification si l'utilisateur existe dans la base de données
      const user = await models.User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Attache l'userId à la requête pour une utilisation future
      req.userId = userId;
      req.accountId = user.accountId
      // Si une route nécessite que l'ID utilisateur soit dans le body
      if (req.body.userId && req.body.userId !== userId) {
        return res.status(401).json({ error: "Requête non autorisée : ID utilisateur non valide." });
      }

      // Poursuit le flux de la requête
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentification échouée.' });
    }
  } else {
    return res.status(401).json({ error: 'Authentification requise.' });
  }
};
