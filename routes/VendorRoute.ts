import { Router, Request, Response, NextFunction } from "express"
import { AddFood, GetCurrentOrders, GetFoods, GetOrderDetails, GetOrders, GetVendorProfile, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers"
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

router.post('/login', VendorLogin)

router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/coverimage', Authenticate, images, UpdateVendorCoverImage)
router.patch('/services',Authenticate, UpdateVendorService)


router.post('/food', Authenticate, images, AddFood)
router.get('/foods', Authenticate, GetFoods)

// Orders 
router.post('/orders', Authenticate, GetCurrentOrders)
router.get('/order/:id/process', Authenticate, ProcessOrder)
router.post('/order/:id', Authenticate, GetOrderDetails)



router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Vendor"})
})

export { router as VendorRoute}