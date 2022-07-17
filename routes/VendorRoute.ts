import { Router, Request, Response, NextFunction } from "express"
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers"
import { Authenticate } from "../middlewares"


const router = Router()

router.post('/login', VendorLogin)

router.get('/profile', Authenticate, GetVendorProfile)
router.patch('/profile', Authenticate, UpdateVendorProfile)
router.patch('/services', UpdateVendorService)

router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Vendor"})
})

export { router as VendorRoute}