const { connection } = require("./database/connection");
const express = require ("express");
const cors = require ("cors");

//inicializa la APP
console.log("App Conectada");

// conecta a la base de datos
connection();

// crear servidor de node
const app = express();
const portserver = 3900;
// configurar cons como intermediario ( middleware ) para evitar porblemas.
app.use(cors());

/// convertir body a objeto JS
app.use(express.json()); // - RESIBE LOS DATOS COMO: content-type app/json
app.use(express.urlencoded({extended:true})); // - convierte los valores en formato json enviados por formularios

// RUTAS - IMPORTADAS
const router_article = require("./routers/r_article");

// CARGAR RUTAS
app.use("/api", router_article);

// RUTAS hardcodeadas - MALA PRACTICA
app.get("/", (req, res) => {

    return res.status(200).send(
        "<h1>Bienvenido API Rest con NodeJS</h1>" 
    );
});

app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el EndPoint Probando");

    return res.status(200).json([{
        curso: "Master en React",
        autor: "Wilmer Jimenez",
        url: "pholiodev.con/portafolio"
    },
    {
        curso: "Master en React Native",
        autor: "Wilmer Jimenez",
        url: "pholiodev.con/portafolio"
    },
]);
});

// CREAR SERVIDOR Y ESCUCHA DE PETICIONES HTTP
app.listen(portserver, () => {
    console.log("EL SERVIDOR ESTA CORRIENDO CON EXPRESS EN EL PUERTO: "+ portserver);
});