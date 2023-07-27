//importando o framework express
const express = require("express");
//importando o framework express.Router
const router = express.Router();
const Livros = require('../model/livros');
const db = require("../sequelize");
const { Sequelize } = require("sequelize");

//Busca todos os livros
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    Livros.findAll({
        offset: (page - 1) * limit,
        limit: +limit,
        order: [['updatedAt', 'desc']]
    }).then((Livros) => { res.json(Livros) });
});


//GET Consulta um livro pelo ID
router.get("/:id", async (req, res) => {
    try {
        const Livros = await Livros.findByPk(req.params.id);
        if (!Livros) {
            res.status(404).json({
                sucess: false,
                message: "Livro não encontrado!",
            });
        } else {
            res.json({
                sucess: true,
                livros: Livros,
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//Busca com filtro
router.get("/filtro/:palavra", async (req, res) => {
    const palavra = req.params.palavra;
    try {
        const query = `SELECT * FROM livros WHERE titulo LIKE :palavra OR autor LIKE :palavra;`;

        const livros = await db.query(query, {
            replacements: { palavra: `%${palavra}%` },
            type: db.QueryTypes.SELECT,
        });
        res.status(200).json(livros);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

//Resumo do cadastro de livros
router.get("/dados/resumo", async (req, res) => {
    try {
        const resumo = await Livros.findOne({
            attributes: [
                [db.sequelize.fn('COUNT', db.sequelize.col('codigo')), 'num'],
                [db.sequelize.fn('SUM', db.sequelize.col('preco')), 'soma'],
                [db.sequelize.fn('MAX', db.sequelize.col('preco')), 'maior'],
                [db.sequelize.fn('AVG', db.sequelize.col('preco')), 'media'],
            ],
        });

        console.log('Resumo:', resumo); // Adicione este log para ver os resultados

        const { num, soma, maior, media } = resumo;
        res.status(200).json({ num, soma, maior, media: Number(media.toFixed(2)) });
    } catch (error) {
        console.log('Erro:', error); // Adicione este log para ver o erro
        res.status(400).json({ msg: error.message });
    }
});

//Exibir o gráfico com a soma dos preços agrupados por ano
router.get("/dados/grafico", async (req, res) => {
    try {
        // Obtém ano e soma do preço dos livros, agrupados por ano
        const totalPorAno = await Livros.findAll({
            attributes: [
                'ano',
                [Sequelize.fn('SUM', Sequelize.col('preco')), 'total'],
            ],
            group: 'ano',
        });

        console.log('Dados do Gráfico:', totalPorAno); // Adicione este log para ver os resultados

        res.status(200).json(totalPorAno);
    } catch (error) {
        console.log('Erro:', error); // Adicione este log para ver o erro
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;

//POST Cria uma tarefa 
router.post("/", async (req, res) => {
    try {
        const { titulo, autor, url_foto, ano_publicacao, preco } = req.body;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!titulo || !autor || !url_foto || !ano_publicacao || !preco) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const novaTarefa = await Livros.create({
            titulo,
            autor,
            url_foto,
            ano_publicacao,
            preco,
        });
        return res.status(201).json(novaTarefa);
    } catch (err) {
        console.error('Erro ao criar livro:', err);
        return res.status(500).json({ err: 'Erro interno do servidor ao criar livro.' });
    }
});

//PUT Atualiza um livro pelo ID
router.put("/:codigo", async (req, res) => {
    try {
        const livro = await Livros.findByPk(req.params.codigo);

        if (!livro) {
            res.status(404).json({
                sucess: false,
                message: "Livro não encontrado!",
            });
        } else {
            await livro.update({
                preco: req.body.preco,
            });
            res.json({
                sucess: true,
                message: "Preço do livro atualizado com sucesso!",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//DELETE Deleta uma tarefa pelo ID
router.delete("/:codigo", async (req, res) => {
    try {
        const livro = await Livros.findByPk(req.params.codigo);
        if (!livro) {
            res.status(404).json({
                sucess: false,
                message: "Livro não encontrado!",
            });
        } else {
            await livro.destroy();
            res.json({
                sucess: true,
                message: "Livro deletado com sucesso!",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

module.exports = router;

