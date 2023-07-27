const db = require("../sequelize");
const Sequelize = require("sequelize");

const Livros = db.define('Livro', {
    codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    autor: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    url_foto: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ano_publicacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    preco: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    }
});

Livros.sync();

module.exports = Livros;