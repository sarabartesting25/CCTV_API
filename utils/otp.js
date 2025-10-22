const generateOtp = async () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; 
const OTP_RESEND_INTERVAL = 30 * 1000;

module.exports = {
    generateOtp,
    OTP_EXPIRATION_TIME,
    OTP_RESEND_INTERVAL
};