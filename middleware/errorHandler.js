import { DEBUG_MODE } from "../config/index.js";
import pkg from 'joi';
const { ValidationError } = pkg;
// import { ValidationError } from "joi";
import CustomErrorHandler from "../service/CustomErrorHandler.js";

const errorHandler = (err,req,res,next)=>{
    let statuscode = 500;
    let data = {
        error:'internal server error',
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    }
    if(err instanceof ValidationError) {
        statuscode = 422,
        data = {
            error: err.message
        }
    }
    if(err instanceof CustomErrorHandler){
        statuscode = err.status;
        data = {
            error: err.message
        }
    }
    res.status(statuscode).json(data);
}
export default errorHandler;