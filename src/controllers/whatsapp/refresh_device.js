// exports.refresh = async () => {
//     try {
//         await model.wa_token.findAll({ attributes: ['name'] }).then((response) => {
//             if (response.length > 0) {
//                 var data = JSON.stringify(response);
//                 var data = JSON.parse(data);
//                 data.forEach(e => {
//                     sendRefresh(e.name);
//                 });
//             }
//         });
//     } catch (error) {
//         console.error(error);
//     }

//     function sendRefresh(name) {
//         axios({
//             method: 'POST',
//             url: `${process.env.BASE_URL}:${process.env.PORT}/whatsapp/create`,
//             data: {
//                 name: name
//             }
//         }).then(response => {
//         }).catch((error) => {
//             console.error(error.code);
//         })
//     }
// }