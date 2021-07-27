const { Client, MessageMedia, ClientInfo } = require('whatsapp-web.js');
const { v4: uuidv4 } = require("uuid");
const qrTerminal = require("qrcode-terminal");
const qrCode = require("qrcode");
const axios = require('axios');
const fs = require("fs");
const { message } = require('./accept_message');

// helpers
const helpers = require("../../helpers/_index_helpers");

// models
const model = require("../../models/_index_models");

let sessionToken = [];

exports.sessionToken = (device) => {
    const session = sessionToken.find(devices => devices.device_id === device);
    if (session !== undefined) {
        return session.session;
    } else {
        return false;
    }
}

exports.build = async (req, res) => {

    let description = req.body.description;
    let stringJWT = res.locals.stringJWT;


    //  1. device_id akan di generate dengan uuid v4
    //  2. user_id akan di dapat dari jwt nantinya (sekarang masih di buat static)

    let user_id = stringJWT.user_id;
    let device_id = req.body.device;

    let sessionData; //inisiasi sessionData

    try {
        if (device_id === undefined) {
            await createSession(uuidv4(), user_id, description, sessionData); // buat device baru
        } else if (device_id !== undefined) {
            sessionData = JSON.parse(res.locals.stringDevice.session);

            // cek apkah client aktif atau ada di varibel sessionToken
            let sessionArray = sessionToken.find(arr => arr.device_id === device_id);
            if (sessionArray === undefined) {

                await createSession(device_id, user_id, description, sessionData); // refresh device sesuai session
            } else {
                let sesssionIndex = sessionToken.indexOf(sessionArray);
                // let client = sessionArray.session;
                // client.destroy()
                return res.status(200).json({
                    status: false,
                    response: `client ${device_id} is ready!`,
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            response: {}
        })
    };

    // function createSession
    async function createSession(device, user, description, session) {
        let sessionData;
        let sessionInput = session;
        if (sessionInput !== undefined) {
            sessionData = sessionInput;
        }

        try {

            // create client
            const client = await new Client({
                session: sessionData,
                puppeteer: {
                    headless: false,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process', // <- this one doesn't works in Windows
                        '--disable-gpu'
                    ],
                },
                authTimeoutMs: 10000,
                // qrRefreshIntervalMs: 60000,
                // qrTimeoutMs: 60000,
                restartOnAuthFail: true,
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            });

            client.initialize();

            // Proses mendapatkan QR Code
            var qrNum = 0;
            await client.on('qr', (qr) => {

                // Generate and scan this code with your phone
                var qrLast;
                qrLast = qrNum++;

                console.log(`QR ${device} RECEIVED`, qr);
                console.log(`${qrLast} - ${helpers.moment.date()}`);

                function qrcodeSave(qr) {
                    qrCode.toDataURL(qr, (err, url) => {
                        let base64 = url.replace('data:image/png;base64,', '');
                        let binary = new Buffer.from(base64, 'base64').toString('binary');

                        // simpan qrcode
                        fs.writeFileSync(`./src/public/img/${device}.png`, binary, 'binary');
                    });
                }

                if (qrLast == 0) {

                    qrcodeSave(qr);

                    res.status(200).json({
                        status: true,
                        response: {
                            device: device,
                            qrcode: `${process.env.BASE_URL}/whatsapp/qrcode/${device}`
                        }
                    });
                } else if (qrLast <= 4) {
                    // ganti qrcode sebelumnya
                    qrcodeSave(qr);
                    // qrTerminal.generate(qr, { small: true });

                } else if (qrLast == 5) {

                    // hapus qrcode
                    fs.unlinkSync(`./src/public/img/${device}.png`)

                    client.destroy();
                }
            });

            // Cek session whatsapp
            await client.on("authenticated", async (session) => {
                console.log({ "AUTHENTICATED": session });

                sessionData = session;

                if (sessionInput !== undefined) {
                    // await model.device.update({ updatedAt }, { where: { device_id: device } });

                } else {
                    // hapus qrcode
                    fs.unlinkSync(`./src/public/img/${device}.png`)

                    await model.device.create({
                        device_id: device,
                        user_id: user,
                        device_phone: '',
                        description: '',
                        session: session
                    });
                }
            });

            await client.on("auth_failure", async (e) => {
                // Hapus session
                // await destroyByName(name);

                await console.log(`Client ${device} Sesi pada mobile apps di hapus atau tidak terhubung ke internet`);
                await client.destroy();
            });

            // Jika whatsapp web di hapus dari aplikasi
            await client.on("disconnected", async (e) => {

                await console.log(`Client ${device} is Disconnect!`);

                // send callback

                // delete session
                await model.device.destroy({ where: { device_id: device } });
                await client.destroy();
            })

            // Jika whatsapp ready
            await client.on('ready', () => {
                console.log(`Client ${device} is ready!`);
                // let clientInfo = Object.values(client)[6];
                // console.log(Object.values(clientInfo)[2].user);

                // send callback
                if (sessionInput !== undefined) {
                    res.status(200).json({
                        status: true,
                        response: `client ${device} is ready!`
                    });
                };
            });

            // Pesan masuk
            await client.on('message', msg => {
                message(msg)
            });

            sessionToken.push({
                user_id: user,
                device_id: device,
                device_phone: '',
                description: description,
                session: client
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                response: {}
            })
        }
    };
};