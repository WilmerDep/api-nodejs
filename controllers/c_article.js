const fs = require("fs");
const path = require("path");
const Article = require("../models/M_Article");
const { validateArticle } = require("../helpers/validate");
const { error } = require("console");

const test = (req, res) => {
  return res.status(200).json({
    message: "Soy una accion de prueba en mi controlador de Article",
  });
};

const cursos = (req, res) => {
  console.log("Se ha ejecutado el EndPoint Probando");

  return res.status(200).json([
    {
      curso: "Master en React",
      autor: "Wilmer Jimenez",
      url: "pholiodev.com/portafolio",
    },
    {
      curso: "Master en React Native",
      autor: "Wilmer Jimenez",
      url: "pholiodev.com/portafolio",
    },
  ]);
};

const create = (req, res) => {
  //RECOGER PARAMETROS POR POST  PARA GUARDARLO
  let parameters = req.body;

  // VALIDAR DATOS
  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Faltan datos por enviar : 400",
    });
  }

  //CREAR EL OBJETO A GUARDAR
  const article = new Article(parameters); // ASIGNAR VALORES AL OBJETO BASADO  EN EL MODELO ( MANUAL O AUTOMATICO )

  // GUARDAR ARTICULO EN LA BD
  article
    .save()
    .then((articleSaved) => {
      // DEVOLVER RESULTADOS
      return res.status(200).json({
        status: "success",
        article: articleSaved,
        message: "ARTICULO GUARDADO CON EXITO",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        message: "NO SE HA GUARDADO EL ARTICULO : 404",
        error,
      });
    });
};

const showList = (req, res) => {
  let consult = Article.find({});

  if (req.params.ultimos) {
    consult.limit(3);
  }

  consult
    .sort({ date: -1 })
    .exec()
    .then((Article) => {
      return res.status(200).json({
        status: "success",
        counter: Article.length,
        article: Article,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "NO SE HAN ENCONTRADO ARTICULOS : 404",
        error,
      });
    });
};

const single = (req, res) => {
  //RECOGER UN ID POR URL
  let articleId = req.params.id;
  //BUSCAR EL ARTICULO
  Article.findById(articleId)
    .then((Article) => {
      return res.status(200).json({
        status: "success",
        article: Article,
      });
    })
    .catch((error) => {
      // ERROR SI NO EXISTE
      return res.status(404).send({
        status: "error",
        message: "NO SE HAN ENCONTRADO EL ARTICULO : 404",
        error,
      });
    });
};

const deleter = (req, res) => {
  let articleId = req.params.id;

  Article.findOneAndDelete({ _id: articleId })
    .then((articleDeleted) => {
      return res.status(200).json({
        status: "success",
        message: "ARTICULO BORRADO CORRECTAMENTE",
        article: articleDeleted,
      });
    })
    .catch((error) => {
      return res.status(400).send({
        status: "error",
        message: "ERROR AL BORRAR EL ARTICULO : 400",
        error,
      });
    });
};

const edit = (req, res) => {
  let articleId = req.params.id;
  let parameters = req.body;

  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Faltan datos por enviar : 400",
    });
  }

  Article.findOneAndUpdate({ _id: articleId }, parameters, { new: true })
    .then((articleUpdate) => {
      return res.status(200).json({
        status: "success",
        message: "ARTICULO ACTUALIZADO CORRECTAMENTE",
        article: articleUpdate,
      });
    })
    .catch((error) => {
      return res.status(400).send({
        status: "error",
        message: "ERROR AL ACTUALIZAR EL ARTICULO : 400",
        error,
      });
    });
};

const upload = (req, res) => {
  // CONFIGURAR MULTER EN EL ARCHIVO DE RUTAS

  // RECOGER LA IMAGEN SUBIDA
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      message: " PETICION NO VALIDA",
    });
  }
  // NOMBRE DE LA IMAGEN
  let imageName = req.file.originalname;
  // EXTENSION DE LA IMAGEN
  let file_split = imageName.split(".");
  let extention = file_split[1];

  // COMPROBAR EXTENSION CORRECTA
  if (
    extention != "png" &&
    extention != "jpg" &&
    extention != "jpeg" &&
    extention != "webp" &&
    extention != "gif"
  ) {
    /// BORRAR ARCHIVO NO VALIDO
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        message:
          " ARCHIVO NO VALIDO, COMPRUEBE QUE SEA: PNG, JPG, JPEG, WEBP O GIF",
      });
    });
  } else {
    // DEVOLVER LA RESPUESTA
    let articleId = req.params.id;
    // ACTUALIZAR IMAGEN SUBIDA
    Article.findOneAndUpdate(
      { _id: articleId },
      { image: req.file.filename },
      { new: true }
    )
      .then((articleUpdate) => {
        return res.status(200).json({
          status: "success",
          message: "IMAGEN SUBIDA CORRECTAMENTE",
          article: articleUpdate,
          archive: req.file,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          status: "error",
          message: "ERROR AL ACTUALIZAR EL ARTICULO : 400",
          error,
        });
      });
  }
};
const image = (req, res) => {
  let file = req.params.file;
  let root_fisic = "./image/articles/" + file;

  fs.stat(root_fisic, (error, exist) => {
    if (exist) {
      return res.sendFile(path.resolve(root_fisic));
    } else {
      return res.status(404).json({
        status: "error",
        message: "ERROR LA IMAGEN NO EXISTE : 404",
        error,
        stats,
        root_fisic,
      });
    }
  });
};

const search = (req, res) => {
  // SACAR EL STRING DE BUSQUEDA
  let search = req.params.search;

  // HACER UN FIND A LA BD
  Article.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ],
  })
    // APLICAR ORDEN
    .sort({ data: -1 })
    // EJECUTAR CONSULTA
    .exec()
    // DEVOLVER RESULTADOS
    .then((articleSaved, error) => {
      if (error || !articleSaved || articleSaved.length <= 0) {
        return res.status(404).json({
          status: "error",
          message: "NO SE HAN ENCONTRADO ARTICULOS",
        });
      }
      return res.status(200).json({
        status: "success",
        articles: articleSaved,
      });
    });
};

module.exports = {
  test,
  cursos,
  create,
  showList,
  single,
  deleter,
  edit,
  upload,
  image,
  search,
};
