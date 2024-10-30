const Sequelize = require('sequelize');
const connection = require('../database/database');

const Pesquisa = connection.define('pesquisas', {
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }

});

// Pesquisa.sync({force: true}).then(() =>{
//     console.log('tabela criada')
// })


module.exports = Pesquisa;
