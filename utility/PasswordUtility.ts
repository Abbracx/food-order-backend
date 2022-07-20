import { Request } from "express"
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { AuthPayload, VendorPayload } from "../dto";



export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const validatePassword = async (enteredPWD: string, savedPWD: string, salt: string) => {
    return await generatePassword(enteredPWD, salt) === savedPWD
}

export const generateSignature = async (payload: VendorPayload) => {
    console.log(APP_SECRET)
    return jwt.sign(payload, APP_SECRET as Secret, { expiresIn: "1d"} )
}

export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization')

    if(signature){
        const token = signature.split(" ")[1]
        const payload = jwt.verify(token, APP_SECRET as Secret) as AuthPayload
        req.user = payload
        return true
    }
    return false
}