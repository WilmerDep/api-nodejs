const mongoose = require("mongoose");

const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        console.log("Conexion Exitosa DB mi_blog");
        //PARAMETROS DE OBJETOS EN CASO DE ERROR A LA DB
        //useNewUrlParser:true
        //useUnifiedTipology:true
        //useCreateIndex:true

    }catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar ala base de datos");
    }
}

module.exports ={
    connection
}