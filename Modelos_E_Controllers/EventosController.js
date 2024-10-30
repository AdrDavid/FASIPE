// controllers/EventosController.js
const multer = require("multer")
const express = require('express');
const router = express.Router();
const Evento = require('./Eventos');
const adminAuth = require('../middlewares/adminAuth');
const path = require("path")
const slugify = require('slugify');
const Logo = require('./Logo');





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/arquivosEventos/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB
    }
});




router.get('/admin/adc/eventos', adminAuth, (req, res) => {
    Evento.findAll().then(eventos => {
        res.render('admin/adc/eventos', { eventos: eventos });
    }).catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/admin/adc/eventos');
    });
});
router.get('/eventos', adminAuth, (req, res) => {
    Promise.all([
        Evento.findAll(),
        Logo.findAll()
    ])
    .then(([eventos, logos]) => {
        res.render('eventos', { eventos: eventos, logos: logos });
    })
    .catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/eventos');
    });
});


router.post('/eventos/salvar', adminAuth, upload.single('imagemEvento'), (req, res) => {
    const { nome, descricao, linkSaibaMais, linkInscreverSe } = req.body;
    const imagemEvento = req.file ? req.file.filename : null;

    if (nome && descricao && imagemEvento) {
        Evento.create({
            nome: nome,
            descricao: descricao,
            imagem: imagemEvento,
            slug: slugify(nome),
            linkSaibaMais: linkSaibaMais,
            linkInscreverSe: linkInscreverSe
        }).then(() => {
            res.redirect('/admin/adc/eventos');
        }).catch(err => {
            console.error('Erro ao salvar evento:', err);
            res.redirect('/admin/adc/eventos');
        });
    } else {
        console.log('Campos faltando');
        res.redirect('/admin/adc/eventos');
    }
});


router.post('/eventos/deletar', adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        Evento.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/adc/eventos');
        })
        .catch(err => {
            console.error('Erro ao deletar evento:', err);
            res.redirect('/admin/adc/eventos');
        });
    } else {
        res.redirect('/admin/adc/eventos');
    }
});


module.exports = router;
