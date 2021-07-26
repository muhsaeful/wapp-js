const JWT = require("jsonwebtoken");
const fs = require("fs");
const validator = require("validator");
const model = require("../../models/_index_models");
const { check, body, validationResult } = require("express-validator");

exports.signJWT = async (req, res) => {

    /** inputan
     * body = username,password
     * 
     * * validasi input
     * * validasi username,password
     * * generate JWT
     */

    let username = req.body.username;
    let password = req.body.password;

    try {
        // validasi input
        let checkUsername = await validator.isAlpha(username);
        let checkPassword = await validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 });

        // console.log(checkUsername);
        // console.log(checkPassword);

        if (checkUsername === false || checkPassword === false) {
            return res.status(200).json({
                status: false,
                response: 'username or password not valid'
            });
        }

        // validasi username,password (database)
        let user = await model.user.findOne({ where: { username: username } });
        if (user === null) {
            return res.status(200).json({
                status: false,
                response: 'username or password not valid'
            });
        }

        // 1. plain password
        if (password !== user.dataValues.password) {
            return res.status(200).json({
                status: false,
                response: 'username or password not valid'
            });
        }

        // 2. hash password

        // generate JWT
        let payload = {
            user_id: user.dataValues.user_id
        };

        let privatKey = await fs.readFileSync("./src/key/jwt.key", "utf8");

        let createJWT = JWT.sign(payload, privatKey, {
            expiresIn: 60 * 60,
            algorithm: "HS256"
        });

        res.status(200).json({
            status: true,
            response: createJWT,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            response: {},
        });
    }
}

