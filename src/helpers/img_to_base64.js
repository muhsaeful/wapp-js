const axios = require("axios");

exports.imgToBase64 = async (url) => {
    var config = {
        method: "GET",
        url: url,
        responseType: "arraybuffer",
    }

    axios.defaults.timeout = 10000;

    var result = await axios(config).then(response => {
        return {
            code: response.status,
            mimetype: response.headers['content-type'],
            base64: new Buffer.from(response.data, "binary").toString("base64")
        };
    }).catch(err => {
        return {
            code: err.response.status
        };
    });

    return result;
}

