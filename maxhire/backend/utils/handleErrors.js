const {NextFunction, Request, Response} = require('express');
class ValidationError extends Error {}

const handleError= (err,req,res,next) => {
    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json({message:err instanceof ValidationError ? err.message : "Przepraszamy spróbuj ponownie póżniej"})

}






module.exports = {
    ValidationError,
    handleError
}