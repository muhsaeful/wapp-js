const fs = require("fs");
const path = require("path")

exports.qrcode = (req, res) => {

    const fileName = req.params.name;

    const dir = path.join(__dirname + '/../../public/img');
    res.sendFile(dir + `/${fileName}.png`, error => {
        if (error) {
            res.status(200).json({
                status: false,
                response: 'qrcode node found'
            });
        }
    });
}