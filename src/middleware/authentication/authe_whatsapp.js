const validator = require("validator");
const { body, validationResult, check, header } = require("express-validator");

let createInput = createInput => {

    /**
     * 1. validasi input
     */

    return async (req, res, next) => {

        // validasi input
        await Promise.all(createInput.map(create => create.run(req)));
        const errors = validationResult(req).formatWith(({ msg }) => {
            return msg;
        });

        if (!errors.isEmpty()) {
            return res.status(401).json({
                status: false,
                response: errors.mapped()
            })
        } else {
            return next();
        }
    }
};

exports.createInput = createInput([
    header('authentication').notEmpty().isString(),
    body('device').optional().isUUID(),
    body('description').optional().isString()
]);