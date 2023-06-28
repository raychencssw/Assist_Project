
//reference https://softchris.github.io/pages/joi.html#building-a-middleware

const Joi = require('joi')

const schemas = {
    //for sign up data
    signupPost: Joi.object({
        id: Joi.string().required().min(0),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        school: Joi.string(),
        profilepicture: Joi.string().uri(),
        role: Joi.number().integer().required().min(0),
        password: Joi.string(),
    }),

    //for users information edit/update
    profilePOST: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        school: Joi.string(),
    }),
    //for post information validation
    postPOST: Joi.object({
        id: Joi.string().required().min(0),
        author: Joi.string().required(),
        date: Joi.date().iso(),//'2023-06-09'
        time: Joi.date(),//.format('HH:mm') will be '12:30'
        description: Joi.string().required().min(0).max(500),
        location: Joi.string(),
        likes: Joi.number(),
        imageurl: Joi.string().uri(),
    }),
    //for event information validation
    eventPOST: Joi.object({
        id: Joi.string().required(),
        date: Joi.date().iso(),//'2023-06-09'
        time: Joi.date(),// .format('HH:mm') = '12:30'
        description: Joi.string().required().min(0).max(500),
        location: Joi.string().required(),
    }),
}



//example
//const data = { username: 'John Doe' };
//const result = schemas.profilePOST.validate(data); //validated specific schema by shcemas.profilePost or schemas.eventPost ...
//console.log(result);

module.exports = schemas;