import mongoose from "mongoose";
import Product from "../models/Product.js";

const MONGODB_URI = process.env.NEXT_MONGO_URI as string;
const dummyProducts = Array.from({ length: 2 }, (_, i) => ({
  title: `Sneaker Model ${i + 1}`,
  description: `Stylish and comfy sneaker model ${i + 1}`,
  image:
    "https://media.istockphoto.com/id/2192435275/photo/close-up-of-senior-athletes-hands-tying-shoelace-on-sneaker-outdoors.jpg?s=1024x1024&w=is&k=20&c=8kl_w5jivpsX5b37MGa9D60Ykw0RDS2wYYf9-j9Gmbk=",
  price: 50 + i,
  variants: ["Red", "Black", "Blue"],
  sizes: ["6", "7", "8", "9", "10"],
  stock: 100 - i * 2,
}));

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Product.deleteMany();
  await Product.insertMany(dummyProducts);
  console.log("Seeded 2 dummy products with sizes.");
  mongoose.connection.close();
}

seed();
