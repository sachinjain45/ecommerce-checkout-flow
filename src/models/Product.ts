import mongoose, { Document, Model, Schema } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  variants: string[];
  stock: number;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  variants: { type: [String], required: true },
  stock: { type: Number, required: true },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
