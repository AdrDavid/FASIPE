const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');
// const adminAuth = require('../middlewares/adminAuth');
// Importando modelos e controladores
const connection = require('./database/database');
const noticiasController = require('./Modelos_E_Controllers/NoticiasController');
const pesquisaController = require('./Modelos_E_Controllers/PesquisaController');
const promocaoController = require('./Modelos_E_Controllers/PromocaoController');
const inicioController = require('./Modelos_E_Controllers/InicioController');
const eventosController = require('./Modelos_E_Controllers/EventosController');
const VideoController = require('./Modelos_E_Controllers/VideoController');
const FooterController = require('./Modelos_E_Controllers/FooterController');
const LogoController = require('./Modelos_E_Controllers/LogoController');


const Noticia = require('./Modelos_E_Controllers/Noticia');
const Evento = require('./Modelos_E_Controllers/Eventos');
const Pesquisa = require('./Modelos_E_Controllers/Pesquisa')
const Promocao = require('./Modelos_E_Controllers/Promocao')
const Inicio = require('./Modelos_E_Controllers/Inicio');
const Video = require('./Modelos_E_Controllers/Video');
const Footer = require('./Modelos_E_Controllers/Footer');
const Logo = require('./Modelos_E_Controllers/Logo');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexão com o banco de dados
connection.authenticate().then(()=>{
    console.log("BANCO DE DADOS CONECTADO")
}).catch((error)=>{
    console.log(error)
})
// Rotas principais
app.use('/', noticiasController);
app.use('/', eventosController);
app.use('/', pesquisaController);
app.use('/', inicioController);
app.use('/', promocaoController);
app.use('/', VideoController);
app.use('/', FooterController);
app.use('/', LogoController);

app.get('/', (req, res) => {
    Promise.all([
        Noticia.findAll({}),
        Evento.findAll({}),
        Pesquisa.findAll({}),
        Promocao.findAll({}), 
        Inicio.findAll({}), 
        Video.findAll({}), 
        Footer.findAll({}),
        Logo.findAll({})  
    ])
    .then(([noticias, eventos, pesquisas, promocoes, inicios, videos, footers, logos]) => {
        res.render('index', { 
            noticias: noticias, 
            eventos: eventos, 
            pesquisas: pesquisas,
            promocoes: promocoes, 
            inicios: inicios, 
            videos: videos, 
            footers: footers,
            logos: logos  
        });
    })
    .catch(err => {
        console.error('Erro ao buscar notícias, eventos, pesquisas, promoções, inícios, vídeos e logos:', err);
        res.redirect('/admin/noticias');
    });
});



// app.post('/noticia/curtir/:id', (req, res) => {
//     const id = req.params.id;
//     Noticia.findByPk(id)
//         .then(noticia => {
//             if (noticia) {
//                 noticia.increment('curtidas')
//                     .then(() => {
//                         res.redirect(`/noticia/${noticia.slug}`);
//                     })
//                     .catch(err => {
//                         console.error('Erro ao incrementar curtidas:', err);
//                         res.redirect('/');
//                     });
//             } else {
//                 res.redirect('/');
//             }
//         })
//         .catch(err => {
//             console.error('Erro ao buscar notícia:', err);
//             res.redirect('/');
//         });
// });


// Rota para notícias
app.get("/noticia/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const noticia = await Noticia.findOne({
            where: { slug: slug }
        });
        if (noticia) {
            const logos = await Logo.findAll();
            res.render("slugs/noticia", { noticia: noticia, logos: logos });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        res.redirect("/");
    }
});

// Rota para eventos
app.get("/evento/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const evento = await Evento.findOne({
            where: { slug: slug }
        });
        if (evento) {
            const logos = await Logo.findAll();
            res.render("slugs/evento", { evento: evento, logos: logos });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error("Erro ao buscar evento:", err);
        res.redirect("/");
    }
});

// Rota para pesquisas
app.get("/pesquisa/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const pesquisa = await Pesquisa.findOne({
            where: { slug: slug }
        });
        if (pesquisa) {
            const logos = await Logo.findAll();
            res.render("slugs/pesquisa", { pesquisa: pesquisa, logos: logos });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error("Erro ao buscar pesquisa:", err);
        res.redirect("/");
    }
});


app.get('/admin', (req, res) => {
    res.render('admin/adc/adm'); // Renderiza o arquivo index.ejs
});

app.listen(8080, () => {
    console.log('Servidor ligado');
});
