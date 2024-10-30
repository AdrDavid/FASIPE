const Sequelize = require("sequelize")
const connection = require("../database/database")

const Evento = connection.define('evento', {
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    nome: {
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
    },
    linkSaibaMais: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    linkInscreverSe: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Evento.sync({force: true}).then(() =>{
// console.log('tabela criada')
// })

module.exports = Evento;