import { Router, Request, Response, NextFunction } from "express"
import {
    AddToCart, CreateOrder, CreatePayment, CustomerLogin, CustomerRequestOTP,
    CustomerSignup, CustomerVerify, DeleteCart,
    EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, VerifyOffer
} from "../controllers"
import { Authenticate } from "../middlewares"

const router = Router()

/*-------------------SignUp / Create Customer-----------------*/
// @ts-ignore
router.post('/signup', CustomerSignup)

/*-------------------Login-----------------*/
// @ts-ignore
router.post('/login', CustomerLogin)

/*-------------------Verify Customer Account-----------------*/

// Authenticate
// router.use(Authenticate)
// @ts-ignore
router.patch('/verify', Authenticate, CustomerVerify)

/*-------------------OTP / Requesting OTP-----------------*/
// @ts-ignore
router.get('/otp', Authenticate, CustomerRequestOTP)

/*-------------------Profile-----------------*/
// @ts-ignore
router.get('/profile', Authenticate, GetCustomerProfile)
// @ts-ignore
router.patch('/profile', Authenticate, EditCustomerProfile)


//Cart
// @ts-ignore
router.post('/cart', AddToCart);
// @ts-ignore
router.get('/cart', GetCart);
// @ts-ignore
router.delete('/cart', DeleteCart);

// Apply Offer
// @ts-ignore
router.get('/offer/verify/:id', VerifyOffer);


//Order
// @ts-ignore
router.post('/create-order', CreateOrder);
// @ts-ignore
router.get('/orders', GetOrders);
// @ts-ignore
router.get('/order/:id', GetOrderById);

//Payment
// @ts-ignore
router.post('/create-payment', CreatePayment );

export { router as CustomerRoute }