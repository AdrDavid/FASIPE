const Inicio = require('./Inicio');
const multer = require("multer")
const express = require('express');
const router = express.Router();
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




router.get('/admin/adc/inicio', adminAuth, (req, res) => {
    Inicio.findAll().then(inicios => {
        res.render('admin/adc/inicio', { inicios: inicios });
    }).catch(err => {
        console.error('Erro ao buscar notícias:', err);
        res.redirect('/admin/adc/inicio');
    });
});



router.post('/inicio/salvar', adminAuth, upload.single('imagem'), (req, res) => {
    const { titulo, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null;

    
    Inicio.findOne().then(inicioExistente => {
        if (inicioExistente) {
           
            inicioExistente.update({
                titulo: titulo,
                descricao: descricao,
                imagem: imagem
            }).then(() => {
                res.redirect('/admin/adc/inicio');
            }).catch(err => {
                console.error('Erro ao atualizar Início:', err);
                res.redirect('/admin/adc/inicio');
            });
        } else {
          
            Inicio.create({
                titulo: titulo,
                descricao: descricao,
                imagem: imagem
            }).then(() => {
                res.redirect('/admin/adc/inicio');
            }).catch(err => {
                console.error('Erro ao salvar Início:', err);
                res.redirect('/admin/adc/inicio');
            });
        }
    }).catch(err => {
        console.error('Erro ao buscar Início existente:', err);
        res.redirect('/admin/adc/inicio');
    });
});


// router.post('/inicio/deletar', adminAuth, (req, res) => {
//     const id = req.body.id;

//     if (id) {
//         Inicio.destroy({
//             where: {
//                 id: id
//             }
//         })
//         .then(() => {
//             res.redirect('/admin/adc/inicio');
//         })
//         .catch(err => {
//             console.error('Erro ao deletar início:', err);
//             res.redirect('/admin/adc/inicio');
//         });
//     } else {
//         res.redirect('/admin/adc/inicio');
//     }
// });



module.exports = router;