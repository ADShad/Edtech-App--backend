// const users = require('./usersModel');
module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        method: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        order_id: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        receipt: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        transaction_id: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            onUpdate: Sequelize.NOW,
        },
    }, {
        tableName: 'payments',
        timestamps: false, // Set to true if you want Sequelize to manage timestamps
    });

    return Payment;
};
