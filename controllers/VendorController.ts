import { Request, Response, NextFunction } from "express";
import { findVendor } from ".";
import { CreateOfferInputs, EditVendorInput, LoginVendorInput } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models/Food";
import { generateSignature, validatePassword } from "../utility";
import { Order } from "../models/Order";
import { Vendor } from "../models";
import { Offer, offerDoc } from "../models/Offer";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { email, password } = <LoginVendorInput>req.body;

  const existingVendor = await findVendor("", email);
  // console.log(existingVendor)
  if (existingVendor) {
    // Validate and give access
    const validation = await validatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const signature = await generateSignature({
        _id: existingVendor._id as string,
        name: existingVendor.name,
        email: existingVendor.email,
        foodTypes: existingVendor.foodType,
      });

      return res.json({ token: signature });
    } else {
      return res.json({ message: "invalid credentials" });
    }
  }
  return res.json({ message: "invalid credentials" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    return res.json({ data: existingVendor });
  }
  return res.json({ message: "existing vendor info not found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodTypes } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.phone = phone;
      existingVendor.address = address;
      existingVendor.foodType = foodTypes;

      const savedResult = await existingVendor.save();
      return res.json({ data: savedResult });
    }
  }
  return res.json({ message: "existing vendor info not found" });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);
      const result = await vendor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add food" });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json({ data: savedResult });
    }
  }
  return res.json({ message: "existing vendor info not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInputs
    >req.body;
    const vendor = await findVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      const createdFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vendor.foods.push(createdFood);
      const result = await vendor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Food info not found" });
};

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders !== null) {
      return res.status(200).json(orders);
    }
  }
  return res.json({ message: "Order not found" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order !== null) {
      return res.status(200).json(order);
    }
  }
  return res.json({ message: "Order not found" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, remarks, time } = req.body;
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("food");

    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;
      if (time) {
        order.readyTime = time;
      }
      const orderResult = await order.save();
      if (orderResult !== null) {
        return res.status(200).json(orderResult);
      }
    }
  }
  return res.json({ message: "Unable to process order" });
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    let currentOffers = Array();
    const offers = await Offer.find().populate("vendors");

    if (offers) {
      offers.map((offer) => {
        if (offer.vendors) {
          offer.vendors.map((vendor) => {
            if (vendor._id.toString === user._id) {
              currentOffers.push(offer);
            }
          });
        }

        if (offer.offerType == "GENERIC") {
          currentOffers.push(offer);
        }
      });
    }
    return res.status(200).json(currentOffers);
  }

  return res.status(404).json({ message: "No offers found" });
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const {
      offerType,
      vendors,
      title,
      description,
      minValue,
      offerAmount,
      pincode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      isActive,
    } = <CreateOfferInputs>req.body;
    const vendor = await findVendor(user._id);

    if (vendor) {
      const offer = await Offer.create({
        offerType,
        vendors: [vendor],
        title,
        description,
        minValue,
        offerAmount,
        pincode,
        promoCode,
        promoType,
        startValidity,
        endValidity,
        bank,
        bins,
        isActive,
      });
      console.log(offer);
      return res.status(200).json(offer);
    }
  }
  return res.status(401).json({ message: "Unable to get offers" });
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params.id;

  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      pincode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      isActive,
    } = <CreateOfferInputs>req.body;
    const currentOffer = await Offer.findById(offerId);

    if (currentOffer) {
      const vendor = await findVendor(user._id);

      if (vendor) {
        currentOffer.title = title;
        currentOffer.offerType = offerType;
        currentOffer.description = description;
        currentOffer.minValue = minValue;
        currentOffer.offerAmount = offerAmount;
        currentOffer.pincode = pincode;
        currentOffer.promoCode = promoCode;
        currentOffer.promoType = promoType;
        currentOffer.startValidity = startValidity;
        currentOffer.endValidity = endValidity;
        currentOffer.bank = bank;
        currentOffer.bins = bins;
        currentOffer.isActive = isActive;

        const result = await currentOffer.save();

        return res.status(200).json(result);
      }
    }
  }
  return res.status(401).json({ message: "Unable edit offers" });
};
