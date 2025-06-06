import nodemailer from "nodemailer";

type MailStatus = "approved";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.NEXT_MAILTRAP_USER,
    pass: process.env.NEXT_MAILTRAP_PASS,
  },
});

interface SendMailOptions {
  status: MailStatus;
  to: string;
  orderNumber: string;
  totalPrice: number;
  customer: {
    fullName: string;
  };
  product: {
    title: string;
    price: number;
    quantity: number;
    variant: string;
  };
  message?: string;
}

export default async function sendMail({
  status,
  to,
  orderNumber,
  totalPrice,
  customer,
  product,
  message,
}: SendMailOptions): Promise<void> {
  if (status !== "approved") {
    throw new Error("Invalid status for order confirmation email");
  }
  const subject = "🎉 Order Confirmation";
  const defaultMessage =
    "Thank you for your purchase! Your order has been confirmed.";

  const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
    <h2 style="text-align: center; color: #28a745;">${subject}</h2>
    <p>${message || defaultMessage}</p>
    
    <h3 style="margin-top: 30px;">Order Summary</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Order #</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Customer</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          customer.fullName
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Product</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${product.title} (${
    product.variant
  })</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Quantity</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          product.quantity
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Price</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${product.price.toFixed(
          2
        )}</td>
      </tr>
      <tr style="font-weight: bold;">
        <td style="padding: 8px; border: 1px solid #ddd;">Total</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${totalPrice.toFixed(
          2
        )}</td>
      </tr>
    </table>

    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email. <br>Thank you for shopping with us!</p>

    <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
  `;

  await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    to,
    subject,
    html: emailHtml,
    text: `${message || defaultMessage}\n\nOrder #: ${orderNumber}\nCustomer: ${
      customer.fullName
    }\nProduct: ${product.title} (${product.variant})\nQuantity: ${
      product.quantity
    }\nPrice: $${product.price}\nTotal: $${totalPrice}`,
  });
}
