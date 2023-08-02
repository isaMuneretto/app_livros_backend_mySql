const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
      host: process.env.DB_HOST,
      dialect: "mysql",
  }
);

// Verifica se há algum erro na conexão
db.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

module.exports = db;
