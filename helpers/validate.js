const validator = require("validator");
const validateArticle = (parameters) =>{
    // VALIDAR DATOS
    let title_validate = !validator.isEmpty(parameters.title) && 
                        validator.isLength(parameters.title, {min:5, max: undefined});
    let content_validate = !validator.isEmpty(parameters.content);

    if(!title_validate || !content_validate){

        throw new Error("No se ha Validado La informacion");
    }
}

module.exports = {
    validateArticle
}