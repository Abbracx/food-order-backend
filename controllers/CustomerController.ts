import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInputs } from "../dto";
import { Customer } from "../models";
import { generateOTP, generatePassword, generateSalt, generateSignature, onRequestOTP, validatePassword } from "../utility";


// Signup controller
export const CustomerSignup = async(req: Request, res: Response, next: NextFunction) => {

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

// Login Controller
export const CustomerLogin = async(req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(UserLoginInputs, req.body)
    const loginErrors = await validate(loginInputs, { validationError: { target: false }})

    if(loginErrors.length > 0){
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs
    const customer =  await Customer.findOne({ email: email });

    if(customer){
        const validation = await validatePassword(password, customer.password, customer.salt)

        if(validation){
            const signature = await generateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email })
        }
    }
    return res.status(404).json({ message: 'No user with given credentials' })
}

// Verify OTP controller controller
export const CustomerVerify = async(req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body
    const customer = req.user
    
    if(customer){
        const profile = await Customer.findById(customer._id)
       
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry > new Date()){
                profile.verified = true
                const updatedCustomerResponse = await profile.save()

                const signature = await generateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
                return res.status(200).json({ signature: signature, 
                    verified: updatedCustomerResponse.verified, 
                    email: updatedCustomerResponse.email })
            }
        }
    }
    return res.status(400).json({ message: 'Error with OTP validation' })
}


export const CustomerRequestOTP = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user
    
    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            const { otp, expiry } = await generateOTP()
            profile.otp = otp
            profile.otp_expiry = expiry

            await profile.save()
            await onRequestOTP(otp, profile.phone)

            return res.status(200).json({ message: "OTP sent to your registered phone number"})
        }
    }
    return res.status(400).json({ message: 'Error Occured' })
}

export const GetCustomerProfile = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user
    
    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){ 
            return res.status(200).json(profile)
        }
    }
    return res.status(400).json({ message: 'Error with fetched profile' })
}


export const EditCustomerProfile = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user
    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)
    const profileErrors = await validate(profileInputs, { validationError: { target: false }})

    if(profileErrors.length > 0){
        return res.status(400).json(profileErrors)
    }

    const { firstName, lastName, address } = profileInputs
    
    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){

            profile.firstName = firstName
            profile.lastName = lastName
            profile.address = address

            const result = await profile.save()

            return res.status(200).json(result)
        }
    }
    return res.status(400).json({ message: 'Error Occured' })
}