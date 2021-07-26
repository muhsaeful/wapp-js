const moment = require("moment");

exports.date = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}