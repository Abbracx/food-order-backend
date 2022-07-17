import mongoose from "mongoose";
import { config } from 'dotenv'

config()

const HOST = process.env.HOST
const PASSWORD = process.env.MONGO_PASSWORD
const USER = process.env.MONGO_USER
const DATABASE = process.env.MONGO_DATABASE

const MONGO_URI = 
`${HOST}${USER}:${PASSWORD}@blogcluster.kucm3.mongodb.net/${DATABASE}?retryWrites=true&w=majority`
export const connectdb = async () => {
    try{
        const conn =  await mongoose.connect(MONGO_URI)
    }catch(error){
        console.log(error)
    //     throw new Error("Bad connection string")
    }
  
}