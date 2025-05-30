import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { Container, Row, Col, Image, Badge } from "react-bootstrap";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({ params }: any) {
  await dbConnect();
  const order = await Order.findOne({ orderNumber: params.id });

  if (!order) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      >
        <p className="text-danger fs-5 fw-semibold">Order not found</p>
      </Container>
    );
  }

  const { customer, product, transactionStatus } = order;

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-start py-5"
      style={{
        background: "linear-gradient(to bottom right, #f9fafb, #fff)",
      }}
    >
      <div
        className="bg-white shadow rounded-3 p-4"
        style={{ maxWidth: 900, width: "100%" }}
      >
        <div className="text-center mb-4">
          <h1 className="text-success fw-bold">Thank You!</h1>
          <p className="text-secondary fs-5 mt-3">
            Your order has been placed successfully.
          </p>
          <p className="text-muted small mt-2">
            Order ID: <span className="fw-semibold">{order.orderNumber}</span>
          </p>
        </div>

        <div className="mb-4 text-center">
          <h2 className="fw-semibold text-dark">Your Order Summary</h2>
          <Row className="align-items-center border rounded-3 p-3 mt-3">
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <Image
                src={product?.image || "/placeholder.png"}
                alt={product?.name || "Product Image"}
                fluid
                rounded
                style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
              />
            </Col>
            <Col xs={12} md={6} className="text-start">
              <p className="fs-4 fw-medium mb-2">{product?.name || "N/A"}</p>
              <p className="text-muted mb-1">
                Quantity:{" "}
                <span className="fw-semibold">{product?.quantity || 1}</span>
              </p>
              <p className="text-muted">
                Total Price:{" "}
                <span className="fw-semibold">₹{product?.totalPrice || 0}</span>
              </p>
            </Col>
          </Row>
        </div>

        <div className="mb-4 border rounded-3 p-3">
          <h2 className="fw-semibold mb-3 text-dark">Shipping Information</h2>
          <div className="text-secondary">
            <p className="mb-1">{customer?.name || "N/A"}</p>
            <p className="mb-1">{customer?.address || "N/A"}</p>
            <p className="mb-1">
              {customer?.city}, {customer?.state} - {customer?.zipCode}
            </p>
            <p>Phone: {customer?.phone || "N/A"}</p>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <Badge
            bg={transactionStatus === "success" ? "success" : "warning"}
            className="fs-6 px-3 py-2"
          >
            Status:{" "}
            {transactionStatus === "success" ? "Payment Confirmed" : "Pending"}
          </Badge>
          <Link href="/landing" passHref className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
