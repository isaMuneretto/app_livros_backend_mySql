//importação das bibliotecas 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./sequelize");


//cria uma instância do Express e define a porta em que o servidor irá escutar
const app = express();


app.use(cors());
// Configurando o express para aceitar JSON
//bodyParser.urlencoded analisa corpos de solicitação HTTP
//extended: true analisa dados codificados de forms que possuem estrutura aninhada (array e obj)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importando os modelos
const Livro = require('./model/livros');
const Autor = require('./model/autores');
const Editora = require('./model/editoras');

//importação das rotas
const livros = require('./routes/livros');
const autores = require('./routes/autores');
const editoras = require('./routes/editoras');

//definição das rotas
app.use('/livros',livros);
app.use('/autores',autores);
app.use('/editoras',editoras);

db
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});