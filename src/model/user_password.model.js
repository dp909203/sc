export default (sequelize, Sequelize) => {
    const user_password = sequelize.define('user_passwords', {

        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            referances: {
                model: 'users',
                key: 'id'
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },

    },
        {
            tableName: 'user_passwords'

        })

    return user_password;
}