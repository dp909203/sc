export default (sequelize, Sequelize) => {
    const user_session = sequelize.define('user_sessions', {
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        expire_time: {
            type: Sequelize.DATE,
            allowNull: false,
        },

    },
        {
            tableName: 'user_sessions'
        });

    return user_session;
}

