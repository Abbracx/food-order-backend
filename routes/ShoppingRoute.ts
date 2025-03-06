import { Router, Request, Response, NextFunction } from "express"
import { GetAvailableOffers, GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers"

const router = Router()


/*----------------------Food Availability---------------------*/ 
// @ts-ignore
router.get('/:pincode', GetFoodAvailability)

/*----------------------Top Restaurants---------------------*/ 
// @ts-ignore
router.get('/top-restaurants/:pincode', GetTopRestaurants)

/*----------------------Foods Available in 30 mins---------------------*/ 
// @ts-ignore
router.get('/food-in-30-mins/:pincode', GetFoodsIn30Min)

/*----------------------Search Foods---------------------*/ 
// @ts-ignore
router.get('/search/:pincode', SearchFoods)

/*----------------------Find Offers---------------------*/ 
// @ts-ignore
router.get('/offers/:pincode', GetAvailableOffers)

/*----------------------Find Restaurants by ID---------------------*/ 
// @ts-ignore
router.get('/restaurant/:id', RestaurantById)


export { router as ShoppingRoute }