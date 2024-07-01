const { StatusCodes } = require('http-status-codes')
const {CustomAPIError} = require('../Errors')
const errorHandlerMiddleware = (err,req,res,next)=>{
   if(err instanceof CustomAPIError){
    return res.status(err.statusCode).json({msg:err.message})
   }
   
   if(err.errors && err.errors.email){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.errors.email.message,field:'Email'})
   }
   if(err.errors && err.errors.password){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.errors.password.message,field:'password'})
   }
   if(err.errors && err.errors.name){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.errors.name.message,field:'name'})
   }
   if(err.errors && err.errors.price){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.errors.price.message,field:'price'})
   }
   if(err.errors && err.errors.category){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.errors.category.message,field:'category'})
   }

   // duplication of email
    if(err.errorResponse!=null && err.errorResponse.code!=null  && err.errorResponse.code == 11000){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'Email already in use',field:'email'})
    }
  
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
   
}
module.exports = errorHandlerMiddleware