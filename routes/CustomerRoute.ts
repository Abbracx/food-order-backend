import { Router, Request, Response, NextFunction } from "express"
import {
    AddToCart, CreateOrder, CustomerLogin, CustomerRequestOTP,
    CustomerSignup, CustomerVerify, DeleteCart,
    EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders
} from "../controllers"
import { Authenticate } from "../middlewares"

const router = Router()

/*-------------------SignUp / Create Customer-----------------*/
router.post('/signup', CustomerSignup)

/*-------------------Login-----------------*/
router.post('/login', CustomerLogin)

/*-------------------Verify Customer Account-----------------*/

// Authenticate
// router.use(Authenticate)
router.patch('/verify', Authenticate, CustomerVerify)

/*-------------------OTP / Requesting OTP-----------------*/

router.get('/otp', Authenticate, CustomerRequestOTP)

/*-------------------Profile-----------------*/
router.get('/profile', Authenticate, GetCustomerProfile)

router.patch('/profile', Authenticate, EditCustomerProfile)


//Cart

router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);


//Order

router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);

//Payment
export { router as CustomerRoute }