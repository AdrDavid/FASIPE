const multer = require("multer")
const express = require('express');
const router = express.Router();
const Promocao = require('./Promocao');
const adminAuth = require('../middlewares/adminAuth');
const path = require("path")




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




router.get('/admin/adc/promocao', adminAuth, (req, res) => {
    Promocao.findAll().then(promocoes => {
        res.render('admin/adc/promocao', { promocoes: promocoes });
    }).catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/admin/adc/promocao');
    });
});




router.post('/promocoes/salvar', adminAuth, upload.single('imagemPromocao'), (req, res) => {
    const { titulo, descricao, link } = req.body;
    const imagemPromocao = req.file ? req.file.filename : null;

    if (titulo && descricao && link && imagemPromocao) {
        Promocao.create({
            titulo: titulo,
            descricao: descricao,
            link: link,
            imagem: imagemPromocao
        })
        .then(() => {
            res.redirect('/admin/adc/promocao'); 
        })
        .catch(err => {
            console.error('Erro ao salvar promoção:', err);
            res.redirect('/admin/adc/promocao'); 
        });
    } else {
        res.redirect('/admin/adc/promocao'); 
        console.log('Campos faltando');
    }
});


router.post('/promocoes/deletar', adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        Promocao.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/adc/promocao');
        })
        .catch(err => {
            console.error('Erro ao deletar promoção:', err);
            res.redirect('/admin/adc/promocao');
        });
    } else {
        res.redirect('/admin/adc/promocao');
    }
});

module.exports = router;
