import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDoc extends Document {
    orderID: string, //1234435678
    vendorId: string,
    items: [any], // { food, unit }
    totalAmount: number, // 600.00
    orderDate: Date, // Date
    paidThrough: string, // COD, CARD, NET BANKING, WALLET,
    paymentResponse: string, // { Long response object for charge back scenario }
    orderStatus: string // waiting, failed, ACCEPT, REJECT, UNDER-PROCESS, READY, ON-THE-WAY, DELIVERED, CANCELLED
    remarks: string,
    deliveryId: string,
    appliedOffers: boolean,
    offerId: string, 
    readyTime: number, // max 60 minutes
}

const OrderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    vendorId: { type: String, required: true},
    items: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'food', required: true },
            unit: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paidThrough: { type: String },
    payentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId:{ type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String }, 
    readyTime:{ type: Number }

    },{
        toJSON: {
            transform(doc, ret){
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps: true
    })

export const Order = mongoose.model<OrderDoc>('order', OrderSchema);