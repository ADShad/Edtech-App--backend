module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define('History', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        content_type: {
            type: Sequelize.ENUM('video', 'test', 'notes'),
            allowNull: false,
        },
        content_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        content_name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        progress: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
            onUpdate: Sequelize.NOW,
        },
    }, {
        tableName: 'history',
        timestamps: false,
    });

    return History;
};
