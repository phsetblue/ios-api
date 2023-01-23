import CustomErrorHandler from "../service/CustomErrorHandler.js";
import JwtService from "../service/JWTService.js";

const auth = async(req,res,next) => {
    try{
        console.log(req.headers.authorization);
        let authHeader = req.headers.authorization;
        console.log(`authHeader = ${authHeader}`);
        // if(!authHeader) return next(CustomErrorHandler.unAuthorized());

        // const token = authHeader.split(' ')[1];
        // if(!token) return next(CustomErrorHandler.unAuthorized());
        console.log('sdsd');
        // const {userId} = await JwtService.verify(token);
        const {userId} = await JwtService.verify(authHeader, "refresh");
        console.log(userId);
        // req.user = {userId};
        next();
    }catch(err) {
        return next(CustomErrorHandler.unAuthorized());
    }
}
export default auth;