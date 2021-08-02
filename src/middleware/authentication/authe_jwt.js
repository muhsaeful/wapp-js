const JWT = require("jsonwebtoken");
const fs = require("fs");
const { validationResult, body, header } = require("express-validator");

let privatPath = "./src/key/jwt.key"

exports.sign = async (req, res) => {
    try {
        let payload = {
            user_id: res.locals.user_id
        };

        let privatKey = await fs.readFileSync(privatPath, "utf8");
        let signJWT = JWT.sign(payload, privatKey, {
            expiresIn: 60 * 60,
            algorithm: "HS256"
        });

        res.status(200).json({
            status: true,
            response: signJWT,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            response: {},
        });
    }
}

let verifyInput = verifyInput => {
    return async (req, res, next) => {
        try {
            await Promise.all(verifyInput.map(verify => verify.run(req)));
            let errors = validationResult(req).formatWith(({ msg }) => {
                return msg;
            });

            if (!errors.isEmpty()) {
                return res.status(401).json({
                    status: false,
                    response: errors.mapped(),
                });
            } else {

                let bearer = req.headers.authentication;
                bearer = bearer.replace('Bearer ', '');

                let privatKey = await fs.readFileSync(privatPath, "utf8");
                await JWT.verify(bearer, privatKey, (error) => {
                    if (error) {
                        return res.status(401).json({
                            status: false,
                            response: error.message,
                        });
                    } else {
                        let stringJWT = JWT.decode(bearer);
                        if (stringJWT) {
                            res.locals.stringJWT = stringJWT;
                            return next();
                        }
                    }
                });

                // errors

            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                response: {},
            });
        }
    }
}

exports.verify = verifyInput([
    header('authentication').notEmpty().isString()
]);
