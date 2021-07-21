const { Client, MessageMedia } = require('whatsapp-web.js');
const qrTerminal = require("qrcode-terminal");
const qrCode = require("qrcode");
const { imgToBase64 } = require('../helpers/url_img_to_base64');
const { format628 } = require('../helpers/change_phone_format');
const axios = require('axios');
const { momentDate } = require('../helpers/moment');

const model = require("../models/_index_Model"); //model sequelize
const e = require('express');

const sessionToken = []

exports.refresh = async () => {
    try {
        await model.wa_token.findAll({ attributes: ['name'] }).then((response) => {
            if (response.length > 0) {
                var data = JSON.stringify(response);
                var data = JSON.parse(data);
                data.forEach(e => {
                    sendRefresh(e.name)
                });
            }
        });
    } catch (error) {
        console.error(error);
    }

    // function sendRefresh(name) {
    //     axios({
    //         method: 'POST',
    //         url: `${process.env.BASE_URL}:${process.env.PORT}/whatsapp/create`,
    //         data: {
    //             name: name
    //         }
    //     }).then(response => {
    //     }).catch((error) => {
    //         console.error(error.code);
    //     })
    // }
}

exports.build = async (req, res) => {

    var name = req.body.name;
    var description = req.body.description;

    // default path
    // var sessionPath = (__dirname, "./src/models/wa_token");

    await createSession(name, description);

    // BUILD WHATSAPP SESSION
    async function createSession(name, description) {

        let sessionData;

        // inisiasi sessian file
        // var sessionFile = `${sessionPath}/${id}.data.json`;

        // cek ada session sesuai id atau tidak (mengunakan fs.)
        // if (fs.existsSync(sessionFile)) {
        //     sessionData = JSON.parse(fs.readFileSync(`${sessionPath}/${id}.data.json`, "utf-8"));
        // }

        // cek ada session sesuai id atau tidak (mengunakan sequelize)
        var checkSession = await selectByName(name);
        if (checkSession.status === true) { // jika ada session yang tersimpan sesuai name
            sessionData = JSON.parse(checkSession.data[0].session);
        } else if (checkSession.status === 'error') {
            return res.send({ status: 'error' }) // kill process
        }

        // create client
        const client = new Client({
            session: sessionData,
            puppeteer: {
                headless: false,
                // args: [
                //     '--no-sandbox',
                //     '--disable-setuid-sandbox',
                //     '--disable-dev-shm-usage',
                //     '--disable-accelerated-2d-canvas',
                //     '--no-first-run',
                //     '--no-zygote',
                //     '--single-process', // <- this one doesn't works in Windows
                //     '--disable-gpu'
                // ],
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
            },
            authTimeoutMs: 10000,
            qrRefreshIntervalMs: 60000,
            qrTimeoutMs: 60000,
            restartOnAuthFail: false
            // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        });

        client.initialize();

        // Proses mendapatkan QR Code
        var qrNum = 0;
        client.on('qr', (qr) => {

            // Generate and scan this code with your phone
            var qrLast;
            qrLast = qrNum++;

            console.log(`QR ${name} RECEIVED`, qr);
            console.log(`${qrLast} - ${momentDate()}`);

            if (qrLast == 0) {
                qrCode.toDataURL(qr, (err, url) => {
                    res.send(url);
                });
            } else if (qrLast <= 4) {
                // Send Callback

                qrTerminal.generate(qr, { small: true });
            } else if (qrLast == 5) {
                client.destroy();
            }
        });

        // Cek session whatsapp
        client.on("authenticated", async (session) => {
            console.log({ "AUTHENTICATED": session });

            // buat file session dengan id
            // cek ada session sesuai id atau tidak
            // if (fs.existsSync(`${ sessionPath } / ${ id }.data.json`) === false) {
            //     fs.writeFileSync(`${ sessionPath } / ${ id }.data.json`, JSON.stringify(session));
            // }
            sessionData = session;

            // Simpan session dengan fs.
            // fs.writeFile(sessionFile, JSON.stringify(session), (err) => {
            //     if (err) return console.error(err);
            //     console.log(`Client ${sessionFile} Created`);
            // });

            // Simpan session dengan sequelize
            if (checkSession.status === false) {
                await insertSession(name, description, session);
            }
        });

        client.on("auth_failure", async (e) => {
            // Hapus session
            // await destroyByName(name);

            console.log(`Client ${name} Sesi pada mobile apps di hapus atau tidak terhubung ke internet`);

            client.destroy();
        });

        // Jika whatsapp web di hapus dari aplikasi
        client.on("disconnected", async (e) => {

            console.log(`Client ${name} is Disconnect!`);

            // Send Callback

            // fs.unlinkSync(`${sessionPath} / ${id}.data.json`, (err) => {
            //     if (err) return console.error(err);
            //     console.log(`Client ${sessionFile} Deleted`);
            // });

            // Hapus session
            await destroyByName(name);

            client.destroy();
        })

        // Jika whatsapp ready
        client.on('ready', () => {
            console.log(`Client ${name} is ready!`);

            // Send Callback
            if (checkSession.status === true) {
                res.send(`Client ${name} is ready!`);
            }
        });

        // Pesan masuk
        // client.on('message', (msg) => {
        //     console.log(msg);
        // });

        sessionToken.push({
            user: '',
            name: name,
            description: description,
            session: client
        });
    }
}

exports.sendtext = (req, res) => {
    var name = req.body.name;
    var phone = format628(req.body.phone) + "@c.us";
    var message = req.body.message;

    var newClient = sessionToken.find(st => st.name === name);
    if (newClient !== undefined) {
        var newSession = newClient.session;
        newSession.sendMessage(phone, message).then(response => {
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
        res.send('name client not found');
    }
};

exports.sendmedia = async (req, res) => {
    var name = req.body.name;
    var phone = format628(req.body.phone) + "@c.us";
    var url = req.body.url;
    var caption = req.body.caption;
    var media = await imgToBase64(url);

    if (media.code === 200) {
        var newClient = sessionToken.find(st => st.name === name);
        if (newClient !== undefined) {
            var message = new MessageMedia(media.mimetype, media.base64, "example");
            var newSession = newClient.session;

            newSession.sendMessage(phone, message, { caption: caption }).then(response => {
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
            res.send('name client not found');
        }
    } else {
        res.status(500).json({
            status: false,
            response: media.code
        });
    }
};


// ************************************** FUNCTION ************************************** //

async function selectByName(name) {
    var result;
    try {
        result = await model.wa_token.findAll({ where: { name: name } }).then((response) => {
            if (response.length > 0) {
                var data = JSON.stringify(response);
                var data = JSON.parse(data);
                return { status: true, data: data };
            } else {
                return { status: false, data: false }
            }
        });
    } catch (error) {
        result = { status: 'error' };
        console.error(error);
    }
    return result;
}

async function insertSession(name, description, session) {
    var result;
    try {
        result = await model.wa_token.create({
            name: name,
            description: description,
            session: session
        });
        return { id: result }
    } catch (error) {
        result = { status: 'error' };
        console.error(error);
    }
    return result;
}


async function destroyByName(name) {
    var result;
    try {
        result = await model.wa_token.destroy({ where: { name: name } }).then((response) => {
            if (response === 1) {
                return true
            } else {
                return false
            }
        });
        return { status: result }
    } catch (error) {
        result = { status: 'error' };
        console.error(error);
    }

    return result;
}