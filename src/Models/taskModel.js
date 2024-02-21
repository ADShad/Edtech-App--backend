module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('Task', {
        task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        task_type: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        day_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        content_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        content_url: {
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
        tableName: 'Tasks',
        timestamps: false,
    });

    return Task;
};
