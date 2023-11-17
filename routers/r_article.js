const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/c_article");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './image/articles/');
    },
    filename: (req, file, cb) =>{
        cb(null, "article" + Date.now() + file.originalname);
    }
});

const uploaded = multer({storage: storage});

//RUTA DE PRUEBA
router.get("/ruta-prueba", ArticleController.test);
router.get("/cursos", ArticleController.cursos);

// RUTA CRUD
router.post("/create", ArticleController.create);
router.get("/articles/:ultimos?", ArticleController.showList);
router.get("/article/:id", ArticleController.single);
router.delete("/article/:id", ArticleController.deleter);
router.put("/article/:id", ArticleController.edit);
router.post("/subir-imagen/:id", [uploaded.single("file")], ArticleController.upload);
router.get("/imagen/:file", ArticleController.image);
router.get("/buscar/:search", ArticleController.search);

module.exports = router;