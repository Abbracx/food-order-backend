import { Router, Request, Response, NextFunction } from "express"
import { AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers"
import { Authenticate } from "../middlewares"


const router = Router()

router.post('/login', VendorLogin)

router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/services',Authenticate, UpdateVendorService)


router.post('/food', Authenticate, AddFood)
router.get('/foods', Authenticate, GetFoods)


router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Vendor"})
})

export { router as VendorRoute}