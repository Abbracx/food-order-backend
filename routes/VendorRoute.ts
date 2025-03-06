import { Router, Request, Response, NextFunction } from "express"
import { AddFood, AddOffer, EditOffer, GetCurrentOrders, GetFoods, GetOffers, GetOrderDetails, GetOrders, GetVendorProfile, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers"
import { Authenticate } from "../middlewares"
import multer from "multer";


const router = Router()


const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+"_"+file.originalname)
    }
});

const images = multer({ storage: imageStorage}).array('images', 10)

// @ts-ignore
router.post('/login', VendorLogin)

// router.use(Authenticate);
// @ts-ignore
router.get('/profile', Authenticate, GetVendorProfile)
// @ts-ignore
router.patch('/profile', Authenticate, UpdateVendorProfile)
// @ts-ignore
router.patch('/coverimage', Authenticate, images, UpdateVendorCoverImage)
// @ts-ignore
router.patch('/services',Authenticate, UpdateVendorService) 

// @ts-ignore
router.post('/food', Authenticate, images, AddFood)
// @ts-ignore
router.get('/foods', Authenticate, GetFoods)

// Orders 
// @ts-ignore
router.post('/orders', Authenticate, GetCurrentOrders)
// @ts-ignore
router.put('/order/:id/process', Authenticate, ProcessOrder)
// @ts-ignore
router.post('/order/:id', Authenticate, GetOrderDetails)


//Offers
// @ts-ignore
router.get("/offers", GetOffers); 
// @ts-ignore
router.post("/offer", AddOffer);
// @ts-ignore
router.put("/offer/:id", EditOffer);




router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Vendor"})
})

export { router as VendorRoute}