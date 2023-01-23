import Joi from 'joi';

const registerValidator = {

    name: Joi.string().trim().required().min(3).max(100).label("Name"),
    userName: Joi.string().trim().required().label("UserName"),
    email: Joi.string().trim().required().email().label("Email"),
    password: Joi.string().trim().required().pattern(new RegExp('^[a-zA-Z0-9]{3,40}$')).label("Password"),
    phoneNumber: Joi.number().integer().required().label("Phone number"),
    what_share: Joi.string().trim().required().label("what_share"),
    share_value: Joi.string().trim().required().label("share_value"),
}

const registerValidatorSchema = Joi.object(registerValidator);

export {
    registerValidatorSchema
}