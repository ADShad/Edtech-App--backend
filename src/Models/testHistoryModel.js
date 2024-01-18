module.exports = (sequelize, Sequelize) => {
    const TestHistory = sequelize.define('TestHistory', {
        test_history_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,

        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        test_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Tests',
                key: 'test_id',
            },
        },
        user_answers: {
            type: Sequelize.JSON, // Adjust based on your database support
            allowNull: true,
        },
        correct_answers: {
            type: Sequelize.JSON, // Adjust based on your database support
            allowNull: true,
        },
        attempted_questions: {
            type: Sequelize.JSON, // Adjust based on your database support
            allowNull: true,
        },
        positive_marks: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        negative_marks: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        total_marks: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        total_correct: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        total_attempted: {
            type: Sequelize.INTEGER,
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
        time_taken: {
            type: Sequelize.JSON,
            allowNull: true
        }
    }, {
        tableName: 'TestHistory',
        timestamps: false,
    });

    return TestHistory;
};
