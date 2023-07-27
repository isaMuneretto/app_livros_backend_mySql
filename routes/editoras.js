//importando o framework express
const express = require("express");
//importando o framework express.Router
const router = express.Router();
const Editora = require('../model/editoras');
const db = require("../sequelize");

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    Editora.findAll({
        offset: (page - 1) * limit,
        limit: +limit,
        order: [['updatedAt', 'desc']]
    }).then((Editora) => { res.json(Editora) });
});

//GET Consulta uma tarefa pelo ID
router.get("/:id", async (req, res) => {
    try {
        const editoras = await editoras.findByPk(req.params.id);
        if (!editoras) {
            res.status(404).json({
                sucess: false,
                message: "Editora não encontrada!",
            });
        } else {
            res.json({
                sucess: true,
                editoras: editoras,
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
            SELECT * FROM editoras
            WHERE nome LIKE :palavra;
          `;

        const editoras = await db.query(query, {
            replacements: { palavra: `%${palavra}%` },
            type: db.QueryTypes.SELECT,
        });

        res.status(200).json(editoras);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

//POST Cria uma tarefa 
router.post("/", async (req, res) => {
    try {
        const { nome, cidade, estado, telefone, rua, cep } = req.body;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!nome || !cidade || !estado || !telefone || !rua || !cep) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const novaTarefa = await Editora.create({
            nome,
            cidade,
            estado,
            telefone,
            rua,
            cep,
        });
        return res.status(201).json(novaTarefa);
    } catch (err) {
        console.error('Erro ao criar editora:', err);
        return res.status(500).json({ err: 'Erro interno do servidor ao criar editora.' });
    }
});


//PUT Atualiza uma tarefa pelo ID
router.put("/:codigo", async (req, res) => {
    try {
        const editora = await Editora.findByPk(req.params.codigo);
        if (!editora) {
            res.status(404).json({
                sucess: false,
                message: "Editora não encontrada!",
            });
        } else {
            await editora.update({
                telefone: req.body.telefone,
            });
            res.json({
                sucess: true,
                message: "Telefone da editora atualizada com sucesso!",
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
        const editora = await Editora.findByPk(req.params.codigo);
        if (!editora) {
            res.status(404).json({
                sucess: false,
                message: "Editora não encontrada!",
            });
        } else {
            await editora.destroy();
            res.json({
                sucess: true,
                message: "Editora deletada com sucesso!",
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

