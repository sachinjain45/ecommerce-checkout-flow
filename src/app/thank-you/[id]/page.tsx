import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { Container, Row, Col, Image, Badge, Button } from "react-bootstrap";
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
      className="min-vh-100 d-flex justify-content-center align-items-center py-5"
      style={{
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      <div
        className="bg-white shadow-lg rounded-4 p-5"
        style={{ maxWidth: 900, width: "100%" }}
      >
        <div className="text-center mb-5">
          <h1 className="text-success fw-bold display-4">Thank You!</h1>
          <p className="text-secondary fs-5 mt-3 mb-0">
            Your order has been placed successfully.
          </p>
          <p className="text-muted small mt-1">
            Order ID: <span className="fw-semibold">{order.orderNumber}</span>
          </p>
        </div>

        <h2 className="fw-semibold text-dark mb-4 text-center">
          Order Summary
        </h2>
        <Row className="align-items-center border rounded-4 p-4 shadow-sm mb-5">
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <Image
              src={product?.image || "/placeholder.png"}
              alt={product?.title || "Product Image"}
              fluid
              rounded
              style={{
                maxHeight: 400,
                objectFit: "cover",
                width: "100%",
                borderRadius: "1rem",
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <h3 className="fw-semibold mb-3">{product?.title || "N/A"}</h3>
            <p className="text-muted mb-2 fs-5">
              Quantity:{" "}
              <span className="fw-semibold">{product?.quantity || 1}</span>
            </p>
            <p className="text-muted mb-4 fs-5">
              Total Price:{" "}
              <span className="fw-bold text-primary">
                ₹{product?.totalPrice || 0}
              </span>
            </p>
          </Col>
        </Row>

        <h2 className="fw-semibold text-dark mb-4 text-center">
          Shipping Information
        </h2>
        <div className="border rounded-4 p-4 shadow-sm mb-5 bg-light">
          <p className="mb-2 fs-5">
            <strong>Name:</strong> {customer?.fullName || "N/A"}
          </p>
          <p className="mb-2 fs-5">
            <strong>Address:</strong> {customer?.address || "N/A"},{" "}
            {customer?.city}, {customer?.state} - {customer?.zipCode}
          </p>
          <p className="mb-0 fs-5">
            <strong>Phone:</strong> {customer?.phone || "N/A"}
          </p>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <Badge
            bg={transactionStatus === "success" ? "success" : "warning"}
            className="fs-6 px-4 py-3 shadow-sm"
            style={{ minWidth: 180, textAlign: "center" }}
          >
            Status:{" "}
            <span className="fw-semibold">
              {transactionStatus === "success"
                ? "Payment Confirmed"
                : "Pending"}
            </span>
          </Badge>

          <Link href="/landing" passHref legacyBehavior>
            <Button variant="primary" size="lg" className="px-4">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
