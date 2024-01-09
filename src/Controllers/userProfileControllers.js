const db = require('../../Config/connection');
const { Op } = require('sequelize');
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
            attributes: ['id', 'username', 'email_address', 'full_name', 'bio', 'active_courseid', 'study_methodid'],
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

