import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrder extends Document {
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    [key: string]: any;
  };
  product: {
    _id: string;
    variant: string;
    quantity: number;
    price: number;
    title: string;
    image: string;
    sizes: string[];
    variants: string[];
    totalPrice: number;
    [key: string]: any;
  };
  transactionStatus: string;
  totalPrice: number;
  createdAt: Date;
  paymentIntentId: string | null;
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customer: { type: Object, required: true },
  product: { type: Object, required: true },
  transactionStatus: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentIntentId: { type: String, required: false },
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
