module.exports = (sequelize, Sequelize) => {
    const Chapter = sequelize.define('Chapter', {
        chapter_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        subject_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Subjects',
                key: 'subject_id',
            },
        },
        chapter_name: {
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
    }, {
        tableName: 'Chapters', // Replace 'YourTableName' with the actual table name
        timestamps: false,
    });

    return Chapter;
};
