const multer = require("multer");
const express = require('express');
const router = express.Router();
const Video = require('./Video');
const adminAuth = require('../middlewares/adminAuth');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
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
        fileSize: 1024 * 1024 * 100 // Limite de 100MB
    }
});

router.get('/admin/adc/videos', adminAuth, (req, res) => {
    Video.findAll() // Consulta todos os vídeos do banco de dados
        .then(videos => {
            res.render('admin/adc/videos', { videos: videos }); // Passa os vídeos para a view
        })
        .catch(err => {
            console.error('Erro ao buscar vídeos:', err);
            res.redirect('/admin'); // Redireciona em caso de erro
        });
});

router.post('/videos/salvar', adminAuth, upload.single('video'), (req, res) => {
    const { titulo, descricao } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    
    Video.findOne().then(videoExistente => {
        if (videoExistente) {
           
            videoExistente.update({
                titulo: titulo,
                descricao: descricao,
                url: videoUrl
            }).then(() => {
                res.redirect('/admin/adc/videos');
            }).catch(err => {
                console.error('Erro ao atualizar vídeo:', err);
                res.redirect('/admin/adc/videos');
            });
        } else {
           
            Video.create({
                titulo: titulo,
                descricao: descricao,
                url: videoUrl
            }).then(() => {
                res.redirect('/admin/adc/videos');
            }).catch(err => {
                console.error('Erro ao salvar vídeo:', err);
                res.redirect('/admin/adc/videos');
            });
        }
    }).catch(err => {
        console.error('Erro ao buscar vídeo existente:', err);
        res.redirect('/admin/adc/videos');
    });
});



router.post('/videos/:id/deletar', (req, res) => {
    const id = req.params.id;
    Video.findByPk(id)
        .then(video => {
            if (video) {
                return video.destroy();
            } else {
                throw new Error('Vídeo não encontrado');
            }
        })
        .then(() => {
            res.redirect('/admin/adc/videos');
        })
        .catch(err => {
            console.error('Erro ao deletar vídeo:', err);
            res.redirect('/');
        });
});



module.exports = router;