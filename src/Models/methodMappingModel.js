module.exports = (sequelize, Sequelize) => {
    const MethodMapping = sequelize.define('MethodMapping', {
        method_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        method_name: {
            type: Sequelize.STRING(255),
            allowNull: false,
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
        tableName: 'method_mapping',
        timestamps: false,
    });

    return MethodMapping;
};