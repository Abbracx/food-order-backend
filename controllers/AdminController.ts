import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generatePassword, generateSalt } from "../utility";


export const createVendor = async (req: Request, res: Response, next: NextFunction) => {

    const data = <CreateVendorInput>req.body
    
    const existingVendor = await Vendor.findOne({ email: data.email })

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
        coverImages: []
    })
    return res.json(createVendor)
}

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {
    const data = { hello: "get vendors"}
    return res.json(data)
}

export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const data = { hello: "get vendors with IDs"}
    return res.json(data)
}