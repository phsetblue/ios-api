import Joi from "joi";

const loginValidator = {
    email: Joi.string().trim().required().email().label("Email"),
    password: Joi.string().trim().required().label("Password"),
}
const loginValidatorSchema = Joi.object(loginValidator);

export default loginValidatorSchema;