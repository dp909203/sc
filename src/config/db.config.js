import { Sequelize } from 'sequelize';
import config from './config.js';


const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        dialect: config.database.dialect,
        logging: console.log,
    }
);


sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

let db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const users = await import('../model/user.model.js')
const user_passwords = await import('../model/user_password.model.js')
const sessions = await import('../model/user_session.model.js')
const user_information = await import('../model/user_info.model.js');
const posts = await import('../model/post.model.js');

const user_password = user_passwords.default(sequelize, Sequelize);
const User = users.default(sequelize, Sequelize);
const user_sessions = sessions.default(sequelize, Sequelize);
const user_info = user_information.default(sequelize, Sequelize);
const post = posts.default(sequelize, Sequelize);


db.User = User;
db.user_password = user_password;
db.user_sessions = user_sessions;
db.user_info = user_info;
db.post = post


//  db.User = from ('../model/user.model.js')(sequelize, Sequelize)

// import User from ('../model/user.model.js')(sequelize, Sequelize)


db.User.hasOne(db.user_password, { foreignKey: 'user_id' });
db.user_password.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.user_sessions, { foreignKey: 'user_id' });
db.user_sessions.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.user_info, { foreignKey: 'user_id' });
db.user_info.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.post, { foreignKey: 'user_id' });
db.user_info.belongsTo(db.User, { foreignKey: 'user_id' });

sequelize.sync()
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch((error) => {
        console.error('Unable to synchronize the database:', error);
    });

export default db;
