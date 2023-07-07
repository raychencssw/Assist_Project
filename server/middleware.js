const Joi = require('joi');

const middleware = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body);


        if (error) {

            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            console.log('error message', errorMessage)
            return res.status(422).json({
                message: 'Invalid request from Joi middleware',
                data: error
            });
        }

        next();

    };
};

module.exports = middleware;
