const Sequelize = require('sequelize');
const connection = require('../database/database');

const Inicio = connection.define('inicios', {
    imagem: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Cria a tabela se não existir
// Inicio.sync({ force: false })
//     .then(() => {
//         console.log('Tabela "inicios" criada com sucesso!');
//     })
//     .catch(err => {
//         console.error('Erro ao criar a tabela "inicios":', err);
//     });

module.exports = Inicio;
