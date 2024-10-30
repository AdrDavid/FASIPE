// models/Promocao.js

const Sequelize = require('sequelize');
const connection = require('../database/database');

const Promocao = connection.define('promocoes', {
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    link: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Promocao.sync({force: true}).then(() =>{
// console.log('tabela criada')
// })

module.exports = Promocao;
