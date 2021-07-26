const helpers = require("../../helpers/_index_helpers");
const { MessageMedia } = require("whatsapp-web.js");

exports.sendtext = async (req, res) => {

    var device = req.body.device;
    var phone = helpers.phoneFormat._628(req.body.phone) + "@c.us";
    var message = req.body.message;

    let client = await require("./whatsapp").sessionToken(device);

    if (client !== false) {
        client.sendMessage(phone, message).then(response => {
            res.status(200).json({
                status: true,
                response: response
            });
        }).catch(err => {
            res.status(500).json({
                status: false,
                response: err
            });
        });
    } else {
        res.status(200).json({
            status: false,
            response: 'device not found'
        });
    }
};

exports.sendmedia = async (req, res) => {
    var device = req.body.device;
    var phone = helpers.phoneFormat._628(req.body.phone) + "@c.us";
    var url = req.body.url;
    var caption = req.body.caption;
    var media = await helpers.imgToBase64.imgToBase64(url);

    let client = await require("./whatsapp").sessionToken(device);

    if (media.code === 200) {
        if (client !== false) {
            var message = new MessageMedia(media.mimetype, media.base64, "example");

            client.sendMessage(phone, message, { caption: caption }).then(response => {
                res.status(200).json({
                    status: true,
                    response: response
                });
            }).catch(err => {
                res.status(500).json({
                    status: false,
                    response: err
                });
            });
        } else {
            res.status(200).json({
                status: false,
                response: 'device not found'
            });
        }
    } else {
        res.status(500).json({
            status: false,
            response: media.code
        });
    }
};

// save message
