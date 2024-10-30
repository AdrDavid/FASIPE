// Arquivo: controllers/NoticiasController.js
const express = require('express');
const router = express.Router();
const Noticia = require('./Noticia');
const adminAuth = require('../middlewares/adminAuth');
const multer = require("multer")
const path = require("path")
const Evento = require('./Eventos');
const Pesquisa = require('./Pesquisa');
const Promocao = require('./Promocao');
const slugify = require('slugify');

const Logo = require('./Logo');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/arquivosNoticias');
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



// router.get('/admin/adc/noticias', adminAuth, (req, res) => {
//     res.render('admin/adc/noticias');
// });

router.get('/admin/adc/noticias', adminAuth, (req, res) => {
    Noticia.findAll().then(noticias => {
        res.render('admin/adc/noticias', { noticias: noticias });
    }).catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/admin/adc/noticias');
    });
});

router.get('/noticias', adminAuth, (req, res) => {
    Promise.all([
        Noticia.findAll(),
        Logo.findAll()
    ])
    .then(([noticias, logos]) => {
        res.render('noticias', { noticias: noticias, logos: logos });
    })
    .catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/noticias');
    });
});


router.post('/noticias/salvar', adminAuth, upload.single('imagemNoticia'), (req, res) => {
    const { tituloNoticia, subtituloNoticia, conteudoNoticia, noticiaFixada } = req.body;
    const imagemNoticia = req.file ? req.file.filename : null;

    if (imagemNoticia && tituloNoticia && subtituloNoticia && conteudoNoticia && noticiaFixada) {
        Noticia.create({
            imagem: imagemNoticia,
            titulo: tituloNoticia,
            subtitulo: subtituloNoticia,
            slug: slugify(tituloNoticia),
            conteudo: conteudoNoticia,
            fixarCarrossel: noticiaFixada === 'sim'
        }).then(() => {
            res.redirect('/admin/adc/noticias');
        }).catch(err => {
            console.error('Erro ao salvar notícia:', err);
            res.redirect('/admin/adc/noticias');
        });
    } else {
        res.redirect('/admin/adc/noticias');
        console.log('Campos faltando');
    }
});








router.post('/noticias/deletar', adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        Noticia.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/adc/noticias');
        }).catch(err => {
            console.error('Erro ao deletar notícia:', err);
            res.redirect('/admin/adc/noticias');
        });
    } else {
        res.redirect('/admin/adc/noticias');
    }
});

router.post('/noticias/salvar', adminAuth, upload.single('imagemNoticia'), (req, res) => {
    const { tituloNoticia, subtituloNoticia, conteudoNoticia, noticiaFixada } = req.body;
    const imagemNoticia = req.file ? req.file.filename : null;

    if (imagemNoticia && tituloNoticia && subtituloNoticia && conteudoNoticia && noticiaFixada) {
        Noticia.create({
            imagem: imagemNoticia,
            titulo: tituloNoticia,
            subtitulo: subtituloNoticia,
            slug: slugify(tituloNoticia),
            conteudo: conteudoNoticia,
            fixarCarrossel: noticiaFixada === 'sim',
            curtidas: 0 // Adiciona campo curtidas ao criar notícia
        }).then(() => {
            res.redirect('/admin/adc/noticias');
        }).catch(err => {
            console.error('Erro ao salvar notícia:', err);
            res.redirect('/admin/adc/noticias');
        });
    } else {
        res.redirect('/admin/adc/noticias');
        console.log('Campos faltando');
    }
});



module.exports = router;
