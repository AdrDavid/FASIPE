const multer = require("multer")
const express = require('express');
const router = express.Router();
const Pesquisa = require('./Pesquisa');
const adminAuth = require('../middlewares/adminAuth');
const path = require("path")
const slugify = require('slugify');

const Logo = require('./Logo');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
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




router.get('/admin/adc/pesquisas', adminAuth, (req, res) => {
    Pesquisa.findAll().then(pesquisas => {
        res.render('admin/adc/pesquisas', { pesquisas: pesquisas });
    }).catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/admin/adc/pesquisas');
    });
});


router.get('/pesquisa', adminAuth, (req, res) => {
    Promise.all([
        Pesquisa.findAll(),
        Logo.findAll()
    ])
    .then(([pesquisas, logos]) => {
        res.render('pesquisa', { pesquisas: pesquisas, logos: logos });
    })
    .catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/pesquisa');
    });
});






router.post('/pesquisas/salvar', adminAuth, upload.single('imagemPesquisa'), (req, res) => {
    const { titulo, descricao } = req.body;
    const imagemPesquisa = req.file ? req.file.filename : null;

    if (titulo && descricao && imagemPesquisa) {
        Pesquisa.create({
            titulo: titulo,
            slug: slugify(titulo),
            descricao: descricao,
            imagem: imagemPesquisa
        })
        .then(() => {
            res.redirect('/admin/adc/pesquisas'); // Redirecionar após salvar com sucesso
        })
        .catch(err => {
            console.error('Erro ao salvar pesquisa:', err);
            res.redirect('/admin/adc/pesquisas'); // Redirecionar em caso de erro
        });
    } else {
        res.redirect('/admin/adc/pesquisas'); // Redirecionar se faltarem campos
        console.log('Campos faltando');
    }
});


router.post('/pesquisas/deletar', adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        Pesquisa.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/adc/pesquisas');
        })
        .catch(err => {
            console.error('Erro ao deletar pesquisa:', err);
            res.redirect('/admin/adc/pesquisas');
        });
    } else {
        res.redirect('/admin/adc/pesquisas');
    }
});


module.exports = router;
