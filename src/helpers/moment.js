const moment = require("moment");

exports.momentDate = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}