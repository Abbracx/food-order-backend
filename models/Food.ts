import mongoose, { Schema, Document } from "mongoose";

export interface foodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
}

const FoodSchema = new Schema({
    vendorId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] }
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true
});

const Food = mongoose.model<foodDoc>('food', FoodSchema)

export { Food }