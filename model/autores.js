const db = require("../sequelize");
const Sequelize = require("sequelize");

const autores = db.define('autores', {
    codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sobrenome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    sexo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

autores.sync();

module.exports = autores;