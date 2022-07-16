import { Router, Request, Response, NextFunction } from "express"
import { createVendor, getVendors, getVendorById } from "../controllers"



const router = Router()


router.post('/vendors', createVendor)
router.get('/vendors', getVendors)
router.get('/vendors/:id', getVendorById)

router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Admin"})
})

export { router as AdminRoute}