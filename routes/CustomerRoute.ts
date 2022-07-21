import { Router, Request, Response, NextFunction } from "express"
import { CustomerLogin, CustomerRequestOTP, CustomerSigup, CustomerVerify, EditCustomerProfile, GetCustomerProfile } from "../controllers"

const router = Router()

/*-------------------SignUp / Create Customer-----------------*/ 
router.post('/signup', CustomerSigup)

/*-------------------Login-----------------*/ 
router.post('/login', CustomerLogin)

/*-------------------Verify Customer Account-----------------*/ 

router.patch('/verify', CustomerVerify)

/*-------------------OTP / Requesting OTP-----------------*/ 

router.get('/otp', CustomerRequestOTP)

/*-------------------Profile-----------------*/ 
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)


//Cart
//Order
//Payment
export { router as CustomerRoute }