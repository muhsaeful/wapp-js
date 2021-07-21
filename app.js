const express = require("express");
const { refresh } = require("./src/controllers/whatsapp");

// Routing
const whatsapp = require("./src/middleware/routes/router_whatsapp");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.use('/whatsapp', whatsapp);

app.listen(port, async function () {
    console.log(`app running on port ${port}`);
    await refresh();
});