import { Router, Request, Response, NextFunction } from "express"
import { createVendor, getVendors, getVendorById } from "../controllers"



const router = Router()

// @ts-ignore
router.post('/vendors', createVendor)
// @ts-ignore
router.get('/vendors', getVendors)
// @ts-ignore
router.get('/vendors/:id', getVendorById)

router.get('/',(req: Request, res: Response, next: NextFunction) => {
    res.send({ message: "Successful Admin"})
})

export { router as AdminRoute}