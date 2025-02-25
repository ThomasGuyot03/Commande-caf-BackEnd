const fs = require('fs');
const nodemailer = require('nodemailer');

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
    amount = Math.round(amount * 100); // En centimes
    return amount;
};

function templateOrder(products, totalPrice) {
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

    let template = fs.readFileSync("./templates/order-template.html", 'utf8');
    template = template.replace('{{rows}}', rows);

    return template;
}

async function getTransporterMail() {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'datcommande@gmail.com',
                pass: process.env.GMAIL_PASS
            }
        });
        return transporter;
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw error;   
    }
}

// Fonction pour envoyer l'email de la commande
async function sendOrderEmail(panier, customer) {
    try {
        const transporter = await getTransporterMail();

        // Calculer le prix total de la commande
        const totalPrice = getTotalPrice(panier);

        // Générer le modèle HTML de l'email
        const emailTemplate = templateOrder(panier.products, totalPrice);

        // Paramètres de l'email
        const mailOptions = {
            from: 'datcommande@gmail.com',
            to: 'destinataire@example.com', // Remplacer par l'email du destinataire
            subject: `Nouvelle commande de ${customer.name}`,
            html: emailTemplate,
        };

        // Envoi de l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé :', info.response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        throw error;
    }
}

module.exports = { getTotalPrice, templateOrder, getTransporterMail, sendOrderEmail };
