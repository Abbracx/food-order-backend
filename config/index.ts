import { config } from 'dotenv'

config()

export const HOST = process.env.HOST
export const PASSWORD = process.env.MONGO_PASSWORD
export const USER = process.env.MONGO_USER
export const DATABASE = process.env.MONGO_DATABASE
export const APP_SECRET = process.env.APP_SECRET;
export const AUTH_TOKEN = process.env.AUTH_TOKEN
export const ACCOUNT_SID = process.env.ACCOUNT_SID