import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import {
  CreateCustomerInputs,
  UserLoginInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  CartItem,
} from "../dto";
import { Customer, CustomerDoc, Food, Transaction } from "../models";
import {
  generateOTP,
  generatePassword,
  generateSalt,
  generateSignature,
  onRequestOTP,
  validatePassword,
} from "../utility";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";

// Signup controller
export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;
  const isExistingEmail = (await Customer.findOne({ email: email })) && true;

  if (isExistingEmail) {
    return res.status(409).json({ message: "A customer exist with email ID." });
  }
  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);

  const { otp, expiry } = await generateOTP();

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lng: 0,
    lat: 0,
    orders: []
  });

  if (result) {
    // Send OTP to cutomer
    await onRequestOTP(otp, phone);

    // generate signature
    const signature = await generateSignature({
      _id: result._id as string,
      email: result.email,
      verified: result.verified,
    });
    // send the result to client
    return res
      .status(201)
      .json({
        signature: signature,
        verified: result.verified,
        email: result.email,
      });
  }
  return res.status(400).json({ message: "Error with SignUp" });
};

// Login Controller
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await validatePassword(
      password,
      customer.password,
      customer.salt
    );
  
    if (validation) {
      const signature = await generateSignature({
        _id: customer._id as string,
        email: customer.email,
        verified: customer.verified,
      });
      return res
        .status(201)
        .json({
          signature: signature,
          verified: customer.verified,
          email: customer.email,
        });
    }
  }
  return res.status(404).json({ message: "No user with given credentials" });
};

// Verify OTP controller controller
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry > new Date()) {
        profile.verified = true;
        const updatedCustomerResponse = await profile.save();

        const signature = await generateSignature({
          _id: updatedCustomerResponse._id as string,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        return res.status(200).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error with OTP validation" });
};

export const CustomerRequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = await generateOTP();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent to your registered phone number" });
    }
  }
  return res.status(400).json({ message: "Error Occured" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with fetched profile" });
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "Error Occured" });
};

export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    // fetch customer and populate his cart array
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile != null) {
        // check for cart items
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check update unit
          let existFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );
          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new item cart
          cartItems.push({ food, unit });
        }
        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult);
        }
      }
    }
  }
  9;
  return res.status(400).json({ message: "Unable to create cart!" });
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }
  return res.status(400).json({ message: "cart is empty" });
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile !== null) {
      profile.cart = [] as any;
      const cartResult = await profile.save();
      return res.status(200).json(cartResult);
    }
  }
  return res.status(400).json({ message: "cart is already empty" });
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
    const { txnId, amount, items} = <OrderInputs>req.body;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;

    const cart = <[CartItem]>req.body;

    let cartItems = Array();
    let netAmount = 0.0;
    let vendorId;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit: unit });
        } else {
          console.log(`${food._id} / ${_id}`);
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderID: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "Some json response stringify",
        orderStatus: "waiting",
        remarks: "",
        deliveryId: "",
        appliedOffer: false,
        offerId: null,
        readyTime: 45,
      });

      (profile as CustomerDoc).cart = [] as any;
      profile?.orders.push(currentOrder);
      const profileSaveResponse = await profile?.save();
      res.status(200).json(profileSaveResponse);
    } else {
      res.status(400).json({ message: "Unable to create Order!" });
    }
  }
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    console.log(profile);
    res.status(200).json(profile?.orders);
  }
};
export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate("items.food");

  if (order) {
    return res.status(200).json(order);
  }
  return res.status(404).json({ message: "Order not found" });
};

export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer && appliedOffer.isActive) {
        const promoType = appliedOffer.promoType
        if(promoType === "USER"){
            //apply offer once per user
        }
      return res
        .status(200)
        .json({ message: "Offer is valid", offer: appliedOffer });
    }
  }
  return res
        .status(401)
        .json({ message: "Offer is not valid"});
};

export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {
     const customer = req.user;
     const { amount, paymentMode, offerId } = req.body;

     let payableAmount = Number(amount);

     if(offerId){
        const appliedOffer = await Offer.findById(offerId);

        if(appliedOffer){

            if(appliedOffer.isActive){
                payableAmount = (payableAmount - appliedOffer.offerAmount);
            }
        }
     }

     // Perform payment gateway charge API Calls

     // right after payment gateway success / failure response
     //Create Record on Transaction
     const transaction = await Transaction.create({
        customer: customer?._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN', // Failed // Success
        paymentMode: paymentMode,
        paymentResponse: 'Payment is cash on delivery',
     })

     // return transaction ID
     return res.status(200).json(transaction);
}
