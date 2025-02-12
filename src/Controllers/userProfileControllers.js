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
            attributes: ['id', 'username', 'phone_number', 'email_address', 'full_name', 'bio', 'active_courseid', 'study_methodid', 'created_at', 'streak_count', 'user_photo'],
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
        // console.log(req.body);
        // console.log(req);
        // console.log('User ID:', user_id);
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

exports.updateStreakCount = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await usersModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }
        const streakCount = user.streak_count + 1;
        const updatedStreakCount = await usersModel.update(
            { streak_count: streakCount },
            { where: { id: userId } }
        );
        res.status(200).json({
            status: true,
            message: 'Streak count updated successfully',
            streakCount,
        });
    } catch (error) {
        console.error('Error updating streak count:', error);
        res.status(500).json({ error: 'Error updating streak count' });
    }
}

exports.getProfileCompletion = async (req, res) => {
    try {
        // Personal Information (5% each): Full Name, Address, City, District, Gender, Date of Birth, Father's Name, Mother's Name, School Name, Username.
        // Contact Information (10% each): Email, Phone Number, Alternate Contact.
        // Additional Information (10% each): Profile Picture, Bio.    
        const { userId } = req.query;
        const user = await usersModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }
        const personalInfoFields = ['full_name', 'address', 'city', 'district', 'gender', 'date_of_birth', 'father_name', 'mother_name', 'school_name', 'username'];
        const contactInfoFields = ['email_address', 'phone_number', 'alternate_contact'];
        const additionalInfoFields = ['profile_picture', 'bio'];

        let totalPercentage = 0;

        // Calculate percentage for personal information fields
        const personalInfoPercentage = personalInfoFields.reduce((percentage, field) => {
            if (user[field]) {
                return percentage + 5;
            }
            return percentage;
        }, 0);

        totalPercentage += personalInfoPercentage;

        // Calculate percentage for contact information fields
        const contactInfoPercentage = contactInfoFields.reduce((percentage, field) => {
            if (user[field]) {
                return percentage + 10;
            }
            return percentage;
        }, 0);

        totalPercentage += contactInfoPercentage;

        // Calculate percentage for additional information fields
        const additionalInfoPercentage = additionalInfoFields.reduce((percentage, field) => {
            if (user[field]) {
                return percentage + 10;
            }
            return percentage;
        }, 0);

        totalPercentage += additionalInfoPercentage;

        res.status(200).json({
            status: true,
            message: 'Profile completion fetched successfully',
            completionPercentage: totalPercentage,
        });
    } catch (error) {
        console.error('Error fetching profile completion:', error);
        res.status(500).json({ error: 'Error fetching profile completion' });
    }
}

exports.getUserDetailsByFlag = async (req, res) => {
    try {
        const { userId, flag } = req.query;
        const user = await usersModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }

        let userDetails = {};

        switch (flag) {
            case 'personal':
                userDetails = {
                    full_name: user.full_name,
                    address: user.user_address,
                    city: user.city,
                    district: user.district,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    email: user.email_address,
                    phone_number: user.phone_number,
                    user_photo: user.user_photo,
                }
                break;
            case 'family':
                userDetails = {
                    father_name: user.father_name,
                    mother_name: user.mother_name,
                    schoolName: user.tenth_school_name,
                    collegeName: user.college_name,
                    alternateNumber: user.alternate_phone_number,
                    user_photo: user.user_photo,
                }
                break;
            case 'bio':
                userDetails = {
                    userName: user.username,
                    bio: user.bio,
                    user_photo: user.user_photo,
                }
                break;
            default:
                //in default get ALL THE MENTIONED COLUMNS  
                userDetails = {
                    full_name: user.full_name,
                    address: user.user_address,
                    city: user.city,
                    district: user.district,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    email: user.email_address,
                    phone_number: user.phone_number,
                    father_name: user.father_name,
                    mother_name: user.mother_name,
                    schoolName: user.tenth_school_name,
                    collegeName: user.college_name,
                    alternateNumber: user.alternate_phone_number,
                    userName: user.username,
                    bio: user.bio,
                    streakCount: user.streak_count,
                    createdAt: user.created_at,
                    active_courseid: user.active_courseid,
                    study_methodid: user.study_methodid,
                    user_photo: user.user_photo,
                }
                break;
        }
        res.status(200).json({
            status: true,
            message: 'User details fetched successfully',
            userDetails,
        });
    } catch (error) {
        console.error('Error fetching user details by flag:', error);
        res.status(500).json({ error: 'Error fetching user details by flag' });
    }
}

