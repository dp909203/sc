import { } from 'dotenv/config'

const config = {
    database: {
        database: process.env.DB_DATABASE || "sc",
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "",
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || 'mysql'
    },

    protocol: process.env.PROTOCOL || 'http',
    port: process.env.PORT || 4002,
    secretKey: process.env.SECRET_KEY || "your_secret_key_here",

};

export default config;