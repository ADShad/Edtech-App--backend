const db = require('../../Config/connection');
const { Op } = require('sequelize');
const multer = require('multer');
const AWS = require('aws-sdk');
const usersModel = db.usersModel;
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
            order: [['created_at', 'DESC']], // Order by created_at in descending order
            limit: 5, // Limit the result to 5 entries
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