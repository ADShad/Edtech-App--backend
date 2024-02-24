const db = require('../../Config/connection');
const { Op } = require('sequelize');
const multer = require('multer');
const AWS = require('aws-sdk');
const usersModel = db.usersModel;
const bcrypt = require("bcrypt");
const paymentsModel = db.paymentsModel;
const historyModel = db.historyModel;
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.query;

        const currentDateTime = new Date();
        const dayBefore = new Date(currentDateTime);
        dayBefore.setHours(currentDateTime.getHours() - 24);

        const isDemo = await usersModel.findOne({
            where: { id, demoTimestamp: { [Op.gte]: dayBefore } },
        });

        const isDemoOver = await usersModel.findOne({
            where: { id, demoTimestamp: { [Op.lte]: dayBefore } },
        });

        let isPaid = 0;

        if (isDemo) {
            isPaid = 1;
        } else {
            const paymentDone = await paymentsModel.findOne({
                where: { user_id: id, status: 'captured' },
            });

            if (paymentDone) {
                isPaid = 2;
            } else if (isDemoOver) {
                isPaid = 3;
            }
        }

        const userProfile = await usersModel.findOne({
            where: { id: id, is_deleted: 0 },
            attributes: ['id', 'username', 'phone_number', 'email_address', 'full_name', 'bio', 'active_courseid', 'study_methodid', 'created_at'],
        });
        if (!userProfile) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            status: true,
            message: 'User Profile fetched successfully',
            userData: userProfile,
            isPaid,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { id } = req.query;
        const history = await historyModel.findAll({
            where: { user_id: id },
            attributes: ['id', 'user_id', 'content_type', 'content_id', 'content_name', 'progress', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: 5,
        });
        if (!history || history.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'History not found',
            });
        }
        res.status(200).json({
            status: true,
            message: 'Latest 5 history entries fetched successfully',
            history,
        });
    } catch (error) {
        console.log('Error fetching history:', error);
        res.status(500).json({ error: 'Error fetching history' });
    }
}


exports.uploadProfilePicture = async (req, res) => {
    try {
        const { user_id } = req.query;
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        // Multer setup for file handling
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage }).single('profile_picture');

        upload(req, res, async (err) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ message: 'Error uploading file' });
            }

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `profile_pictures/${user_id}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
            };

            s3.upload(params, async (err, data) => {
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).json({ message: 'Error uploading file' });
                }

                console.log('Data:', data);
                const updateProfilePicture = await usersModel.update(
                    { user_photo: data.Location },
                    { where: { id: user_id } }
                );
                return res.status(200).json({ message: 'Profile picture uploaded successfully', imageUrl: data.Location });

            });
        });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).json({ message: 'Error uploading file' });
    }
};

exports.getReferralCode = async (req, res) => {
    try {
        const { id } = req.query;
        const user = await usersModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            status: true,
            message: 'Referral code fetched successfully',
            referralCode: user.referral_code,
        });
    } catch (error) {
        console.error('Error fetching referral code:', error);
        res.status(500).json({ error: 'Error fetching referral code' });
    }
}

exports.getNameFromReferralCode = async (req, res) => {
    try {
        const { referral_code } = req.query;
        const user = await usersModel.findOne({ where: { referral_code }, attributes: ['id', 'username', 'full_name'] });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            status: true,
            message: 'User found',
            user: user,
        });
    } catch (error) {
        console.error('Error fetching user from referral code:', error);
        res.status(500).json({ error: 'Error fetching user from referral code' });
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        // Assuming you have a simple HTML form to take username and password
        const htmlForm = `
        <p>Enter your username and password to delete your profile</p>
        <p>Caution: This action is irreversible. If any payments have been made within the app, they will not be refunded upon deletion of the account.</p>
            <form action=${process.env.API_ENDPOINT} method="POST">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required><br> <!-- Added 'required' attribute for validation -->
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br> <!-- Added 'required' attribute for validation -->
            <input type="submit" value="Submit">
            </form>
        `;

        res.send(htmlForm);
    } catch (error) {
        console.log('Error showing delete profile form:', error);
        res.status(500).json({ error: 'Error showing delete profile form' });
    }
}

exports.processDeleteProfile = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Inside processDeleteProfile", username, password);

        // Check if the user is valid and also check if the password is correct
        // Assuming you have a method in your Profile model to delete by username and password
        const user = await usersModel.findOne({
            where: {
                [Op.and]: [
                    { username: username },
                    { is_deleted: 0 }, // Check if the user is not deleted (assuming 0 means not deleted)
                ],
            },
            attributes: ["id", "user_password"]
        });

        if (!user) {
            // Send HTML response for invalid username or password
            return res.status(401).send(`
                <h1>Error: Invalid username or password</h1>
                <p>Please check your credentials and try again.</p>
            `);
        }

        const passwordMatch = await bcrypt.compare(password, user.user_password);

        if (!passwordMatch) {
            // Send HTML response for invalid username or password
            return res.status(401).send(`
                <h1>Error: Invalid username or password</h1>
                <p>Please check your credentials and try again.</p>
            `);
        }

        const is_deleted = await usersModel.update({
            is_deleted: 1,
        }, {
            where: {
                username: username,
            }

        });

        if (is_deleted[0] === 0) {
            // Send HTML response for error deleting profile
            return res.status(404).send(`
                <h1>Error: Profile deletion failed</h1>
                <p>Sorry, we encountered an issue while deleting your profile. Please try again later.</p>
            `);
        }

        console.log('is_deleted:', is_deleted);

        // Send HTML response for successful profile deletion
        res.status(200).send(`
            <h1>Profile deleted successfully</h1>
            <p>Your profile has been successfully deleted from our system.</p>
        `);
    } catch (error) {
        console.log('Error deleting profile:', error);

        // Send HTML response for internal server error
        res.status(500).send(`
            <h1>Error: Internal Server Error</h1>
            <p>Sorry, we encountered an internal server error while processing your request. Please try again later.</p>
        `);
    }
}

