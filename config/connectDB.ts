import mongoose from "mongoose";

const MONGO_URI = `mongodb://localhost:27017/online_food_delivery`

export const connectdb = async () => {
    try{
        const conn =  await mongoose.connect(MONGO_URI)
    }catch(error){
        throw new Error("Bad connection string")
    }
  
}