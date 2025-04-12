import mongoose from "mongoose";
import { USER, PASSWORD, DATABASE, HOST } from "../config";


const MONGO_URI = `${HOST}${USER}:${PASSWORD}@abbracxcluster.kucm3.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=AbbracxCluster`;

export default async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    if (conn) {
      console.log("Connected to Database successfully")
    }
  } catch (error) {
    console.log(error);
    //     throw new Error("Bad connection string")
  }
};
