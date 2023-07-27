const { Sequelize } = require('sequelize');

const db = new Sequelize('gestao_livros', 'rhaisa', '27819814', {
  host: 'localhost',
  dialect: 'mysql',
});

// Verifica se há algum erro na conexão
db.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

module.exports = db;
