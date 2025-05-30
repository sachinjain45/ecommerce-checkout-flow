import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import sendMail from "@/lib/sendMail";

interface DeclineRequestBody {
  email: string;
  fullName: string;
  product?: {
    title?: string;
    price?: number;
  };
  variant?: string;
  quantity?: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as DeclineRequestBody;

    const { email, fullName, product, variant = "", quantity = 0 } = body;

    const productTitle = product?.title ?? "";
    const productPrice = (product?.price ?? 0) * quantity;

    await sendMail({
      status: "declined",
      to: email,
      orderNumber: "N/A",
      totalPrice: 0,
      customer: {
        fullName,
      },
      product: {
        title: productTitle,
        price: productPrice,
        quantity,
        variant,
      },
      message: "Transaction was declined or an error occurred.",
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error sending decline email:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
