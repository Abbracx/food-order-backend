import { Router, Request, Response, NextFunction } from "express"
import { GetAvailableOffers, GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers"

const router = Router()


/*----------------------Food Availability---------------------*/ 
router.get('/:pincode', GetFoodAvailability)

/*----------------------Top Restaurants---------------------*/ 
router.get('/top-restaurants/:pincode', GetTopRestaurants)

/*----------------------Foods Available in 30 mins---------------------*/ 
router.get('/food-in-30-mins/:pincode', GetFoodsIn30Min)

/*----------------------Search Foods---------------------*/ 
router.get('/search/:pincode', SearchFoods)

/*----------------------Find Offers---------------------*/ 
router.get('/offers/:pincode', GetAvailableOffers)

/*----------------------Find Restaurants by ID---------------------*/ 
router.get('/restaurant/:id', RestaurantById)


export { router as ShoppingRoute }