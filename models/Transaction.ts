import mongoose, { Schema, Document } from "mongoose";

export interface transactionDoc extends Document {
    customer: string;
    vendorId: string;
    orderId: string;
    orderValue: number;
    offerUsed: string;
    status: string;
    paymentMethod: string;
    paymentResponse: string;
}

const TransactionSchema = new Schema({
    customer: String,
    vendorId: String,
    orderId: String,
    orderValue: Number,
    offerUsed: String,
    status: String,
    paymentMethod: String,
    paymentResponse: String
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v
        }
    },
    timestamps: true
});

const Transaction = mongoose.model<transactionDoc>('transaction', TransactionSchema)

export { Transaction }