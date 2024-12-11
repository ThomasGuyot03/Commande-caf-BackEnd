const fs = require('fs')
const nodemailer = require('nodemailer')

const getTotalPrice = (panier) => {
    const totalPrice = panier.products.reduce((total, item) => total + item.price * item.quantity, 0)
    let amount = totalPrice
    if (panier.promo && panier.promo.percentage) {
        const promoAmount = (totalPrice * panier.promo.percentage) / 100;
        const finalPrice = totalPrice - promoAmount
        amount =  finalPrice
    } else {
        amount = totalPrice
    }
    amount = Math.round(amount * 100)
    return amount
}

function templateOrder(products,  user = null) {
    let rows = ''
    for (const product of products) {
        const { name, price, quantity } = product
        rows += `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
            </tr>
        `
    }

    let template = user ? fs.readFileSync("./templates/admin-order-template.html", 'utf8') : fs.readFileSync("./templates/order-template.html", 'utf8')
    template = template.replace('{{rows}}', rows)
    if (user) {
        console.log("user",user)
        template = template.replace('{{name}}', user.name + " " + user.firstname)
        template = template.replace('{{email}}', user.email)
        const address = `${user.address.line} ${user.address.zip_code} ${user.address.city}`
        console.log("adresse",address)
        template = template.replace('{{address}}', address)
    }
    return template
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




module.exports = { getTotalPrice, templateOrder, getTransporterMail }