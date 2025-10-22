const axios = require('axios');

async function sendOtpSms(to, otp) {
    const token = process.env.D7SMS_AUTH_TOKEN; // Add this to your .env
    const originator = process.env.D7SMS_ORIGINATOR || 'SignOTP'; // Optional, default value

    const data = {
        messages: [
            {
                channel: "sms",
                recipients: [ `+91${to}` ],
                content: `Your OTP for Remaind Hub is ${otp}. It is valid for 5 minutes.`,
                msg_type: "text",
                data_coding: "text"
            }
        ],
        message_globals: {
            originator,
            // report_url: "https://the_url_to_recieve_delivery_report.com" // Optional
        }
    };

    try {
        const response = await axios.post(
            'https://api.d7networks.com/messages/v1/send',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log('D7SMS response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS via D7SMS:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { sendOtpSms };