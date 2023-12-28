module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define('Topic', {
        topic_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        chapter_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Chapters',
                key: 'chapter_id',
            },
        },
        topic_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        description: {
            type: Sequelize.TEXT,
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
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Courses',
                key: 'course_id',
            },
        },
        subject_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Subjects',
                key: 'subject_id',
            },
        },
    }, {
        tableName: 'YourTableName', // Replace 'YourTableName' with the actual table name
        timestamps: false,
    });

    return Topic;
};
