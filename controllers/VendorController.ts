import { Request, Response, NextFunction } from 'express';
import { findVendor } from '.';
import { EditVendorInput, LoginVendorInput } from '../dto';
import { generateSignature, validatePassword } from '../utility';

export const VendorLogin = async ( req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <LoginVendorInput>req.body

    const existingVendor = await findVendor("", email)

    if(existingVendor){ 
        // Validate and give access
        const validation = await validatePassword(password, existingVendor.password, existingVendor.salt)
        
        if(validation){
            const signature  = generateSignature({
                _id: existingVendor.id,
                name: existingVendor.name,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType
            })
            return res.json({ "token": signature })
        } else {
            return res.json({"message":"invalid credentials"})
        }
    }
    return res.json({"message":"invalid credentials"})
} 

export const GetVendorProfile = async ( req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(user){
        const existingVendor = await findVendor(user._id)
        return res.json({ "data": existingVendor })
    }
    return res.json({ "message": "existing vendor info not found" })
} 

export const UpdateVendorProfile = async ( req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodTypes } = <EditVendorInput>req.body
    const user = req.user
    if(user){
        const existingVendor = await findVendor(user._id)
        
        if(existingVendor !== null){
            existingVendor.name = name
            existingVendor.phone = phone
            existingVendor.address = address
            existingVendor.foodType = foodTypes
            
            const savedResult =  await existingVendor.save()
            return res.json({ "data": savedResult })
        }
    }
    return res.json({ "message": "existing vendor info not found" })
} 

export const UpdateVendorService = async ( req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(user){
        const existingVendor = await findVendor(user._id)

        if(existingVendor !== null){
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable
            const savedResult = await existingVendor.save()
            return res.json({ "data": savedResult })
        }
    }
    return res.json({ "message": "existing vendor info not found" })
} 