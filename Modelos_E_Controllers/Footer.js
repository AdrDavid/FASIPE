// models/Footer.js

const Sequelize = require("sequelize");
const connection = require("../database/database");

const Footer = connection.define('footer', {
    Contato: {
        type: Sequelize.STRING,
        allowNull: false
    },
    facebook: {
        type: Sequelize.STRING,
        allowNull: false
    },
    linkedin: {
        type: Sequelize.STRING,
        allowNull: false
    },
    instagram: {
        type: Sequelize.STRING,
        allowNull: false
    },
    youTube: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Texto: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Footer.sync({force: true}).then(() => {
//     console.log('Tabela criada');
// });

module.exports = Footer;
