import dotenv from 'dotenv';
dotenv.config()

export const {
    APP_PORT,
    APP_URL,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    SALT_FACTOR
} = process.env;