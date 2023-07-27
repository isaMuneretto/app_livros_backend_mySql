//importando o framework express
const express = require("express");
//importando o framework express.Router
const router = express.Router();
const Autor = require('../model/autores');
const db = require("../sequelize");

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    Autor.findAll({
        offset: (page - 1) * limit,
        limit: +limit,
        order: [['updatedAt', 'desc']]
    }).then((Autor) => { res.json(Autor) });
});

//GET Consulta uma tarefa pelo ID
router.get("/:id", async (req, res) => {
    try {
        const autores = await autores.findByPk(req.params.id);
        if (!autores) {
            res.status(404).json({
                sucess: false,
                message: "Autor não encontrado!",
            });
        } else {
            res.json({
                sucess: true,
                autores: autores,
            });
        }

    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

router.get("/filtro/:palavra", async (req, res) => {
    const palavra = req.params.palavra;
  
    try {
      const query = `
        SELECT * FROM autores
        WHERE nome LIKE :palavra OR sobrenome LIKE :palavra;
      `;
  
      const autores = await db.query(query, {
        replacements: { palavra: `%${palavra}%` },
        type: db.QueryTypes.SELECT,
      });
  
      res.status(200).json(autores);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  });


  
//POST Cria uma tarefa 
router.post("/", async (req, res) => {
    try {
        const { nome, sobrenome, idade, data_nascimento, sexo, telefone } = req.body;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!nome || !sobrenome || !idade || !data_nascimento || !sexo || !telefone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const novaTarefa = await Autor.create({
            nome,
            sobrenome,
            idade,
            data_nascimento,
            sexo,
            telefone,
        });
        return res.status(201).json(novaTarefa);
    } catch (err) {
        console.error('Erro ao criar autor:', err);
        return res.status(500).json({ err: 'Erro interno do servidor ao criar autor.' });
    }
});


//PUT Atualiza uma tarefa pelo ID
router.put("/:codigo", async (req, res) => {
    try {
        const autor = await Autor.findByPk(req.params.codigo);
        if (!autor) {
            res.status(404).json({
                sucess: false,
                message: "Autor não encontrado!",
            });
        } else {
            await autor.update({
                telefone: req.body.telefone,
            });
            res.json({
                sucess: true,
                message: "Telefone do autor atualizado com sucesso!",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
})

//DELETE Deleta uma tarefa pelo ID
router.delete("/:codigo", async (req, res) => {
    try {
        const autor = await Autor.findByPk(req.params.codigo);
        if (!autor) {
            res.status(404).json({
                sucess: false,
                message: "Autor não encontrado!",
            });
        } else {
            await autor.destroy();
            res.json({
                sucess: true,
                message: "Autor deletado com sucesso!",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
})

module.exports = router;

