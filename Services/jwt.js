
const jwt = require("jsonwebtoken");
const JWT_KEY = "Oasis-auth-key";
const JWT_SECRET = "0fed77fce7520577082a15e9c6e663368f471b5d0fb04f933f017f48f7c8bbea";
const JWT_KEY_NOT_FOUND = "Authentication error";
const JWT_KEY_LENGTH = "Bad Token";
const JWT_VERIFICATION_FAILED = "Authentication error";
const JWT_KEY_LABEL = "Oasis-auth-key";

var timestamp = require('console-timestamp')


exports.jwtAuthentication = async (req, res, next) => {
    console.log("inside authtication");
    let jwt_header = req.header(JWT_KEY_LABEL);
    if (!jwt_header) {
        console.log(req.url, JWT_KEY_NOT_FOUND);
        res.status(401).send(JWT_KEY_NOT_FOUND);
    } else if (jwt_header.length < 10) {
        res.status(401).send(JWT_KEY_LENGTH);
    } else {
        /*verifying the token received in the header of the api request */
        jwt.verify(
            jwt_header,
            JWT_SECRET,
            { algorithms: ["HS512"] },
            function (err, payload) {
                req.user = {};
                if (err) {
                    console.log("error in JWT ", err);
                    res.status(401).json(JWT_VERIFICATION_FAILED);
                } else {
                    req.user = payload.user;
                    next();
                }
            }
        );
    }
};

exports.generatetoken = async function (user) {
    try {
        var payload = {
            "iss": "hans",
            "iat": parseInt(timestamp('YYYYDDMMhhmmiii')),
            "user": { mobile: user.mobile },
            "super": "hansnow"
        }
        let response = jwt.sign(payload, JWT_SECRET, {
            algorithm: 'HS512'
        })
        return Promise.resolve(response)
    } catch (e) {
        console.error("error in creating jwt ", payload)
        Promise.reject(e)
    }

},
    /*
    * Verify JWT token
    * @param {string} jwt
    */
    exports.verifytoken = async (token) => {
        try {
            let jwt_verification = await jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] })
        } catch (err) {
            return Promise.reject("Unable to verify JWT ")
        }
    }


