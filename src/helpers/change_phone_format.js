// * OUTPUT 628*********

// var phone = "087794076667";
// console.log(format628(phone));

exports.format628 = (phone) => {

    if (phone.slice(0, 3) === "+62") {
        return phone.replace('+62', '62');
    } else if (phone.slice(0, 2) === "08") {
        return phone.replace('08', '628');
    } else if (phone.slice(0, 2) === "62") {
        return phone;
    }
}