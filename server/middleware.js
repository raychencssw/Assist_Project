const Joi = require('joi');

const middleware = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body);


        if (error) {
            console.log("NOT VALID DATA FORMAT")
            const errorMessage = error.details.map((detail) => detail.message).join(', ');

            return res.status(422).json({
                message: 'Invalid request',
                data: error
            });
        }

        next();

    };
};

module.exports = middleware;
