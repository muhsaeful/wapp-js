const fs = require("fs");

fs.writeFile('.env', `
PORT     = 5100
BASE_URL = http://localhost

DB_NAME  = wa_app
DB_USER  = root
DB_PWD   = root
DB_SRV   = localhost
`, (err) => {
    if (err) console.log('create env failed');
    console.log('create env success');
});