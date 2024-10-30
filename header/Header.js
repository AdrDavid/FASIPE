
const Sequelize = require('sequelize')
const connection = require('./database');


const Cabecalho =  connection.define('cabecalho', {
    logo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
    
Cabecalho.sync({force: false}).then(() =>{
    console.log('tabela criada')
})


module.exports = Cabecalho;
