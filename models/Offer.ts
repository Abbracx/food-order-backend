import mongoose, { Schema, Document } from "mongoose";

export interface offerDoc extends Document {
    offerType: string; // e.g, Vendors, Generic
    vendors: [any]; // ['3453245545']
    title: string; // 100 Naira off on weekends
    description: string; // any desciption with terms and conditions 
    minValue: number; //  Minimum order amount 500
    offerAmount: number; // 100
    startValidity: Date; // 
    endValidity: Date;
    promoCode: string; // WEEK 200
    promoType: string; // USER // ALL // BANK // CARD
    bank: [any];
    bins: [any];
    pincode: string;
    isActive: boolean;
}

const OfferSchema = new Schema({
   offerType: { type: String, require: true },
   vendors: [
    {
        type: Schema.Types.ObjectId, ref : 'vendor'
    }
   ],
   title: { type: String, require: true },
   description: { type: String, require: true },
   minValue: { type: Number, require: true },
   offerAmount: { type: Number, require: true },
   startValidity: { type: Date },
   endValidity: { type: Date },
   promoCode: { type: String, require: true },
   promoType: { type: String, require: true },
   bank: [
    {
        type: String
    }
   ],
   bins: [
    {
        type: Number
    }
   ],
   pincode: { type: Number, require: true },
   isActive: { type: Boolean, require: true }
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

const Offer = mongoose.model<offerDoc>('offer', OfferSchema)

export { Offer }