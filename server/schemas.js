
//reference https://softchris.github.io/pages/joi.html#building-a-middleware

const Joi = require('joi')
const schemas = {
    profilePOST: Joi.object({
        id: Joi.string().required().min(0),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        profilepicture: Joi.string().uri(),
        role: Joi.number().integer().required().min(0),
        school: Joi.string(),
        password: Joi.string(),
    }),
    postPOST: Joi.object({
        id: Joi.string().required().min(0),
        author: Joi.string().required(),
        date: Joi.date().iso(),//'2023-06-09'
        time: Joi.date().format('HH:mm'),//'12:30'
        description: Joi.string().required().min(0).max(500),
        location: Joi.string(),
        likes: Joi.number(),
        imageurl: Joi.string().uri(),
    }),
    eventPOST: Joi.object({
        id: Joi.string().required(),
        date: Joi.date().iso(),//'2023-06-09'
        time: Joi.date().format('HH:mm'),//'12:30'
        description: Joi.string().required().min(0).max(500),
        location: Joi.string().required(),
    }),

};

//const data = {username: 'John Doe'};
//const result = schemas.profilePOST.validate(data);
//console.log(result);

module.exports = {
    schemas
};