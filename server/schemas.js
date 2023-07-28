
//reference https://softchris.github.io/pages/joi.html#building-a-middleware

const Joi = require('joi')

const schemas = {
    //validate for sign up form data
    signupPost: Joi.object({
        username: Joi.string().max(20).required(),
        email: Joi.string().max(50).required(),
        firstname: Joi.string().max(20).required(),
        lastname: Joi.string().max(20).required(),
        school: Joi.string().max(50).required(),
        password: Joi.string().max(20).required(),
        profilepicture: Joi.string().uri().max(200).optional().allow(null).allow(''),
        // role: Joi.string().max(20).optional().allow(''),
    }),
    loginPost: Joi.object({
        email: Joi.string().max(50).required(),
        password: Joi.string().max(50).required(),
    }),

    //for users information edit/update
    profilePOST: Joi.object({
        username: Joi.string().max(20).required(),
        email: Joi.string().max(50).required(),
        firstname: Joi.string().max(20).required(),
        lastname: Joi.string().max(20).required(),
        school: Joi.string().max(20).required(),
        profilepicture: Joi.string().uri().max(200).optional().allow(null).allow(''),
    }),
    //for post information validation
    postPOST: Joi.object({
        description: Joi.string().required().min(4).max(1000),
        location: Joi.string().max(200).required(),
        photo: Joi.string().max(200).optional().allow(null).allow(''),
    }),
    //for event information validation
    eventPOST: Joi.object({
        name: Joi.string().max(100).required(),
        date: Joi.date().required(),//date().max(100).format(['MM/DD/YYYY']).required(),//'2023-06-09'
        start_time: {
            hour: Joi.number().max(24).required(),
            minute: Joi.number().max(60).required(),
        },// = '12:30'
        end_time: {
            hour: Joi.number().max(24).required(),
            minute: Joi.number().max(60).required(),
        },
        description: Joi.string().max(1000).required(),
        location: {
            street: Joi.string().max(500).required(),
            city: Joi.string().max(100).required(),
            state: Joi.string().max(100).required(),
        },
        photo: Joi.optional()

    }),
}



//example
//const data = { username: 'John Doe' };
//const result = schemas.profilePOST.validate(data); //validated specific schema by shcemas.profilePost or schemas.eventPost ...
//console.log(result);

module.exports = schemas;