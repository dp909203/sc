
import getMessage from './leng/massge.js'
const RESPONSE = {};

RESPONSE.success = function (
    res,
    messageCode = null,
    data = null,
    statusCode = 200
) {
    let response = {};
    response.success = true;
    response.message = getMessage(messageCode);
    if (data !== null) {
        response.data = data;
    }
    return res.status(statusCode).send(response);
};


RESPONSE.error = function (res, messageCode, statusCode = 422, error = null) {
    let response = {};
    response.success = false;
    response.message = getMessage(messageCode);
    statusCode = messageCode > 599 ? 500 : statusCode;
    if (error !== null) {
        console.log("error :--> ", error);

    }
    return res.status(statusCode).send(response);
};





export default RESPONSE;
















