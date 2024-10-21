async function formateData(data) {
    return {
        "websiteName": data.websiteName,
        "websiteURL": data.websiteURL,
        "clinicName": data.clinicName,
        "locationLink": data.locationLink,
        "fullAddress": data.fullAddress
    };
}
module.exports = { formateData };
