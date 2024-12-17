const fs = require('fs');
// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');
// require('dotenv').config();

const getTotalPrice = (panier) => {
    const totalPrice = panier.products.reduce((total, item) => total + item.price * item.quantity, 0);
    let amount = totalPrice;
    if (panier.promo && panier.promo.percentage) {
        const promoAmount = (totalPrice * panier.promo.percentage) / 100;
        const finalPrice = totalPrice - promoAmount;
        amount = finalPrice;
    } else {
        amount = totalPrice;
    }
    amount = Math.round(amount * 100);
    return amount;
};

function templateOrder(products, user = null) {
    let rows = '';
    for (const product of products) {
        const { name, price, quantity } = product;
        rows += `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
            </tr>
        `;
    }

    let template = user ? fs.readFileSync("./templates/admin-order-template.html", 'utf8') : fs.readFileSync("./templates/order-template.html", 'utf8');
    template = template.replace('{{rows}}', rows);
    if (user) {
        console.log("user", user);
        template = template.replace('{{name}}', user.name + " " + user.firstname);
        template = template.replace('{{email}}', user.email);
        const address = `${user.address.line} ${user.address.zip_code} ${user.address.city}`;
        console.log("adresse", address);
        template = template.replace('{{address}}', address);
    }
    return template;
}

// // Fonction pour obtenir le transporter Nodemailer avec OAuth2 ou passer en mode stand-by
// async function getTransporterMail() {
//     // Si l'envoi d'e-mails est désactivé, on ne crée pas de transporter
//     if (process.env.MAIL_ENABLED === 'false') {
//         console.log('Le système de mail est actuellement désactivé.');
//         return null; // Retourne null pour indiquer qu'on ne veut pas envoyer d'e-mails
//     }

//     try {
//         const CLIENT_ID = process.env.CLIENT_ID;
//         const CLIENT_SECRET = process.env.CLIENT_SECRET;
//         const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//         const REDIRECT_URI = 'https://developers.google.com/oauthplayground'; // URL de redirection que vous utilisez

//         // Création de l'instance OAuth2 avec vos informations d'identification
//         const oAuth2Client = new google.auth.OAuth2(
//             CLIENT_ID,
//             CLIENT_SECRET,
//             REDIRECT_URI
//         );

//         // Définir le refresh token pour obtenir un access token
//         oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//         // Récupérer le access token
//         const accessToken = await oAuth2Client.getAccessToken();

//         // Configurer le transporteur Nodemailer avec OAuth2
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'datcommande@gmail.com', // Remplacez par votre adresse e-mail
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken.token // Utilisation du token d'accès pour l'authentification OAuth2
//             }
//         });

//         return transporter;
//     } catch (error) {
//         console.error('Erreur de configuration du transporteur:', error);
//         throw error;
//     }
// }

module.exports = { getTotalPrice, templateOrder, getTransporterMail };
