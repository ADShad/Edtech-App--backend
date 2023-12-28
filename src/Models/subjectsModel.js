module.exports = (sequelize, Sequelize) => {
    const Subject = sequelize.define('Subject', {
        subject_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Courses',
                key: 'course_id',
            },
        },
        subject_name: {
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
    }, {
        tableName: 'Subjects', // Replace 'YourTableName' with the actual table name
        timestamps: false,
    });

    return Subject;
};
