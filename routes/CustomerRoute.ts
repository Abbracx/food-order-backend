import { Router, Request, Response, NextFunction } from "express"
import { CustomerLogin, CustomerRequestOTP, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile } from "../controllers"
import { Authenticate } from "../middlewares"

const router = Router()

/*-------------------SignUp / Create Customer-----------------*/ 
router.post('/signup', CustomerSignup)

/*-------------------Login-----------------*/ 
router.post('/login', CustomerLogin)

/*-------------------Verify Customer Account-----------------*/ 

// Authenticate
// router.use(Authenticate)
router.patch('/verify',Authenticate, CustomerVerify)

/*-------------------OTP / Requesting OTP-----------------*/ 

router.get('/otp', Authenticate, CustomerRequestOTP)

/*-------------------Profile-----------------*/ 
router.get('/profile', Authenticate, GetCustomerProfile)

router.patch('/profile', Authenticate, EditCustomerProfile)


//Cart
//Order
//Payment
export { router as CustomerRoute }