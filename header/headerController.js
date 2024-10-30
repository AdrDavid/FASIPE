// Arquivo: controllers/CabecalhoController.js
const express = require('express');
const router = express.Router();
const Cabecalho = require('./Header');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/cabecalho/novo', adminAuth, (req, res) => {
    res.render('admin/cabecalho/novo');
});

router.post('/cabecalho/salvar', adminAuth, (req, res) => {
    const { logo, tituloCabecalho } = req.body;

    if (logo && tituloCabecalho) {
        Cabecalho.create({
            logo: logo,
            tituloCabecalho: tituloCabecalho
        }).then(() => {
            res.redirect('/admin/cabecalho');
        }).catch(err => {
            console.error('Erro ao salvar cabeçalho:', err);
            res.redirect('/admin/cabecalho');
        });
    } else {
        res.redirect('/admin/cabecalho');
    }
});

router.get('/admin/cabecalho', adminAuth, (req, res) => {
    Cabecalho.findAll().then(cabecalhos => {
        res.render('admin/cabecalho/index', { cabecalhos: cabecalhos });
    }).catch(err => {
        console.error('Erro ao buscar cabeçalhos:', err);
        res.redirect('/admin/cabecalho');
    });
});

router.post('/cabecalho/deletar', adminAuth, (req, res) => {
    const id = req.body.id;

    if (id) {
        Cabecalho.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/cabecalho');
        }).catch(err => {
            console.error('Erro ao deletar cabeçalho:', err);
            res.redirect('/admin/cabecalho');
        });
    } else {
        res.redirect('/admin/cabecalho');
    }
});

router.get('/admin/cabecalho/editar/:id', adminAuth, (req, res) => {
    const id = req.params.id;

    if (!isNaN(id)) {
        Cabecalho.findByPk(id).then(cabecalho => {
            if (cabecalho) {
                res.render('admin/cabecalho/editar', { cabecalho: cabecalho });
            } else {
                res.redirect('/admin/cabecalho');
            }
        }).catch(err => {
            console.error('Erro ao buscar cabeçalho por ID:', err);
            res.redirect('/admin/cabecalho');
        });
    } else {
        res.redirect('/admin/cabecalho');
    }
});

router.post('/cabecalho/atualizar', adminAuth, (req, res) => {
    const { id, logo, tituloCabecalho } = req.body;

    if (id && logo && tituloCabecalho) {
        Cabecalho.update({
            logo: logo,
            tituloCabecalho: tituloCabecalho
        }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/cabecalho');
        }).catch(err => {
            console.error('Erro ao atualizar cabeçalho:', err);
            res.redirect('/admin/cabecalho');
        });
    } else {
        res.redirect('/admin/cabecalho');
    }
});

module.exports = router;
