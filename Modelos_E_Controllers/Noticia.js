
const Sequelize = require('sequelize');
const connection = require('../database/database');

const Noticia = connection.define('noticias',{
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subtitulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fixarCarrossel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    curtidas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

// Noticia.sync({force: false}).then(() =>{
//     console.log('tabela criada')
// })


module.exports = Noticia;
