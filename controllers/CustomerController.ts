import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CreateCustomerInputs } from "../dto";
import { Customer } from "../models";
import { generateOTP, generatePassword, generateSalt, generateSignature, onRequestOTP } from "../utility";



export const CustomerSigup = async(req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body);
    const inputErrors = await validate(customerInputs, { validationError: { target: true }});

    if(inputErrors.length > 0){
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = customerInputs
    const isExistingEmail = await Customer.findOne({ email: email }) && true
    
    if(isExistingEmail){
        return res.status(409).json({ message: "A customer exist with email ID."})
    }
    const salt = await generateSalt()
    const userPassword = await generatePassword(password, salt)

    const { otp, expiry } = await generateOTP()
    
    
    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lng: 0,
        lat: 0
    })

    if(result){
        // Send OTP to cutomer
        await onRequestOTP(otp, phone)

        // generate signature
        const signature = await generateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // send the result to client
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
    }
    return res.status(400).json({ message: 'Error with SignUp' })
}


export const CustomerLogin = async(req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerVerify = async(req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerRequestOTP = async(req: Request, res: Response, next: NextFunction) => {
    
}

export const GetCustomerProfile = async(req: Request, res: Response, next: NextFunction) => {
    
}

export const EditCustomerProfile = async(req: Request, res: Response, next: NextFunction) => {
    
}