
const Logo = require('./Logo');
const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');


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


router.get('/admin/adc/logo', adminAuth, (req, res) => {
    Logo.findOne()
        .then(logo => {
            res.render('admin/adc/logo', { logo: logo });
        })
        .catch(err => {
            console.error('Erro ao buscar logo:', err);
            res.redirect('/admin/adc/logo');
        });
});






router.post('/logo/salvar', adminAuth, upload.single('imagem'), (req, res) => {
    const imagem = req.file ? req.file.filename : null;

    if (imagem) {
       
        Logo.findOne()
            .then(logoExistente => {
                if (logoExistente) {
                    
                    logoExistente.imagem = imagem;
                    return logoExistente.save();
                } else {
                   
                    return Logo.create({ imagem: imagem });
                }
            })
            .then(() => {
                res.redirect('/admin/adc/logo');
            })
            .catch(err => {
                console.error('Erro ao salvar logo:', err);
                res.redirect('/admin/adc/logo');
            });
    } else {
        res.redirect('/admin/adc/logo');
        console.log('Imagem da logo não fornecida');
    }
});

module.exports = router;
