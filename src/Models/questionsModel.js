module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define('Question', {
        question_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        test_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Tests',
                key: 'test_id',
            },
        },
        chapter_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Chapters',
                key: 'chapter_id',
            },
        },
        question_text: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        question_level: {
            type: Sequelize.ENUM('Easy', 'Average', 'Hard', 'Master'),
            allowNull: true,
        },
        negative_marking: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        correct_option_index: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        options: {
            type: Sequelize.JSON, // Adjust based on your database support
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
    }, {
        tableName: 'Questions',
        timestamps: false,
    });

    return Question;
};
