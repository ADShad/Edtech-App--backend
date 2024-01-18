module.exports = (sequelize, Sequelize) => {
    const Test = sequelize.define('Test', {
        test_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        chapter_ids: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        test_type: {
            type: Sequelize.ENUM('Timed', 'Class', 'RapidFire'),
            allowNull: true,
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
        total_question: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        duration_per_question: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        pattern: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        question_level: {
            type: Sequelize.ENUM('Easy', 'Average', 'Hots', 'Master'),
        }
    }, {
        tableName: 'Tests',
        timestamps: false,
    });

    return Test;
};
