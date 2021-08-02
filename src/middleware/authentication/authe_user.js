const model = require("../../models/_index_models");

exports.login = async (req, res, next) => {

    /** inputan
     * body = username,password
     * 
     * * validasi input
     * * validasi username,password
     */

    let username = req.body.username;
    let password = req.body.password;

    try {
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

        //next generate JWT
        res.locals.user_id = user.dataValues.user_id
        return next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            response: {},
        });
    }
}

