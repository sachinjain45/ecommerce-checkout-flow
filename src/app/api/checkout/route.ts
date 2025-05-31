import { dbConnect } from "@/lib/dbConnect";
import stripe from "@/lib/stripe";
import sendMail from "@/lib/sendMail";
import Order from "@/models/Order";
import Product from "@/models/Product";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface ProductData {
  _id: string;
  variant: string;
  quantity: number;
}

interface CheckoutRequestBody {
  customer: Customer;
  product: ProductData;
  paymentMethodId: string;
  paymentIntentId: string;
}

type TransactionStatus = "approved" | "declined" | "error" | "requires_action";

const ERROR_RESPONSES = {
  PRODUCT_NOT_FOUND: {
    status: "error",
    message: "Product not found",
  },
  INSUFFICIENT_STOCK: {
    status: "error",
    message: "Insufficient stock",
  },
  PAYMENT_INTENT_NOT_FOUND: {
    status: "error",
    message: "PaymentIntent not found",
  },
  INTERNAL_SERVER_ERROR: {
    status: "error",
    message: "Internal Server Error",
  },
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = (await req.json()) as CheckoutRequestBody;
    const { customer, product, paymentIntentId } = body;

    const orderNumber = uuidv4();

    const productInDB = await Product.findById(product._id);
    if (!productInDB) {
      return NextResponse.json(ERROR_RESPONSES.PRODUCT_NOT_FOUND, {
        status: 404,
      });
    }

    if (productInDB.stock < product.quantity) {
      return NextResponse.json(ERROR_RESPONSES.INSUFFICIENT_STOCK, {
        status: 400,
      });
    }

    const totalPrice = product.quantity * productInDB.price;

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!intent) {
      return NextResponse.json(ERROR_RESPONSES.PAYMENT_INTENT_NOT_FOUND, {
        status: 404,
      });
    }

    let transactionStatus: TransactionStatus;

    switch (intent.status) {
      case "succeeded":
        transactionStatus = "approved";
        productInDB.stock -= product.quantity;
        await productInDB.save();
        break;
      case "requires_payment_method":
      case "canceled":
        transactionStatus = "declined";
        break;
      case "requires_action":
        transactionStatus = "requires_action";
        break;
      default:
        transactionStatus = "error";
    }

    await Order.create({
      orderNumber,
      customer,
      product: {
        ...product,
        price: productInDB.price,
        title: productInDB.title,
        image: productInDB.image,
        totalPrice,
      },
      totalPrice,
      transactionStatus,
      paymentIntentId,
    });

    await sendMail({
      status: "approved",
      to: customer.email,
      orderNumber,
      totalPrice,
      customer,
      product: {
        title: productInDB.title,
        price: productInDB.price,
        quantity: product.quantity,
        variant: product.variant,
      },
      message: "Thank you for your purchase! Your order has been confirmed.",
    });

    return NextResponse.json(
      {
        orderNumber,
        status: transactionStatus,
        paymentIntentId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout POST error:", error);
    return NextResponse.json(ERROR_RESPONSES.INTERNAL_SERVER_ERROR, {
      status: 500,
    });
  }
}
