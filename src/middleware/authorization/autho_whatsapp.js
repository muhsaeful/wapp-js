// model
const model = require("../../models/_index_models");

exports.accessDevice = async (req, res, next) => {

    /**
     * * 1. validasi access device
     * */

    try {
        let device = req.body.device;
        let user_id = res.locals.stringJWT.user_id;

        if (device !== undefined) {
            /**
             * 1. refresh device yang sudah ada
             */

            let userDevice = await model.device.findOne({
                where:
                    { device_id: device, user_id: user_id },
            });

            if (userDevice === null) {
                return res.status(403).json({
                    status: false,
                    response: 'device access forbindden'
                });
            } else {
                res.locals.stringDevice = userDevice.dataValues;
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