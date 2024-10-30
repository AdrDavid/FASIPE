const Sequelize = require('sequelize');
const connection = require('../database/database');

const Video = connection.define('videos', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Video.sync({ force: false });

module.exports = Video;
