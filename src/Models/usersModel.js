module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        full_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        phone_number: {
            type: Sequelize.STRING(15),
            allowNull: true,
        },
        alternate_phone_number: {
            type: Sequelize.STRING(15),
            allowNull: true,
        },
        email_address: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        bio: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        username: {
            type: Sequelize.STRING(50),
            allowNull: true,
            // unique: true,
        },
        user_password: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        profession: {
            type: Sequelize.ENUM('student', 'professional', 'parent', 'learner', 'teacher'),
            allowNull: true,
        },
        course_codes: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        active_courseid: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        course_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        course_start_date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        is_paid: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        user_address: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        district: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        city: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        state: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        gender: {
            type: Sequelize.ENUM('male', 'female', 'other'),
            allowNull: true,
        },
        date_of_birth: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        tenth_school_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        tenth_school_location: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        twelfth_school_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        twelfth_school_location: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        graduate_degree: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        post_graduation_degree: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        other_academic_degree: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        father_name: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        mother_name: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        college_name: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        achievements: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        study_methodid: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        referral_code: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },
        referral_code_used: {
            type: Sequelize.TINYINT(1),
            allowNull: true,
            defaultValue: 0,
        },
        course_type: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        study_type: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        user_photo: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        avatar_image: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        spirit: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        grains: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        blades: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        pulse: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        referral_link: {
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
        demoTimestamp: {
            type: Sequelize.DATE, // Assuming you want to use Sequelize's DATE data type for datetime
            allowNull: true, // Allow NULL values for the demoTimestamp column
        },
    }, {
        tableName: 'users',
        timestamps: false, // Set to true if you want Sequelize to manage timestamps
    });
    return users;
};
