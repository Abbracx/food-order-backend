import mongoose, { Document, Model, Schema } from "mongoose";
import { OrderDoc } from "./Order";

export interface CustomerDoc extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    salt: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lng: number;
    lat: number;
    cart: [any];
    orders: [OrderDoc]

}

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', require: true },
            unit: { type: Number, require: true }
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'order'
        }
    ]
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)

export { Customer }
