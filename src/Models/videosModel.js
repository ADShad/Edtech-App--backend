module.exports = (sequelize, Sequelize) => {
    const Video = sequelize.define('Video', {
        video_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        topic_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Topics',
                key: 'topic_id',
            },
        },
        video_url: {
            type: Sequelize.STRING(255),
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
        subject_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Subjects',
                key: 'subject_id',
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
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Courses',
                key: 'course_id',
            },
        },
    }, {
        tableName: 'Videos', // Replace 'YourTableName' with the actual table name
        timestamps: false,
    });

    return Video;
};
