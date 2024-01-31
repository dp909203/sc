export default (sequelize, Sequelize) => {
    const post = sequelize.define('posts', {

        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            referances: {
                model: 'users',
                key: 'id'
            }
        },
        post_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },

    },
        {
            tableName: 'posts',

        })

    return post;
}