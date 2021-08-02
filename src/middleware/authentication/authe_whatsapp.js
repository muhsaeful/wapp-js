// model
const model = require("../../models/_index_models");

exports.createLimit = async (req, res, next) => {
    /**
     * 1. validasi limit device
     */

    try {
        let device = req.body.device;
        let user_id = res.locals.stringJWT.user_id;
        let countDevice = await model.device.count({ where: { user_id: user_id } });

        /**
         * 1. membuat device baru
         * 2. cek limit device untuk user_id
         */
        if (device == undefined) {
            if (countDevice >= 1) {
                return res.status(403).json({
                    status: false,
                    response: 'user limit create device'
                });
            } else {
                return next();
            }
        } else {
            return next();
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            response: {}
        });
    }
}