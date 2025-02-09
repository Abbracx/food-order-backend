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
