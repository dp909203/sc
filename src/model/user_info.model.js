export default (sequelize, Sequelize) => {
    const user_info = sequelize.define('user_informations', {

        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            referances: {
                model: 'users',
                key: 'id'
            }
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        profile_photo: {
            type: Sequelize.STRING,
            allowNull: false,
        },



    },
        {
            tableName: 'user_informations',
            // text.slice(0, 1).toUpperCase()+text.slice(1).toLowerCase()
            hooks: {
                beforeCreate: (user, options) => {
                    user.first_name = user.first_name.slice(0, 1).toUpperCase() + user.first_name.slice(1).toLowerCase();
                    user.last_name = user.last_name.slice(0, 1).toUpperCase() + user.first_name.slice(1).toLowerCase();
                },

            },


        })

    return user_info;
}