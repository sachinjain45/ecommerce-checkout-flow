import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const product = await Product.findOne();
  return NextResponse.json(product);
}
