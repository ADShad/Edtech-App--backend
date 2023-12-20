module.exports = (sequelize, Sequelize) => {
    const courseMapping = sequelize.define('courseMapping', {
        course_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        course_title: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        course_price: {
            type: Sequelize.DECIMAL(10, 2),
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
        tableName: 'course_mapping',
        timestamps: false, // Set to true if you want Sequelize to manage timestamps
    });

    return courseMapping;
};
