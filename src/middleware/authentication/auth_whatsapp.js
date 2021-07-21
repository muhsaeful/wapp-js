exports.auth = (req, res, next) => {

    var bearerToken = "AwIosa2ask8UJa";
    var authentication = req.headers.authentication;
    if (authentication !== bearerToken) {
        return res.send('auhentication failed');
    }
    return next();
}