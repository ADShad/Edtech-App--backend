module.exports = (sequelize, Sequelize) => {
    const MeetingSchedule = sequelize.define('MeetingSchedule', {
        meeting_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        time_slot: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        call_type: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        mobile_number: {
            type: Sequelize.STRING(15),
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'user_id',
            },
        },
    }, {
        tableName: 'MeetingSchedule',
        timestamps: false,
    });

    return MeetingSchedule;
};
