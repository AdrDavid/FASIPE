const Sequelize = require('sequelize');
const connection = require('../database/database');

const Logo = connection.define('Logo', {
    imagem: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Logo.sync({force: true}).then(() =>{
// console.log('tabela criada')
// })


module.exports = Logo;

