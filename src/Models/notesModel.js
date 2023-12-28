module.exports = (sequelize, Sequelize) => {
    const Notes = sequelize.define('Notes', {
        notes_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        topic_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Topics',
                key: 'topic_id'
            }
        },
        chapter_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Chapters',
                key: 'chapter_id'
            }
        },
        subject_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Subjects',
                key: 'subject_id'
            }
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Courses',
                key: 'course_id'
            }
        },
        notes_url: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    }, {
        tableName: 'Notes',
        timestamps: false,
    });

    return Notes;
};
