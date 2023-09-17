export interface CreateVendorInput{
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditVendorInput {
    name: string;
    address: string;
    phone: string;
    foodTypes: [string];
}

export interface LoginVendorInput {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    name: string;
    email: string;
    foodTypes: [string]; 
}

export interface CreateOfferInputs {
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
