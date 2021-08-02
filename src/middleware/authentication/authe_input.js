const { validationResult, check } = require("express-validator");


let validation = validationInput => {

    /**
    * 1. validasi input
    */

    return async (req, res, next) => {
        try {
            // validasi input
            await Promise.all(validationInput.map(input => input.run(req)));
            const errors = validationResult(req).formatWith(({ msg }) => {
                return msg;
            });

            if (!errors.isEmpty()) {
                res.status(401).json({
                    status: false,
                    response: errors.mapped()
                });
            } else {
                return next()
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                response: {}
            });
        };
    };
};


exports.loginInput = validation([
    check('username').notEmpty().isAlpha(),
    check('password').notEmpty().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
]);

exports.createInput = validation([
    check('device').optional().isUUID(),
    check('description').optional().isString({
        minLength: 10,
        length: 128
    })
]);

exports.sendtextInput = validation([
    check('device').notEmpty().isUUID(),
    check('phone').notEmpty().isMobilePhone('id-ID'),
    check('message').notEmpty().isString({
        minLength: 1,
        length: 4000,
    }),
]);

exports.sendmediaInput = validation([
    check('device').notEmpty().isUUID(),
    check('phone').notEmpty().isMobilePhone('id-ID'),
    check('caption').notEmpty().isString({
        minLength: 1,
        length: 128,
    }),
    check('url').notEmpty().isURL(),
]);