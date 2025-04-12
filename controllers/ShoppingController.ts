import { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";
import { foodDoc } from "../models/Food";
import { Offer } from "../models/Offer";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: -1 })
    .populate("foods");
 
  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: -1 })
    .limit(5);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found" });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: foodDoc[] = [];

    result.map((vendor) => {
      const foods = vendor.foods as [foodDoc];

      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: foodDoc[] = [];
    result.map((item) => foodResult.push(...item.foods));
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found!" });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const restaurantID = req.params.id;

  const result = await Vendor.findById(restaurantID).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found" });
};

export const GetAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const pincode = req.params.pincode;
  const offers =  await Offer.find({ pincode, isActive: true });
  
  if (offers) {
    return res.status(200).json(offers);
  }

  return res.status(400).json({ message: "Offers  not found" });
};
