import mongoose from "mongoose";
import { USER, PASSWORD, DATABASE, HOST } from "../config";


const MONGO_URI = 
`${HOST}${USER}:${PASSWORD}@blogcluster.kucm3.mongodb.net/${DATABASE}?retryWrites=true&w=majority`

export default async () => {
    try{
        const conn =  await mongoose.connect(MONGO_URI)
    }catch(error){
        console.log(error)
    //     throw new Error("Bad connection string")
    }
  
}