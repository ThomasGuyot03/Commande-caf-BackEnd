const models = require('../models/models'); // Assure-toi que le chemin est correct

// Récupérer tous les comptes clients
exports.getAllClientAccounts = async (req, res) => {
    try {
        const accounts = await models.User.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.error("Erreur lors de la récupération des comptes clients :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes clients' });
    }
};

// Récupérer un compte client par ID
exports.getAccountById = async (req, res) => {
    // const accountId = req.params.id;
    try {
        const account = await models.User.findOne({ accountId: req.params.id }); 
        if (!account) {
            return res.status(404).json({ error: 'Compte client non trouvé' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.error("Erreur lors de la récupération du compte client :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération du compte client' });
    }
};
