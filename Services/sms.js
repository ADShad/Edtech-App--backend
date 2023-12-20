"use strict";
var http = require("https");
const SendOtp = require("sendotp");
var randomstring = require("randomstring");
//require('dotenv').config({path:'../.env'});

const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: "numeric",
        capitalization: "uppercase",
    });
};

module.exports = {
    send2: async (mobile, msg, otp) => {
        console.log("inside send2 otp", otp);

        let MSG_AUTH_KEY = process.env.MSG_AUTH_KEY;

        // console.log("MSG_AUTH_KEY",MSG_AUTH_KEY)
        const sendOtp = new SendOtp(MSG_AUTH_KEY, msg);
        let sendotp = sendOtp.send(mobile, "INHANS", otp, function (error, data) {
            //console.log("data otp", data);
            if (error) {
                console.log("error:", error);
                return error;
            } else {
                console.log("data:", data);
            }
        });
    },
    send3: async (mobile, msg) => {
        try {
            const MSG_AUTH_KEY = process.env.MSG_AUTH_KEY;
            console.log(mobile);

            const mobiles = [mobile];

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authkey: MSG_AUTH_KEY,
                    mobiles,
                    message: msg,
                    sender: 'INHANS',
                    country: 91,
                    route: 4,
                }),
            };

            const response = await fetch('https://api.msg91.com/api/v2/sendsms', requestOptions);
            const data = await response.json();

            if (data.status === 'success') {
                console.log('SMS message sent successfully!');
            } else {
                console.error('Error sending SMS message:', data.message);
            }
        } catch (error) {
            console.error(error);
        }
    },
    send: async function (mobile, msg) {
        try {
            const MSG_AUTH_KEY = process.env.MSG_AUTH_KEY;
            console.log(mobile);
            const requestOptions = {
                method: 'POST',
                headers: {
                    authkey: MSG_AUTH_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    template_id: '6547df08d6fc05226d414292',
                    short_url: 1,
                    recipients: [{ mobiles: ['918160024928'], VAR1: msg }],
                }),
            };

            const response = await fetch('https://control.msg91.com/api/v5/flow/', requestOptions);
            const data = await response.json();
            console.log(data)
            console.log(response)

        } catch (error) {
            console.log(error)
        }
        // return result;
        /*
            
            console.log("sms value",sms);
            console.log("key is",sms.MSG_AUTH_KEY);
    
            var options = {
                "method": "POST",
                "hostname": "api.msg91.com",
                "port": null,
                "path": "/api/v2/sendsms",
                "headers": {
                    "authkey":sms.MSG_AUTH_KEY,
                    "content-type": "application/json"
                }
            };
    
            var req = http.request(options, function (res) {
                var chunks = [];
    
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
    
                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
    
            req.write(JSON.stringify({ sender: 'INHANS',
                route: '4',
                country: '91',
                sms:
                    [{ message: msg, to: [ mobile.toString() ] } ] }));
            req.end();
    
            */
    },
};
