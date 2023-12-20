const db = require("../../Config/connection");
const usersModel = db.usersModel;
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("../../Services/jwt");
const randomstring = require("randomstring");
const { sequelize, Op } = require("sequelize")
const request = require('request');

const MSG_AUTH_KEY = process.env.MSG_AUTH_KEY;

exports.sendOtp = async (req, res) => {
    try {
        // Input validation
        const { mobile } = req.body;
        if (!mobile) {
            return res.status(400).json({
                status: false,
                error: "Missing required parameters",
            });
        }

        // Save username and phone number in the users table
        // await usersModel.create({
        //     full_name: name,
        //     phone_number: mobile,
        // });

        const msgString = encodeURIComponent(
            "<#> ##OTP## is your Hans Matrimony Login OTP. C/YgRNjOFYM"
        );
        var options = {
            method: "GET",
            url: `https://api.msg91.com/api/sendotp.php?authkey=${MSG_AUTH_KEY}&mobiles=${mobile}&message=${msgString}&sender=INHANS&otp=&DLT_TE_ID=1207162341543384380`,
        };

        // Use axios for asynchronous requests
        const response = await axios(options);

        const processedData = response.data;
        return res.status(200).json({
            status: true,
            data: processedData.message,
        });
    } catch (error) {
        console.error("Error in sendOtp:", error);
        res.status(500).json({
            status: false,
            error: "Internal Server Error",
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, mobile, email, userName, password, otp, isTest } = req.body;

        // Simple validation checks
        if (!name || !mobile || !email || !userName || !password || !otp) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const existingUser = await usersModel.findOne({
            where: {
                [Op.or]: [
                    { username: userName },
                    { phone_number: mobile },
                ],
                is_deleted: 0,
            },
        });

        if (existingUser) {
            let errorMessage;
            if (existingUser.dataValues.username === userName) {
                errorMessage = "Username already exists";
            } else {
                errorMessage = "Phone number already registered";
            }

            return res.status(400).json({
                status: false,
                message: errorMessage,
            });
        }

        // Your existing request options
        var options = {
            method: "GET",
            url: `https://control.msg91.com/api/verifyRequestOTP.php?authkey=${MSG_AUTH_KEY}&mobile=${mobile}&otp=${otp}`,
        };

        let success = false;

        if (isTest !== 1) {
            const response = await new Promise((resolve, reject) => {
                request(options, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            });

            const processedData = JSON.parse(response.body);

            if (processedData.type === "error") {
                return res.status(400).json({
                    status: false,
                    message: "Invalid OTP",
                });
            } else {
                success = true;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await usersModel.create({
            full_name: name,
            phone_number: mobile,
            email_address: email,
            username: userName,
            user_password: hashedPassword,
        });

        let token = await jwt.generatetoken(user.id);

        if (isTest == 1 || success) {
            return res.status(201).json({
                status: true,
                message: "User registered successfully",
                token: token,
                id: user.id
            });
        }
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
        });
    }
};
exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        // console.log(req.body);
        // Simple validation checks
        if (!userName || !password) {
            return res.status(400).json({
                status: false,
                message: "Username and password are required",
            });
        }

        // Check if the user exists
        const user = await usersModel.findOne({
            where: {
                [Op.and]: [
                    { username: userName },
                    { is_deleted: 0 }, // Check if the user is not deleted (assuming 0 means not deleted)
                ],
            },
            attributes: ["id", "user_password"]
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid username or password",
            });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.user_password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid username or password",
            });
        }

        // Generate and return a JWT token for authentication
        const token = await jwt.generatetoken(user.id);
        // console.log(token);
        return res.status(200).json({
            status: true,
            message: "Login successful",
            token: token,
            id: user.id
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
        });
    }
};

exports.testapi = async (req, res) => {
    try {
        res.json({
            status: "testing",
        })
    } catch (err) {
        // console.log();
        res.send("Syssssstem hang")
        console.log(err);
    }

}

exports.resetPassword = async (req, res) => {
    try {
        const { mobile, newPassword, otp, isTest } = req.body;

        // Validate input
        if (!mobile || !newPassword || !otp) {
            return res.status(400).json({
                status: false,
                message: "MobileNo, newPassword, and OTP are required",
            });
        }

        // Check if the user exists
        const user = await usersModel.findOne({
            where: {
                [Op.and]: [
                    { phone_number: mobile },
                    { is_deleted: 0 },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }


        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await usersModel.update(
            { password: hashedPassword },
            {
                where: {
                    phone_number: mobile,
                },
            }
        );
        if (isTest == 1) {
            console.log("here");
            return res.status(200).json({
                status: true,
                message: "Password reset successful",
                // data: processedData.message,
            });
        } else {
            var options = {
                method: "GET",
                url: `https://control.msg91.com/api/verifyRequestOTP.php?authkey=${MSG_AUTH_KEY}&mobile=${mobile}&otp=${otp}`,
            };
            request(options, function (error, response) {
                if (error) {
                    return res.status(200).json({
                        status: false,
                        data: error,
                    });
                } else {
                    let processedData = JSON.parse(response.body);
                    // console.log(response.body);

                    if (processedData.type == "error") {
                        return res.status(400).json({
                            status: false,
                            message: "Invalid OTP",
                        });
                    } else {
                        return res.status(200).json({
                            status: true,
                            message: "Password reset successful",
                            // data: processedData.message,
                        });
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error in reset password:", error);
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
        });
    }
};

exports.updatePersonalDetails = async (req, res) => {
    try {
        const { id, userName, fullName, phoneNumber, emailAddress, bio, gender, fatherName, motherName, schoolNameX, collegeName, alternatePhoneNumber, userAddress, district, city } = req.body;
        // Check if the user exists
        const user = await usersModel.findOne({
            where: {
                [Op.and]: [
                    { id: id },
                    { is_deleted: 0 },
                ],
            },
        });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }
        //update the user's details in the database
        const updatedUser = await usersModel.update({
            username: userName,
            full_name: fullName,
            phone_number: phoneNumber,
            email_address: emailAddress,
            bio: bio,
            gender: gender,
            father_name: fatherName,
            mother_name: motherName,
            tenth_school_name: schoolNameX,
            college_name: collegeName,
            alternate_phone_number: alternatePhoneNumber,
            user_address: userAddress,
            district: district,
            city: city
        }, {
            where: {
                id: id
            }
        })

        if (updatedUser) {
            return res.status(200).json({
                status: true,
                message: "User details updated successfully",
            });
        }
        else {
            return res.status(401).json({
                status: false,
                message: "User details not updated",
            });
        }
    } catch (error) {
        console.error("Error in onboarding info:", error);
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
        });
    }
}