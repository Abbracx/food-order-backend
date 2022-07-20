import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generatePassword, generateSalt } from "../utility";


export const findVendor =  async (id: string | undefined, email?: string) => {
    
        // return await Vendor.findOne({ email }) || await Vendor.findById(id)
        try {

            if(email) return await Vendor.findOne({ email })

            return await Vendor.findById(id)

        }catch(error){
            throw new Error((error as Error).message)
        }
}

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {

    const data = <CreateVendorInput>req.body
    
    const existingVendor = await findVendor('', data.email)

    if(existingVendor) return res.json({ "message": "Vendor with that email ID exist."})
    
    // Generate a salt
    const salt = await generateSalt()

    // Use salt to encrypt password
    const userPassword = await generatePassword(data.password, salt)

    const createVendor = await Vendor.create({
        ...data,
        password: userPassword,
        salt: salt,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    })
    return res.json(createVendor)
}

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find()

    if(vendors !== null){
        return res.json(vendors)
    }
    return res.json({"message":"Vendors data not available"})
}

export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorID = req.params.id

    const vendor = await findVendor(vendorID)

    if(vendor !== null) return res.json(vendor)

    return res.json({"message":"Vendor data does not exist"})
}